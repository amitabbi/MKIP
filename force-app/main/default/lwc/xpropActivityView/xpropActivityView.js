import {
    LightningElement,
    api,
    wire,
    track
} from 'lwc';
import getLotOpportunities from "@salesforce/apex/GetXPropTabData.getLotOpportunities";
import getOpportunityTasks from "@salesforce/apex/GetXPropTabData.getOpportunityTasks";
import getOpportunityEvents from "@salesforce/apex/GetXPropTabData.getOpportunityEvents";
import createTask from "@salesforce/apex/GetXPropTabData.createTask";
import createEvent from "@salesforce/apex/GetXPropTabData.createEvent";
import {
    getRecord,
    getFieldValue
} from 'lightning/uiRecordApi';
import {
    getPicklistValues
} from 'lightning/uiObjectInfoApi';
import OPP_NAME_FIELD from '@salesforce/schema/Opportunity.Name';
import {
    ShowToastEvent
} from "lightning/platformShowToastEvent";
import {
    NavigationMixin
} from "lightning/navigation";
import USER_ID from '@salesforce/user/Id';
import {
    getObjectInfo
} from 'lightning/uiObjectInfoApi';
import TASK_OBJECT from '@salesforce/schema/Task';
import TASK_STATUS_FIELD from '@salesforce/schema/Task.Status';
import TASK_PRIORITY_FIELD from '@salesforce/schema/Task.Priority';
import {
    refreshApex
} from '@salesforce/apex';


const actions = [{
        label: "Edit",
        name: "edit"
    },
    {
        label: "Upload File",
        name: "fileupl"
    }
];

export default class XpropActivityView extends NavigationMixin(LightningElement) {
    lotOpportunities;
    oppActivities;
    @api lotId;
    @api lotName;
    @api selectedOppRecId;
    showOpp;
    showOppDt;
    showFileUpload;
    showNewTask;
    showNewEvent;
    tSubject;
    tStatus;
    tPriority;
    tDescription;
    eSubject;
    eStartDateTime;
    eEndDateTime;
    eDescription;
    @track tStatusOptions;
    @track error;
    _wiredActivities;



    @wire(getLotOpportunities, {
        lotId: '$lotId'
    })
    wiredLotOpps({
        data,
        error
    }) {
        if (data) {
            console.log("Lot Id in Opportunities tab is:" + this.lotId);



            this.lotOpportunities = data;
            console.log(JSON.stringify(this.agents));

            // hide the record edit form everytime a lottId is changed
            //if (this.lotId){
            if (this.lotId || this.lotId.length === 0) {
                this.showOpp = false;
                this.showOppDt = false;
                this.showNewTask = false;
                this.showNewEvent = false;
            }

        } else if (error) {
            this.showToast('ERROR', error.body.message, 'error');
        }
    }

    get showOpps() {
        if (this.lotOpportunities && this.lotId.length > 0) {
            return true;
        }
        return false;
    }

    @wire(getRecord, {
        recordId: '$selectedOppRecId',
        fields: [OPP_NAME_FIELD]
    })
    opportunity;

    get oppName() {
        return getFieldValue(this.opportunity.data, OPP_NAME_FIELD);
    }

    @wire(getObjectInfo, {
        objectApiName: TASK_OBJECT
    })
    wiredObject({
        data,
        error
    }) {
        if (data) {
            console.log(' Object iformation ', data);
            console.table(data);
        }
        if (error) {
            console.log(error);
        }
    }

    //@wire(getPicklistValues, { recordTypeId: '$objectInfo.data.defaultRecordTypeId', fieldApiName: TASK_STATUS_FIELD })
    //tStatusOptions;

    @wire(getPicklistValues, {
        recordTypeId: '0120o000001VGY8AAO',
        fieldApiName: TASK_STATUS_FIELD
    })
    wiredPickListStatusValue({
        data,
        error
    }) {
        if (data) {
            console.log(` Picklist values are `, data.values);
            this.tStatusOptions = data.values;
            this.error = undefined;
        }
        if (error) {
            console.log(` Error while fetching Picklist values  ${error}`);
            this.error = error;
            this.tStatusOptions = undefined;
        }
    }

