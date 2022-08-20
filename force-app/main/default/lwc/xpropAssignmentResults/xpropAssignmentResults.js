import { LightningElement,api,wire,track } from 'lwc';
import getAllUnassignedAgents from "@salesforce/apex/GetXPropTabData.getAllUnassignedAgents";
import getAgentAssignmentsForModal from "@salesforce/apex/GetXPropTabData.getAgentAssignmentsForModal";
import getAgentAssignedFlag from "@salesforce/apex/GetXPropTabData.getAgentAssignedFlag";
import getTypeAheadAgents from "@salesforce/apex/GetXPropTabData.getTypeAheadAgents";
import assignAgents from "@salesforce/apex/GetXPropTabData.assignAgents";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { createRecord } from 'lightning/uiRecordApi';
import { refreshApex } from '@salesforce/apex';
import AGENT_USER_FIELD from '@salesforce/schema/XProp_ContactLot__c.Agent_User__c';
import LOT_FIELD from '@salesforce/schema/XProp_ContactLot__c.Lot__c';
import CONTACT_FIELD from '@salesforce/schema/XProp_ContactLot__c.Contact__c';
import CONTACT_LOT_OBJECT from '@salesforce/schema/XProp_ContactLot__c';

/** The delay used when debouncing event handlers before invoking Apex. */
const DELAY = 300;

const columns = [{
    label: "Name",
    fieldName: "Name"
},
{
    label: "Owner",
    fieldName: "OwnerId",
    id: 'OwnerId'
},
{
    type: 'button',
    initialWidth: 200,
    label: 'View',
    typeAttributes: {
        iconName: 'action:preview',
        label: 'View',
        name: 'viewExisingAllocations',
        title: 'viewExisingAllocations',
        disabled: false,
        value: 'test'
    },
},
];

export default class XpropAssignmentResults extends LightningElement {

    @api lotId;
    @api lotName;
    @track agents = [];
    error;
    agentallocations = [];
    agenttabularlist = [];
    selectedAgentId;
    selectedAgentName;
    perAgentSelected;
    bulkSelected;
    searchSelected;
    showAlreadyAssignedModal = false;
    @track isModalOpen = false;
    isLoading;
    selectedAgentConId;
    _wiredResult;
    _wiredModalResult;
    agentsTypeAheadRes;
    showSearchResults;
    agentsDtList;
    columns = columns;
    selectedRecords = [];
    selectedConRecords = [];

    

    get optionsAssign() {
        return [
            { label: 'Bulk', value: 'Bulk' },
            { label: 'Per Agent', value: 'Per Agent' },
            { label: 'Search', value: 'Search' },
        ];
    }

    selectHandler(event){
       

        this.radioGroupAssignVal = event.target.value;

        if (this.radioGroupAssignVal === 'Bulk'){
            this.perAgentSelected = false;
            this.bulkSelected = true;
            this.searchSelected = false;
        }else if (this.radioGroupAssignVal === 'Per Agent'){
            this.perAgentSelected = true;
            this.bulkSelected = false;
            this.searchSelected = false;
        }else{
            this.searchSelected = true;
            this.perAgentSelected = false;
            this.bulkSelected = false;
        }
    }

    @wire(getTypeAheadAgents, { searchKey: '$searchKey' })
    agentsTypeAheadRes;
    

    @wire(getAllUnassignedAgents,{lotId: '$lotId'})
    wiredAgents({data,error}){
        //this._wiredResult = result;
        if(data){
            this.agents = data;
            this.agentsDtList = data;
            console.log(JSON.stringify(this.agents));

           
           
        }
        else if(error){
            this.showToast('ERROR', error.body.message, 'error');
        }
    }
    

    get agentsFound(){
        //console.log("Length is:" + Object.keys(this.agents).length);
        if (Object.keys(this.agents).length > 0 && this.lotId.length > 0){
            return true;
        }
        return false;
    }

    assignLotHandler(event){
        event.preventDefault();

        var selectedAgent = event.target.id;
        this.selectedAgentId = selectedAgent.substring(0, 18);
        console.log("selectedAgentId on Assign" + this.selectedAgentId);

       // var selectedAgentCon = event.target.key;
        this.selectedAgentConId = event.target.dataset.cid
        //this.selectedAgentConId = selectedAgentCon.substring(0, 18);
        console.log("selectedAgentConId in on Assign" + this.selectedAgentConId);
        

        getAgentAssignedFlag({
            agentId: this.selectedAgentId,
            lotId : this.lotId
        })
        .then(data => {
            console.log("data" + data);
            if (data === true){
                return this.showAlreadyAssignedModal = true;
            }else if (data === false){
                this.assignAgent(); // assign selected lot to he selected agent
            }

     

        })
        .catch(error => {
            this.error = error;
        });



    }

