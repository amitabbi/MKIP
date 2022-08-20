import { LightningElement, track, wire } from 'lwc';
import getContactList from '@salesforce/apex/searchAnyController.getContactList';

const columns = [
    { label: 'First Name', fieldName: 'FirstName' },
    { label: 'Last Name', fieldName: 'LastName' },
    { label: 'Title', fieldName: 'Title' },
    { label: 'Phone', fieldName: 'Phone', type: 'phone' },
    { label: 'Email', fieldName: 'Email', type: 'email' }
];

export default class SearchAny extends LightningElement {

    @track greet = "World";
    @track columns = columns;
    
    changeHandler(event) {
        this.greet = event.target.value;
    }

    @wire(getContactList)
    contacts;

}