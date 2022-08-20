import { LightningElement,wire,api } from 'lwc';
import getLotServiceContracts from '@salesforce/apex/GetXPropTabData.getLotServiceContracts';
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import {
    getRecord,
    getFieldValue
} from 'lightning/uiRecordApi';
import SC_STATUS_FIELD from '@salesforce/schema/ServiceContract.Service_Contract_Status__c';

export default class XpropServiceContractView extends LightningElement {
    
    lotServiceContracts;
    @api lotId;
    @api lotName;
    selectedScRecId;
    showSCDetail;
    //progressValue = '0';


    @wire(getLotServiceContracts,{lotId: '$lotId'})
    wiredLotServiceContracts({data,error}){
        if(data){
            console.log("Lot Id in Service Contract tab is:" + this.lotId);


            
            this.lotServiceContracts = data;
            //console.log(JSON.stringify(this.agents));
            
            // hide the record edit form everytime a lottId is changed
            //if (this.lotId){
                if (this.lotId || this.lotId.length === 0){
                this.showSCDetail = false;
            }
           
        }
        else if(error){
            this.showToast('ERROR', error.body.message, 'error');
        }
    }

    get showSC(){
        if (this.lotServiceContracts && this.lotId.length > 0){
            return true;
        }
        return false;
    }

    @wire(getRecord, {
        recordId: '$selectedScRecId',
        fields: [SC_STATUS_FIELD]
    })
    servicecontract;

    get scName() {
        return getFieldValue(this.servicecontract.data, SC_STATUS_FIELD);
    }

    showSCHandler(event){
        this.showSCDetail = true;
        var selectedScId  = event.target.id;
        this.selectedScRecId = selectedScId.substring(0,18);
        console.log(this.selectedScRecId);
    }

    get progressValue(){
        console.log("Service Contract Status is: " + this.scName);
        if (this.scName === 'Pending Signature'){
            return "step2";
        }
        if (this.scName === 'Activated'){
            return "step3";
        }
        if (this.scName === 'Preliminary Inspection'){
            return "step4";
        }
        if (this.scName === 'Variations'){
            return "step5";
        }
        if (this.scName === 'Final Inspection'){
            return "step6";
        }
        if (this.scName === 'Completed'){
            return "step7";
        }
    }

    get acceptedFormats() {
        return ['.pdf', '.png'];
    }

    handleUploadFinished(event) {
        // Get the list of uploaded files
        const uploadedFiles = event.detail.files;
        this.showToast('No. of files uploaded :', uploadedFiles.length, 'Success');
    }

    handleSubmit(event) {

        const outputFields = this.template.querySelectorAll(
            'lightning-output-field'
        );
        if (outputFields) {
            outputFields.forEach(field => {
                if(field.fieldName == 'Name')
                this.updatedRecord = field.value;
                console.log("updatedRecord" + this.updatedRecord);
            });
        }
    }

    handleSuccess(event) {
        
        console.log("updatedRecord" + this.updatedRecord);
        this.showToast('Service Contract Updated Successfully', this.updatedRecord, 'Success');
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