import { LightningElement,track,wire,api } from 'lwc';
import displaycontact from '@salesforce/apex/DisplayContacts.DisplayContacts';
import { NavigationMixin } from 'lightning/navigation';
const actions = [
    { label: 'Show details', name: 'show_details' },
    { label: 'Delete', name: 'delete' },
    { label: 'View', name: 'view' },
];
export default class DisplayContacts extends NavigationMixin(LightningElement) {

    record = {};
    @track recordId;
   

    @track columns = [{
        label: 'Contact Id',
        fieldName: 'Id',
        type: 'text',
        sortable: true
    },
    {
        label: 'Account Name',
        fieldName: 'Account.Name',
        type: 'text',
        sortable: true
    },
    {
        label: 'First Name',
        fieldName: 'FirstName',
        type: 'text',
        sortable: true
    },
    {
        label: 'Last Name',
        fieldName: 'LastName',
        type: 'text',
        sortable: true
    },
    {
        label: 'Phone',
        fieldName: 'Phone',
        type: 'phone',
        sortable: true
    },
    {
        label: 'Email',
        fieldName: 'Email',
        type: 'text',
        sortable: true
    },
    {
        type: 'action',
        typeAttributes: { rowActions: actions },
    }
    ];

    @track error;
    @track conList;
    @wire(displaycontact)
    wiredContacts({
        error,
        data
    }) {
        if (data) {
            this.conList = data;
            this.recordId = data.Id;
        } else if (error) {
            this.error = error;
        }
    }

    handleRowAction(event){
        console.log("In handleRowAction");
        const actionName = event.detail.action.name;
        const row = event.detail.row;
        //this.recordId = row.Id;
        const myRecId = row.Id;
        console.log(myRecId);
        switch (actionName){
            case 'delete':
                break;
            case 'show_details':
                console.log("Before Show Details");
                this.showRowDetails(row);
                console.log("After Show Details");
                break;
            case 'view':
                this.navigateToViewContactPage(event);
                break;
            default:
        }
    }

        showRowDetails(row) {
            this.record = row;
            
        }

    // Navigate to View Contact Page
    navigateToViewContactPage(event) {
        const row = event.detail.row;
        console.log("Inside NavigationMixin");
        console.log(row.Id);
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: row.Id,
                //objectApiName: 'Contact',
                actionName: 'view'
            }
        });
    }
    



}