import { LightningElement } from 'lwc';
import { createRecord } from 'lightning/uiRecordApi';
import { NavigationMixin } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import ACCOUNT_OBJECT from '@salesforce/schema/Account';
import CONTACT_OBJECT from '@salesforce/schema/Contact';
import FirstName from '@salesforce/schema/Contact.FirstName';
import LastName from '@salesforce/schema/Contact.LastName';
export default class CreateCustomer extends LightningElement {
    objectApiName = CONTACT_OBJECT;
    fields = [FirstName,LastName]
    myRecId;

    handleSuccess(event){
        const toastEvent = new ShowToastEvent({
            title: "Contact created",
            message: "Record ID: " + event.detail.id,
            variant: "success"

        });
       
       
        this.myRecId = event.detail.id;
        console.log(this.myRecId);
        
        this.dispatchEvent(toastEvent);
        
     
        //navigateToViewContactPage();

        
    }
    
    
    

      // Navigate to View Account Page
      navigateToViewContactPage() {
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: this.myRecId,
                objectApiName: 'Contact',
                actionName: 'view'
            },
        });
    }

    

    


}