import { LightningElement,api,track } from 'lwc';

export default class CreateWizardStep1 extends LightningElement {
@track aName;
@track Message;

@api connectedCallback(accName){
    //console.log();
    this.aName = accName;
    //this.template.querySelector('lightning-input[aName]').value = accName;
    //this.template.querySelector(".inputCmp").value = "Great";
    console.log("Inside setInputVal");
    this.Message = "Great";
}

    handleTextChange(event){
        this.aName = event.target.value;
        console.log("Inside step 1 js" + this.aName);

        // Creates the event with the data.
    const selectedEvent = new CustomEvent("accountnamevaluechange", {
        detail: this.aName,
        bubbles: true
        
      });
      
      // Dispatches the event.
      this.dispatchEvent(selectedEvent);
    }
}