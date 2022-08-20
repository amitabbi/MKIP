import { LightningElement, api } from 'lwc';
import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import updateTask from "@salesforce/apex/ManageC2A.updateTask";

export default class UeCallToActionOtherItem extends LightningElement {

    @api opothtks;
    activeSections1 = ['opothertkssec'];
    lblCompleted = 'Mark As Completed';
    @api wtid;


    handleChange(event){
        if (event.target.name === 'tDescription') {
            this.tDescrip = event.target.value;
        }
    }

    markCompletedHandler(event){
        console.log("Work Task Record Id is:" + this.wtId);
        debugger;

        var selectedTaskId  = event.target.id;
        this.selectedTaskRecId = selectedTaskId.substring(0,18);
        console.log(this.selectedTaskRecId);


        const allValid = [...this.template.querySelectorAll('lightning-input')]
            .reduce((validSoFar, inputFields) => {
                inputFields.reportValidity();
                return validSoFar && inputFields.checkValidity();
            }, true);

        if (allValid) {

            updateTask({
                tId: this.selectedTaskRecId,
                tDescrip: this.tDescrip

            })
            .then(result => {

                this.showToast('SUCCESS', 'Task Record Updated Successfully', 'success');
          
          

            })
            .catch(error => {
                this.showToast('ERROR', error.body.message, 'error');
            });

        }
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