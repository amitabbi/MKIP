import { LightningElement,api,track,wire } from 'lwc';
import getLotFeedback from "@salesforce/apex/GetXPropTabData.getLotFeedback";
import LOT_FEEDBACKTYPE_FIELD from '@salesforce/schema/XProp_Feedback__c.Feedback_Type__c';
import LOT_FEEDBACK_OBJECT from '@salesforce/schema/XProp_Feedback__c';
import LOT_FEEDBACKCOMMENTS_FIELD from '@salesforce/schema/XProp_Feedback__c.Comments__c';
import LOT_FEEDBACKRATING_FIELD from '@salesforce/schema/XProp_Feedback__c.Feedback_Rating__c';
import LOT_FIELD from '@salesforce/schema/XProp_Feedback__c.Feedback_Lot__c';
import {
    ShowToastEvent
} from "lightning/platformShowToastEvent";
import { createRecord } from 'lightning/uiRecordApi';
import { refreshApex } from '@salesforce/apex';

export default class XpropCompletionView extends LightningElement {

    @api lotId;
    @api lotName;
    @track lotFeedback = [];
    @track error;
    feedbackType = [];
    input1;
    @track rating = 0;
    _wiredResult;
    isLoading;
    showFiveStar;


    get feedbackOptions() {
        return [
          { label: "General", value: "General" },
          { label: "Customer", value: "Customer" },
          { label: "Preliminary Inspection", value: "Preliminary Inspection" },
          { label: "Final Inspection", value: "Final Inspection" },
          { label: "Contract Completion", value: "Contract Completion" }
        ];
      }

    @wire(getLotFeedback, { lotId: '$lotId' })
    wiredLotFeedback(result) {
        this._wiredResult = result;
        if (result.data) {
            this.lotFeedback = result.data;
            this.error = undefined;
            //console.log(JSON.stringify(this.lotFeedback));
           

        } else if (result.error) {
            this.error = result.error;
            this.lotFeedback = undefined;
        }
    }

    get showCompletion(){
        if (this.lotFeedback.length > 0 && this.lotId.length > 0){
            return true;
        }
        return false;
    }


     // Gets user rating input from stars component
     handleRatingChanged(event) { 
        this.rating = event.detail.rating;
        console.log("Rating" + this.rating);
    }

    handleChange(event){
        if (event.target.name === 'feedbackType') {
            this.feedbackType = event.target.value;
            this.showFiveStar = true;
        }
        if (event.target.name === 'input1') {
            this.input1 = event.target.value;
        }
    }

    feedbackSaveHandler(){
        this.isLoading = true;
        console.log("Feedback Type Length is:" + this.feedbackType);
        console.log("Feedback Rating Length is:" + this.rating);
        console.log("Feedback Comments Length is:" + this.input1);

        if (this.feedbackType === '' || this.rating === 0 || this.input1 === ''){
            this.isLoading = true;
            this.showToast('ERROR', 'Please complete all inputs', 'error');
            this.isLoading = false;
        }else{

        const fields = {};
        fields[LOT_FEEDBACKTYPE_FIELD.fieldApiName] = this.feedbackType;
        fields[LOT_FEEDBACKRATING_FIELD.fieldApiName] = this.rating;
        fields[LOT_FEEDBACKCOMMENTS_FIELD.fieldApiName] = this.input1;
        fields[LOT_FIELD.fieldApiName] = this.lotId;

      

        const recordInput  = {apiName : LOT_FEEDBACK_OBJECT.objectApiName, fields};

        createRecord(recordInput).then( feedback => {
           
            this.template.querySelectorAll('lightning-combobox').forEach(each => {
                each.value = null;
            });
            this.template.querySelectorAll('lightning-textarea').forEach(each => {
                each.value = null;
            });
            this.showFiveStar = false;
            this.feedbackType = '';
            this.input1 = '';
            this.rating = 0;



            this.showToast('SUCCESS', 'Feedback Record Created Successfully', 'success');
            this.isLoading = false;
            return refreshApex(this._wiredResult);
          

        }).catch( error => {
            //console.log("Inside Error enquiries promise");
            //this.isLoading = false;
            this.showToast('ERROR', error.body.message, 'error');
            this.isLoading = false;
        });
    }
    }

    feedbackResetHandler(){
        this.template.querySelectorAll('lightning-combobox').forEach(each => {
            each.value = null;
        });
        this.template.querySelectorAll('lightning-textarea').forEach(each => {
            each.value = null;
        });
        this.showFiveStar = false;
        this.feedbackType = '';
        this.input1 = '';
        this.rating = 0;
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