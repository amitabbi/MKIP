import { LightningElement,wire } from 'lwc';
import getContacts from '@salesforce/apex/Interactions.getContacts';
export default class InteractionSource extends LightningElement {

    contacts;

    connectedCallback(){
        this.fetchContacts();
    }

    fetchContacts(){
        getContacts()
        .then(result => {
            console.log("result :", result);
            this.contacts = result;
        })
    }


    handlePassAddress(event){
    event.preventDefault();
    let selectedContactId = event.currentTarget.dataset.id;
    const selectedEvent = new CustomEvent('sourcecontact', { detail: {contactId: selectedContactId}, bubbles: true });
    // Dispatches the event.
    this.dispatchEvent(selectedEvent);
    }


    getMailingAddress(recordId) {
        const found = this.contacts.find(element => {
            return element.Id == recordId
        })
        return found;
    }



}