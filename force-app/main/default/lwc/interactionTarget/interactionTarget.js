import { RecordFieldDataType } from 'lightning/uiRecordApi';
import { LightningElement,api,wire,track } from 'lwc';
import getContactAddress from '@salesforce/apex/Interactions.getContactAddress';
export default class InteractionTarget extends LightningElement {

@api contactId;
street;



@wire(getContactAddress, { recId: "$contactId" })
wiredContact({ error, data }) {
    if (data) {
        console.log("data :", data);
    

        this.street =  data[0].MailingAddress.street.replaceAll("\n", ' ');
        
                //City: data[0].MailingAddress.city,
                //Country: data[0].MailingAddress.country,
                //PostalCode: data[0].MailingAddress.postalCode


    } else if (error) {
        console.log("error :", error);
    }
}

}