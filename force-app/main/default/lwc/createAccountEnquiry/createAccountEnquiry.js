import { LightningElement,api,track } from 'lwc';
import { createRecord } from 'lightning/uiRecordApi';
import labelEnqName from '@salesforce/label/c.EnqName';
import ENQUIRY_OBJECT from '@salesforce/schema/Enquiry__c';
import NAME_FIELD from '@salesforce/schema/Enquiry__c.Name';
import TYPE_FIELD from '@salesforce/schema/Enquiry__c.Enquiry_Type__c';
import COMMENT_FIELD from '@salesforce/schema/Enquiry__c.Comments__c';
import CONTACT_FIELD from '@salesforce/schema/Enquiry__c.Contact__c';
import { showToast } from 'c/utils';

const actions = [
    { label: 'Show details', name: 'show_details' },
    { label: 'Delete', name: 'delete' },
];

const columns = [
    { label: 'Name', fieldName: 'name' },
    { label: 'Website', fieldName: 'website', type: 'url' },
    { label: 'Phone', fieldName: 'phone', type: 'phone' },
    { label: 'Balance', fieldName: 'amount', type: 'currency' },
    { label: 'Close At', fieldName: 'closeAt', type: 'date' },
    {
        type: 'action',
        typeAttributes: { rowActions: actions },
    },
];

export default class CreateAccountEnquiry extends LightningElement {
    label = {
        labelEnqName
      };



      enqName;
      enqCommentName;
      enqType;
      @api recordId;
      isLoading = false;
      columns = columns;
      //@track counter = 1;




      get enqTypes() {
        return [
            { label: 'New', value: 'New' },
            { label: 'In Progress', value: 'In Progress' },
            { label: 'Escalated', value: 'Escalated' },
            { label: 'Cancelled', value: 'Cancelled' },
            { label: 'Closed', value: 'Closed' }
        ];
    }

      handleEnqNameChange(event){
          this.enqName = event.target.value;
          
      }

      handleEnqCommentsChange(event){
        this.enqCommentName = event.target.value;
        
      }

      handleEnqTypesSelect(event){
        this.enqType = event.target.value;
        
      }

      @track counter = 1;
    changingVar = 'initial changingVar';
    get changingGetter() {
        return this.counter + ' changingGetter';
    }

      handleSaveClick(event){

        const fields = {};
        fields[NAME_FIELD.fieldApiName] = this.enqName;
        fields[TYPE_FIELD.fieldApiName] = this.enqType;
        fields[COMMENT_FIELD.fieldApiName] = this.enqCommentName;
        fields[CONTACT_FIELD.fieldApiName] = this.recordId;


        console.log(fields[NAME_FIELD.fieldApiName]);
        console.log(fields[TYPE_FIELD.fieldApiName]);
        console.log(fields[COMMENT_FIELD.fieldApiName]);
        this.isLoading = true;
        const recordInput  = {apiName : ENQUIRY_OBJECT.objectApiName, fields};

        createRecord(recordInput).then( enquiries => {
            console.log("Inside Save enquiries promise");
            this.isLoading = false;
           
            showToast(this,'SUCCESS', 'Enquiry Record Updated', 'success');
            console.log("Before refresh call");
            this.template.querySelector("c-display-escalated-enquiries").refresh();
            console.log("After refresh call");
          

        }).catch( error => {
            console.log("Inside Error enquiries promise");
            this.isLoading = false;
            showToast(this,'ERROR', error.body.message, 'error');
        });
       



      }

      handleResetClick(event){
        console.log("Inside Reset");
        this.template.querySelector('form').reset();
        console.log("After Reset");
        
      }

      handleDivOnClick(){
        this.counter += 1;
        this.changingVar = this.counter + ' changingVar';
      }

      

}