import { LightningElement,api } from 'lwc';

export default class CreateWizardStep3 extends LightningElement {

    @api enqName;
    @api EnquiryName;

    handleTextChange(event){
        this.enqName = event.target.value;

        // Creates the event with the data.
    const selectedEnqEvent = new CustomEvent("enqnamevaluechange", {
        detail: {EnquiryName:this.enqName},
        bubbles: true
        
      });
      
      // Dispatches the event.
      this.dispatchEvent(selectedEnqEvent);
    }
}