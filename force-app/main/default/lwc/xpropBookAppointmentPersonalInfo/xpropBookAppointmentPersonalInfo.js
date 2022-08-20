import { LightningElement,api,wire,track } from 'lwc';
import {
    ShowToastEvent
} from "lightning/platformShowToastEvent";
import { createRecord } from 'lightning/uiRecordApi';
import LEAD_OBJECT from '@salesforce/schema/Lead';
import LEAD_FNAME_FIELD from '@salesforce/schema/Lead.FirstName';
import LEAD_LNAME_FIELD from '@salesforce/schema/Lead.LastName';
import LEAD_COMPANY_FIELD from '@salesforce/schema/Lead.Company';
import LEAD_EMAIL_FIELD from '@salesforce/schema/Lead.Email';
import LEAD_MPHONE_FIELD from '@salesforce/schema/Lead.MobilePhone';
import LEAD_DESC_FIELD from '@salesforce/schema/Lead.Description';

export default class XpropBookAppointmentPersonalInfo extends LightningElement {

    isLoading;
    FName;
    LName;
    Company;
    Email;
    Mobile;
    Description;
    @api leadId;


    handleBookAppPICancel(event){
        event.preventDefault();
        this.isLoading = true;
        const selectedEvent = new CustomEvent("capturebackbutton", {
            detail: {
                backButtonClicked: 'true'
            },
            bubbles: true
            
          });
          
          // Dispatches the event.
          this.dispatchEvent(selectedEvent);
          this.isLoading = false;
    }

    handleBookAppPIProceed(event){

    event.preventDefault();

          this.createLead();

         


    }

    handleChange(event){

        if (event.target.name === 'lFName') {
            this.FName = event.target.value;
        }
        if (event.target.name === 'lLName') {
            this.LName = event.target.value;
        }
        if (event.target.name === 'lCompany') {
            this.Company = event.target.value;
        }
        if (event.target.name === 'lEmail') {
            this.Email = event.target.value;
        }
        if (event.target.name === 'lMobile') {
            this.Mobile = event.target.value;
        }
        if (event.target.name === 'lDescription') {
            this.Description = event.target.value;
        }


    }

    createLead(){
        this.isLoading = true;
        const fields = {};
        fields[LEAD_FNAME_FIELD.fieldApiName] = this.FName;
        fields[LEAD_LNAME_FIELD.fieldApiName] = this.LName;
        fields[LEAD_COMPANY_FIELD.fieldApiName] = this.Company;
        fields[LEAD_EMAIL_FIELD.fieldApiName] = this.Email;
        fields[LEAD_MPHONE_FIELD.fieldApiName] = this.Mobile;
        fields[LEAD_DESC_FIELD.fieldApiName] = this.Description;
      

        const recordInput  = {apiName : LEAD_OBJECT.objectApiName, fields};

        createRecord(recordInput).then(leadresult => {
           
            this.isLoading = false;
            this.leadId = leadresult.id;
            console.log("Lead Id" + this.leadId);

           this.disptachLeadEvent();
           this.isLoading = false;

          

        }).catch( error => {
            //console.log("Inside Error enquiries promise");
            //this.isLoading = false;
            this.showToast('ERROR', error.body.message, 'error');
            this.isLoading = false;
        });
    }

    disptachLeadEvent(){
    const selectedEvent = new CustomEvent("captureproceedbutton", {
        detail: {
            proceedButtonClicked: 'true',
            leadId: this.leadId
        },
        bubbles: true
        
      });
    
      // Dispatches the event.
      this.dispatchEvent(selectedEvent);
    }

    showToast(title, message, variant) {
        const evt = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant
        });
        this.dispatchEvent(evt);
    }
    

}