import { LightningElement,api } from 'lwc';

export default class UtilsLookUp extends LightningElement {

    @api childObjectApiName = 'Contact';
    @api targetFieldApiName = 'AccountId';
    @api required = false;
    @api disabled = false;
    @api value;
    @api resetForm = false;
    @api displayReset;


handleChange(event){
// Creates the event
const selectedEvent = new CustomEvent('valueselected', {
    detail: event.detail.value
});
//dispatching the custom event
this.dispatchEvent(selectedEvent);
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

    const selectedEvent = new CustomEvent('selectedrecord', {
        detail: ''
    });
    //dispatching the custom event
    this.dispatchEvent(selectedEvent);

 }



}