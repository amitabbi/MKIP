import {
    LightningElement,
    wire,
    api,
    track
} from 'lwc';
import getNextTestimonial from '@salesforce/apex/GetQuoteWizardTestimonials.getNextTestimonial';
import USER_ID from '@salesforce/user/Id';
import {
    refreshApex
} from '@salesforce/apex';
import {
    updateRecord
} from 'lightning/uiRecordApi';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import VIEWED_FIELD from '@salesforce/schema/Testimonial__c.Viewed__c';
import ID_FIELD from '@salesforce/schema/Testimonial__c.Id';
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import TotalTestimonialRecords from "@salesforce/apex/GetQuoteWizardTestimonials.TotalTestimonialRecords";
import getNext from "@salesforce/apex/GetQuoteWizardTestimonials.getNext";
import getPrevious from "@salesforce/apex/GetQuoteWizardTestimonials.getPrevious";
import MaximumPermissionsImportCustomObjects from '@salesforce/schema/PermissionSetLicense.MaximumPermissionsImportCustomObjects';


export default class QuoteWizardTestimonials extends LightningElement {

    testId;
    testViewed = false;
    @track error;
    testimonial = [];
    feedback;
    cas;
    opp;
    @api rating;
    v_TotalTestimonialRecords;
    page_size = 1;
    v_Offset = 0;
    checkDisabled;
    isLoading = false;

    /*@wire(getNextTestimonial, {
        ownId: USER_ID
    })
    testimonial;*/

    viewedCheckHandler(event) {

        if (event.target.checked) {
            this.checkDisabled = true;
            this.testViewed = true;
            this.updateTestimonial();

           
        }


    }

    handleNext(){
        this.isLoading = true;
        //this.checkDisabled = false;
        getNext({ v_Offset: this.v_Offset, v_pagesize: this.page_size }).then(
            (data) => {
                
              if (this.v_Offset + 1 < this.v_TotalTestimonialRecords) {
                this.v_Offset = data;
                //if (Object.keys(data).length > 0){
                this.handleNextTestimonial();
                //}

                
               
                
              }
            
              this.isLoading = false;
            }
          );
    }

    handlePrevious() {
        this.isLoading = true;
        //this.checkDisabled = false;
        console.log(this.page_size);
        getPrevious({ v_Offset: this.v_Offset, v_pagesize: this.page_size }).then(
          (data) => {
            if (data >= 0) {
              this.v_Offset = data;
              this.handleNextTestimonial();
              

            }
            this.isLoading = false;
          }
        );
      }

    connectedCallback(){
        this.v_Offset = 0;
        getNextTestimonial({
            ownId: USER_ID,
            v_Offset: this.v_Offset,
            v_pagesize: this.page_size
        })
        .then(data => {
            this.testimonial = data;
            console.log(this.testimonial);
            this.testId = this.testimonial[0].Id;
            this.testViewed = this.testimonial[0].Viewed__c;
            this.feedback = this.testimonial[0].Feedback__c;
            this.cas = this.testimonial[0].Case__c;
            this.opp = this.testimonial[0].Opportunity__c;
            this.rating = parseInt(this.testimonial[0].Rating__c);
            console.log(this.testId);
            console.log(this.rating);

            TotalTestimonialRecords({ ownId: USER_ID }).then((result1) => {
                this.v_TotalTestimonialRecords = result1;
                console.log("Total records on load:" + this.v_TotalTestimonialRecords);
              });

        })
        .catch(error => {
            this.error = error;
        });

    
       
      }

      



    @api
    refresh() {
        return refreshApex(this.testimonial);
    }

    updateTestimonial() {
        const fields = {};
        fields[ID_FIELD.fieldApiName] = this.testId;
        fields[VIEWED_FIELD.fieldApiName] = this.testViewed;

        const recordInput = {
            fields
        };

        updateRecord(recordInput)
            .then(() => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Testimonial updated',
                        variant: 'success'
                    })
                );
                // Display fresh data in the form
               // return refreshApex(this.testimonial);
                
            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error creating record',
                        message: error.body.message,
                        variant: 'error'
                    })
                );
            });

         

           
    }


    handleNextTestimonial(){
    getNextTestimonial({
        ownId: USER_ID,
        v_Offset: this.v_Offset,
        v_pagesize: this.page_size
    })
    .then(data => {

        if (Object.keys(data).length === 0) {
            console.log("Inside Length 0");
            return this.showToast("Search Result", "No testimonials found", "warn");
          }

            this.testimonial = data;
           
            console.log(this.testimonial);
            this.testId = this.testimonial[0].Id;
            this.testViewed = this.testimonial[0].Viewed__c;
            this.feedback = this.testimonial[0].Feedback__c;
            this.cas = this.testimonial[0].Case__c;
            this.opp = this.testimonial[0].Opportunity__c;
            this.rating = parseInt(this.testimonial[0].Rating__c);
            console.log(this.testId);
            console.log(this.rating);

            console.log("Total records after next:" + this.v_TotalTestimonialRecords);

    })
    .catch(error => {
        this.error = error;
    });
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