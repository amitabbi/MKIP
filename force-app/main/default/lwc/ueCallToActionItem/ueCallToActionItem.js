import { LightningElement, api } from 'lwc';
import updateTask from "@salesforce/apex/ManageC2A.updateTask";
import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from "lightning/platformShowToastEvent";

export default class UeCallToActionItem extends LightningElement {
    @api optks;
    activeSections1 = ['optkssec'];
    lblCompleted = 'Mark As Completed';
    @api wtid;


    handleChange(event){
        if (event.target.name === 'tDescription') {
            this.tDescrip = event.target.value;
        }
    }

    markCompletedHandler(event){
        console.log("Work Task Record Id is:" + this.wtid);
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
          
                // reset values in all fields
                //return refreshApex(this.optks);

                const refreshThisCompoEvent = new CustomEvent('refreshthiscompo', {
                    detail: { "isSuccess": true },
                });
                // Fire the custom event
                this.dispatchEvent(refreshThisCompoEvent);

            })
            .catch(error => {
                this.showToast('ERROR', error.body.message, 'error');
                //this.message = 'Error received: code' + error.errorCode + ', ' +
                //'message ' + error.body.message;
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