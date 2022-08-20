import { LightningElement,api } from 'lwc';

export default class CreateWizardStep2 extends LightningElement {

    @api fName;
    @api lName;
    @api FirstName
    @api LastName

    handleTextChange(event){
        if (event.target.name === "fName"){
        this.fName = event.target.value;
        console.log(this.fName);
        }
        if (event.target.name === "lName"){
            this.lName = event.target.value;
            console.log(this.lName);
        }

        
         // Creates the event with the data.
    const selectedFNameEvent = new CustomEvent("connamevaluechange", {
        detail: {FirstName:this.fName,LastName:this.lName},
        bubbles: true
        
      });
      
      // Dispatches the event.
      this.dispatchEvent(selectedFNameEvent);

        
        
        
    }
}