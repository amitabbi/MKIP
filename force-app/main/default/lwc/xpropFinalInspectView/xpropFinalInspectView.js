import { LightningElement,api,wire } from 'lwc';
import {
    ShowToastEvent
} from "lightning/platformShowToastEvent";
import { refreshApex } from '@salesforce/apex';
import {
    getRecord,
    getFieldValue
} from 'lightning/uiRecordApi';
import { updateRecord } from 'lightning/uiRecordApi';
import LOT_FINALINSP_FIELD from '@salesforce/schema/XProp_Lot__c.Final_Inspection__c';
import ID_FIELD from '@salesforce/schema/XProp_Lot__c.Id';
const FIELDS = [ID_FIELD,LOT_FINALINSP_FIELD];

export default class XpropFinalInspectView extends LightningElement {

    @api lotId;
    @api lotName;
    txFinalInspValue;
    finalInspection;
    _wiredRecord;
    isLoading;

    @wire(getRecord, { recordId: '$lotId', fields: FIELDS })
    wiredRecord(result) {
        this._wiredRecord = result;

        if (result.error) {
            let message = 'Unknown error';
            if (Array.isArray(result.error.body)) {
                message = result.error.body.map(e => e.message).join(', ');
            } else if (typeof result.error.body.message === 'string') {
                message = result.error.body.message;
            }

            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error loading contact',
                    message,
                    variant: 'error',
                }),
            );
        } else if (result.data) {
            this.finalInspection = result.data;
            this.txFinalInspValue = this.finalInspection.fields.Final_Inspection__c.value;
            }
        }

        get showFinalInsp(){
            if ((this.txFinalInspValue !== null) && this.lotId.length > 0){
                return true;
            }
            return false;
        }

    txChangeHandler(event){
        this.txFinalInspValue = event.target.value;
    }

    saveHandler(){
        const fields = {};
        fields[ID_FIELD.fieldApiName] = this.lotId;
        fields[LOT_FINALINSP_FIELD.fieldApiName] = this.txFinalInspValue;
   
        this.isLoading = true;
      

        const recordInput  = {fields};

        updateRecord(recordInput).then( feedback => {
           
        


            this.showToast('SUCCESS', 'Lot Record Updated Successfully', 'success');
            this.isLoading = false;
            return refreshApex(this._wiredRecord);
            

        }).catch( error => {
            //console.log("Inside Error enquiries promise");
            this.isLoading = false;
            this.showToast('ERROR', error.body.message, 'error');
            
        });
    }
    

    get acceptedFormats() {
        return ['.pdf', '.png'];
    }

    handleUploadFinished(event) {
        // Get the list of uploaded files
        const uploadedFiles = event.detail.files;
        this.showToast('No. of files uploaded :', uploadedFiles.length, 'Success');
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