    assignAgent(){
        this.isLoading = true;
        const fields = {};
        fields[AGENT_USER_FIELD.fieldApiName] = this.selectedAgentId;
        fields[LOT_FIELD.fieldApiName] = this.lotId;
        fields[CONTACT_FIELD.fieldApiName] = this.selectedAgentConId;
        

      

        const recordInput  = {apiName : CONTACT_LOT_OBJECT.objectApiName, fields};

        createRecord(recordInput).then( feedback => {



            this.showToast('SUCCESS', 'Lot Assignment Record Created Successfully', 'success');
            this.isLoading = false;
          

        }).catch( error => {
            //console.log("Inside Error enquiries promise");
            //this.isLoading = false;
            this.showToast('ERROR', error.body.message, 'error');
            this.isLoading = false;
        });

    }

    showAllocationHandler(event){
        event.preventDefault();
        
        var selectedAgent = event.target.id;
        this.selectedAgentId = selectedAgent.substring(0, 18);
        console.log("selectedAgentId in View Modal" + this.selectedAgentId);

        this.selectedAgentName = event.target.name;

        this.isModalOpen = true;

        getAgentAssignmentsForModal({
            agentId: this.selectedAgentId
        })
        .then(data => {
            //this._wiredModalResult = result;
            this.agentallocations = data;

     

        })
        .catch(error => {
            this.error = error;
        });

    }

    get agentsAllocFound(){
        if (Object.keys(this.agentallocations).length > 0){
            return true;
        }
        return false;
    }

    closeModal() {
        // to close modal set isModalOpen tarck value as false
        this.isModalOpen = false;
        this.showAlreadyAssignedModal = false;
    }

    handleKeyChange(event){
        this.isLoading = true;
        const searchKey = event.target.value;
        if (searchKey.trim() === ''){
            this.isLoading = false;
            return this.showSearchResults = false;
        }
        this.showSearchResults = true;
        
        window.clearTimeout(this.delayTimeout);
        
        
        console.log("Search Key is:" + searchKey);
        this.delayTimeout = setTimeout(() => {
            
            this.searchKey = searchKey.trim();
            this.isLoading = false;
        }, DELAY);
    }

    handleRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;
        console.log("Row Id is:" + row.OwnerId);
        switch (actionName) {
            case 'viewExisingAllocations':
                this.viewExisingAllocations(row);
                break;
            default:
        }
    }

    viewExisingAllocations(row){
        this.isModalOpen = true;

        getAgentAssignmentsForModal({
            agentId: row.OwnerId
        })
        .then(data => {
            //this._wiredModalResult = result;
            this.agentallocations = data;

     

        })
        .catch(error => {
            this.error = error;
        });
    }

    getSelectedRecords(event){
        // getting selected rows
        const selectedRows = event.detail.selectedRows;
        

         // this set elements the duplicates if any
         let agentOwnerIds = new Set();
         let agentConIds = new Set();

         // getting selected record id
         for (let i = 0; i < selectedRows.length; i++) {
            agentConIds.add(selectedRows[i].Id);
            agentOwnerIds.add(selectedRows[i].OwnerId);
            
        }


        // coverting to array
        this.selectedRecords = Array.from(agentOwnerIds);
        this.selectedConRecords = Array.from(agentConIds);
    }

    assignHandler(){

        console.log("agentOwnerIds" + this.selectedRecords);
        console.log("lotId" + this.lotId);
        console.log("agentConIds" + this.selectedConRecords);

        assignAgents({
            agentOwnerIds: this.selectedRecords,
            lotId : this.lotId,
            agentConIds: this.selectedConRecords
        })
        .then(result => {
            //console.log("data" + data);
            //if (data){
                console.log("Before Toast");
                this.showToast('SUCCESS', 'Agents Assigned', 'success');
                console.log("After Toast");
            //}else if (data === false){
                //return this.showToast('error', 'Contact your system administrator', 'error');
            //}

     

        })
        .catch(error => {
            this.error = error;
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