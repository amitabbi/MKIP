import { LightningElement, wire,track,api } from 'lwc';
import displayEnqs from '@salesforce/apex/DisplayEnqs.DisplayEnqs';
import displayEnqsByType from '@salesforce/apex/DisplayEnqsByType.DisplayEnqsByType';
import { NavigationMixin } from 'lightning/navigation';
import { refreshApex } from '@salesforce/apex';
import red_flag from '@salesforce/resourceUrl/Red_Flag';

const actions = [
    { label: 'View', name: 'view' },
    { label: 'Edit', name: 'edit' },
];


const columns = [

    {
        fieldName: '',
        label: '',
        initialWidth: 34,
        cellAttributes: { iconName: 'custom:custom53'},
        iconPosition: 'center', 
    },
   // {label: 'Status',cellAttributes: { class: { fieldName: 'Escalated_Enquiry_Image__c' } }},
    {label: 'Status',cellAttributes: { class: { fieldName: 'Escalated_Enquiry_Image__c' } }},
    { label: 'Name', fieldName: 'Name' },
    { label: 'Enquiry Type', fieldName: 'Enquiry_Type__c'},
    { label: 'Days Open', fieldName: 'Days_Open__c' },
    {
        type: 'action',
        typeAttributes: { rowActions: actions },
    },
    {
        type: 'button',
        typeAttributes: {
    iconName: 'utility:edit',
    label: 'Edit', 
    name: 'editRecord', 
    title: 'editTitle', 
    disabled: false, 
    value: 'test'
    },
    }
];



export default class DisplayEscalatedEnquiries extends NavigationMixin(LightningElement) {

    @track data = [];
    @track columns = columns;
    record = {};
    @api allOpenEnqList;
    @track error;
    @api counter = 1;

    

  
    
    get enqByTypes() {
        return [
            { label: 'New', value: 'New' },
            { label: 'In Progress', value: 'In Progress' },
            { label: 'Escalated', value: 'Escalated' },
            { label: 'Cancelled', value: 'Cancelled' },
            { label: 'Closed', value: 'Closed' }
        ];
    }
    
    
   


    @wire(displayEnqs)
    wiredEnqs({error,data}){
        if (data){
            this.allOpenEnqList = data;
           
        } else if (error){
            this.error = undefined;
        }
    }

    

    // eslint-disable-next-line @lwc/lwc/no-async-await
    connectedCallback() {
        //this.data = await fetchDataHelper({ amountOfRecords: 100 });
        displayEnqs()
        .then(result => {
            this.allOpenEnqList = result;
            this.error = undefined;
            
        })
        .catch(error => {
            this.error = error;
        });
        //console.log(result);
        
    }

    handleRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;
        switch (actionName) {
            case 'view':
                this.navigateToViewPage(row);
                break;
            case 'edit':
                this.navigateToEditPage(row);
                break;
            case 'editRecord':
                this.navigateToEditPage(row);
                break;
            default:
        }
    }

    navigateToViewPage(row){
        console.log(row);
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: row.Id,
                actionName: 'view'
            }
        });
    }

    navigateToEditPage(row){
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: row.Id,
                actionName: 'edit'
            }
        });
    }

    showRowDetails(row) {
        this.record = row;
    }

    @api
    refresh(){
        return refreshApex(this.allOpenEnqList);
    }



    handleEnqTypeSelect(event){

        const eType = event.detail.value;
        console.log("Type is: " + eType);
        console.log("Before getRecsByEnqType");
        displayEnqsByType({Type:eType})
        
        .then(result => {
            console.log("Inside getRecsByEnqType");
                this.allOpenEnqList = result;
                console.log("Result is: " + result);
            
            
        })
        .catch(error=>{
            this.error = error.body.message;
            console.log("Error is: " + this.error);
        })

    }

  
}