    @wire(getPicklistValues, {
        recordTypeId: '0120o000001VGY8AAO',
        fieldApiName: TASK_PRIORITY_FIELD
    })
    wiredPickListPriorityValue({
        data,
        error
    }) {
        if (data) {
            console.log(` Picklist values are `, data.values);
            this.tPriorityOptions = data.values;
            this.error = undefined;
        }
        if (error) {
            console.log(` Error while fetching Picklist values  ${error}`);
            this.error = error;
            this.tPriorityOptions = undefined;
        }
    }


    showOppTaskHandler(event) {
        this.showOpp = true;
        var selectedOppId = event.target.id;
        this.selectedOppRecId = selectedOppId.substring(0, 18);
        console.log(this.selectedOppRecId);

        this.showOppDt = true;
        this.displayOppTasks();
    }

    get acceptedFormats() {
        return ['.pdf', '.png'];
    }

    handleUploadFinished(event) {
        // Get the list of uploaded files
        const uploadedFiles = event.detail.files;
        this.showToast('No. of files uploaded :', uploadedFiles.length, 'Success');
    }

    handleSubmit(event) {

        const outputFields = this.template.querySelectorAll(
            'lightning-output-field'
        );
        if (outputFields) {
            outputFields.forEach(field => {
                if (field.fieldName == 'Name')
                    this.updatedRecord = field.value;
                console.log("updatedRecord" + this.updatedRecord);
            });
        }
    }

    handleSuccess(event) {

        console.log("updatedRecord" + this.updatedRecord);
        this.showToast('Opportunity Updated Successfully', this.updatedRecord, 'Success');
    }

    displayOppTasks() {



        getOpportunityTasks({

                selectedOppId: this.selectedOppRecId,
                ownId: USER_ID

            })
            .then(result => {
                this._wiredActivities = result;
                this.columns = [{
                        label: "Subject",
                        fieldName: "Subject"
                    },
                    {
                        label: "Status",
                        fieldName: "Status"
                    },
                    {
                        label: "Activity Date",
                        fieldName: "ActivityDate"
                    },
                    {
                        type: "action",
                        typeAttributes: {
                            rowActions: actions
                        }
                    }
                ];


                this.oppActivities = result;
                console.log("Additional Contacts Result is :" + JSON.stringify(this.oppActivities));

            })
            .catch(error => {
                this.error = error;
            });
    }

    showOppTasksHandler() {
        this.displayOppTasks();
    }


    displayOppEvents() {



        getOpportunityEvents({

                selectedOppId: this.selectedOppRecId,
                ownId: USER_ID

            })
            .then(result => {
                this._wiredActivities = result;
                this.columns = [{
                        label: "Subject",
                        fieldName: "Subject"
                    },
                    {
                        label: "StartDateTime",
                        fieldName: "StartDateTime",
                        type: 'date',
                        typeAttributes: {
                            day: 'numeric',
                            month: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true
                        }
                    },
                    {
                        label: "EndDateTime",
                        fieldName: "EndDateTime",
                        type: 'date',
                        typeAttributes: {
                            day: 'numeric',
                            month: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true
                        }
                    },
                    {
                        type: "action",
                        typeAttributes: {
                            rowActions: actions
                        }
                    }
                ];


                this.oppActivities = result;
                console.log("Additional Contacts Result is :" + JSON.stringify(this.oppActivities));

            })
            .catch(error => {
                this.error = error;
            });
    }

    showOppEventsHandler() {
        this.displayOppEvents();
    }

    handleRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;
        console.log("Row Id is:" + row.Id);
        switch (actionName) {
            case "edit":
                this.navigateToEditPage(row);
                break;
            case "fileupl":
                this.showFileUpload = true;
                break;
            default:
        }
    }

    navigateToEditPage(row) {
        console.log(row);
        this[NavigationMixin.Navigate]({
            type: "standard__recordPage",
            attributes: {
                recordId: row.Id,
                actionName: "edit"
            }
        });
    }

    navigateToNewEventPage(row) {
        this[NavigationMixin.Navigate]({
            type: "standard__objectPage",
            attributes: {
                objectApiName: 'Event',
                actionName: "new"
            }
        });
    }

    newOppTaskHandler(event) {
        this.showNewEvent = false;
        this.showNewTask = true;
    }

    newOppEventHandler(event) {
        this.showNewEvent = true;
        this.showNewTask = false;
    }


    handleChange(event) {
        if (event.target.name === 'tSubject') {
            this.tSubject = event.target.value;
        }
        if (event.target.name === 'tActivityDate') {
            this.tActivityDate = event.target.value;
        }
        if (event.target.name === 'tStatus') {
            this.tStatus = event.target.value;
        }
        if (event.target.name === 'tPriority') {
            this.tPriority = event.target.value;
        }
        if (event.target.name === 'tDescription') {
            this.tDescription = event.target.value;
        }

        if (event.target.name === 'eSubject') {
            this.eSubject = event.target.value;
        }
        if (event.target.name === 'eStartDateTime') {
            this.eStartDateTime = event.target.value;
            console.log("this.eStartDateTime"+ this.eStartDateTime);
        }
        if (event.target.name === 'eEndDateTime') {
            this.eEndDateTime = event.target.value;
        }
        if (event.target.name === 'eDescription') {
            this.eDescription = event.target.value;
        }

    }

    handleTaskCancel() {
        this.showNewTask = false;
    }

    handleEventCancel() {
        this.showNewEvent = false;
    }


    handleTaskSave() {


        createTask({

                tSubject: this.tSubject,
                tActivityDate: this.tActivityDate,
                tStatus: this.tStatus,
                tPriority: this.tPriority,
                tDescription: this.tDescription,
                selectedOppId: this.selectedOppRecId

            })
            .then(result => {


                this.showToast('SUCCESS', 'Task Record Created Successfully', 'success');
                this.showNewTask = false;

                // clear the input fields after saving the record
                this.tSubject = '';
                this.tActivityDate = '';
                this.tStatus = '';
                this.tPriority = '';
                this.tDescription = '';

                // reset values in all fields
                return refreshApex(this.oppActivities);

            })
            .catch(error => {
                this.showToast('ERROR', error.body.message, 'error');
                //this.message = 'Error received: code' + error.errorCode + ', ' +
                //'message ' + error.body.message;
            });










        /*const fields = {};
        fields[TASK_SUBJECT_FIELD.fieldApiName] = this.tSubject;
        fields[TASK_ACTIVITYDATE_FIELD.fieldApiName] = this.tActivityDate;
        fields[TASK_STATUS_FIELD.fieldApiName] = this.tStatus;
        fields[TASK_PRIORITY_FIELD.fieldApiName] = this.tPriority;
        fields[TASK_DESCRIPTION_FIELD.fieldApiName] = this.tDescription;
        fields[TASK_WHATID_FIELD.fieldApiName] = this.selectedOppRecId;
        


     

        const recordInput  = {apiName : TASK_OBJECT.objectApiName, fields};

        createRecord(recordInput).then( enquiries => {
            console.log("Inside Save task promise");
            //this.isLoading = false;
           
            this.showToast(this,'SUCCESS', 'Task Record Created Successfully', 'success');
            this.showNewTask = false;
          

        }).catch( error => {
            //console.log("Inside Error enquiries promise");
            //this.isLoading = false;
            this.showToast(this,'ERROR', error.body.message, 'error');
        });
        */
    }

    handleEventSave() {


        createEvent({

                eSubject: this.eSubject,
                eStartDateTime: this.eStartDateTime,
                eEndDateTime: this.eEndDateTime,
                eDescription: this.eDescription,
                selectedOppId: this.selectedOppRecId

            })
            .then(result => {


                this.showToast('SUCCESS', 'Event Record Created Successfully', 'success');
                this.showNewEvent = false;

                // clear the input fields after saving the record
                this.eSubject = '';
                this.eStartDateTime = '';
                this.eEndDateTime = '';
                this.eDescription = '';

                return refreshApex(this.oppActivities);

            })
            .catch(error => {
                this.showToast('ERROR', error.body.message, 'error');
                //this.message = 'Error received: code' + error.errorCode + ', ' +
                //'message ' + error.body.message;
            });



        }

    showToast(title, message, variant) {
        const evt = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant
        });
        this.dispatchEvent(evt);
    }

}