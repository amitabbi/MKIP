import { LightningElement, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent'
export default class ModifyAAProduct extends LightningElement {
    @api recordId;
    handleSuccess(event){
        console.log(event.detail.id);
        const toastEvent = new ShowToastEvent({
            title:"Contact Modified",
            message:"Contact is modified" + event.detail.id,
            variant:"success"

        });
        this.dispatchEvent(toastEvent);
    }

        handleSubmit(event) {
            console.log('onsubmit event recordEditForm'+ event.detail.fields);
        }

        handleReset(event) {
            const inputFields = this.template.querySelectorAll(
                'lightning-input-field'
            );
            if (inputFields) {
                inputFields.forEach(field => {
                    field.reset();
                });
            }
         }

    
}