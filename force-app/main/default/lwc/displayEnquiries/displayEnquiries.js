import { LightningElement, track,api, wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import displayenquiries from '@salesforce/apex/DisplayEnqs.DisplayEnqs';
const actions = [
    { label: 'View Enquiry', name: 'view_enquiry' },
    { label: 'Delete', name: 'delete' },
    { label: 'View Contact', name: 'view_contact' },
];
export default class DisplayEnquiries extends NavigationMixin(LightningElement) {
    record = {};
    @track columns = [{
        label: 'Enquiry Name',
        fieldName: 'Name',
        type: 'text',
        sortable: true
    },
    {
        label: 'Enquiry Type',
        fieldName: 'Enquiry_Type__c',
        type: 'text',
        sortable: true
    },
    {
        label: 'Days Open',
        fieldName: 'Days_Open__c',
        type: 'formula',
        sortable: true
    },
    {
        type: 'action',
        typeAttributes: { rowActions: actions },
    }
    ];

    @track enqList
    @track error;
    @wire(displayenquiries)
    wiredEnquiries({
        error,
        data
    }) {
        if (data){
            this.enqList = data;
            this.error = undefined;
        }else if (error){
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
            case 'view_enquiry':
                this.navigateToViewEnqPage(event);
                break;
            case 'view_contact':
                this.navigateToViewContactPage(event);
                break;
            default:
        }
    }

        showRowDetails(row) {
            this.record = row;
            
        }

    // Navigate to View Enquiry Page
    navigateToViewEnqPage(event) {
        const row = event.detail.row;
        console.log("Inside NavigationMixin");
        console.log(row.Id);
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: row.Id,
                actionName: 'view'
            }
        });
    }

    // Navigate to View Contact Page
    navigateToViewContactPage(event) {
        const row = event.detail.row;
        console.log("Inside NavigationMixin for Contact");
        console.log(row.Contact__c);
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: row.Contact__c,
                actionName: 'view'
            }
        });
    }
    



}