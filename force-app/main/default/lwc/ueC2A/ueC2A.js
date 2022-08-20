import { LightningElement,track, api,wire } from 'lwc';
import getOpenC2AS from "@salesforce/apex/ManageC2A.getOpenTasks";
import getCompletedC2AS from "@salesforce/apex/ManageC2A.getCompletedTasks";
import updateTask from "@salesforce/apex/ManageC2A.updateTask";
import { refreshApex } from '@salesforce/apex';
import DESC_FIELD from '@salesforce/schema/Task.Description';
import STATUS_FIELD from '@salesforce/schema/Task.Status';
import ID_FIELD from '@salesforce/schema/Task.Id';
import { ShowToastEvent } from "lightning/platformShowToastEvent";

export default class UeC2A extends LightningElement {

    spidOpen = true;
    spidClosed;
    activeSections = ['A', 'B'];
    activeSectionsComp = ['comptkssec'];
    
    @api recordId;
    wtSubject;
    @track openTasks;
    openTasksOther;
    @track completedTasks;
    tStatus;
    tDesc;
    tId;
    selectedTaskRecId;
    accordName;
    _wiredOpenTasksRecord
    _wiredCompTasksRecord;
    isSPID;
    //optkssec;
    //activeSectionsMessage = '';


    @wire(getOpenC2AS,{wtId: '$recordId'})
    wiredOpenTasks(result){

        this._wiredOpenTasksRecord = result;
        console.log("Result is:" + JSON.stringify(this._wiredOpenTasksRecord));
        if(result.data){
            console.log("Work Task Record Id is:" + this.recordId);


            
            this.openTasks = result.data;
            console.log(JSON.stringify(this.activeSections));
            console.log(JSON.stringify(this.openTasks));


            const peopleArray = Object.values(this.openTasks);
            console.log("peopleArray is:" + JSON.stringify(peopleArray));
            this.isSPID = JSON.stringify(peopleArray).includes("Create SPID");
            this.isReqNMISO = JSON.stringify(peopleArray).includes("Request B2B Service Orders");
            console.log("isSPID value is:" + this.isSPID);
            console.log("isReqNMISO value is:" + this.isReqNMISO);

            /*const objectArray = Object.entries(this.openTasks);

objectArray.forEach(([key, value]) => {
  console.log("key is:" + key); // 'one'
  console.log("value is:" + value); // 1
});*/
            
         
           
        }
        else if(result.error){
            this.showToast('ERROR', error.body.message, 'error');
        }
    }

    @wire(getCompletedC2AS,{wtId: '$recordId'})
    wiredCompletedTasks(result){
        this._wiredCompTasksRecord = result;
        if(result.data){
            console.log("Work Task Record Id is:" + this.recordId);


            
            this.completedTasks = result.data;
            //this.accordName = this.template.querySelector("lightning-accordion-section[data-my-id=in1]");
            //console.log("Accordian Name is" + this.accordName);
            //this.activeSections.push(this.accordName);
            console.log(JSON.stringify(this.activeSections));
            console.log(JSON.stringify(this.completedTasks));
            
         
           
        }
        else if(result.error){
            this.showToast('ERROR', error.body.message, 'error');
        }
    }

    handleRefreshThisCompo(){
        //return refreshApex(this.openTasks);

       /* const refreshThisCompoEvent = new CustomEvent('refreshthiscompo', {
            detail: { "isSuccess": true },
        });
        // Fire the custom event
        this.dispatchEvent(refreshThisCompoEvent);*/

        this.refreshHandler();
    }

    refreshHandler() {
        refreshApex(this._wiredOpenTasksRecord);
        refreshApex(this._wiredCompTasksRecord);

        return;
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