import { LightningElement,wire,api } from 'lwc';
import getLotOpportunities from "@salesforce/apex/GetXPropTabData.getLotOpportunities";
import { ShowToastEvent } from "lightning/platformShowToastEvent";

export default class XpropOpportunityView extends LightningElement {
    lotOpportunities;
    @api lotId;
    @api lotName;
    @api selectedOppRecId;
    showOpp;
    oppCloseDate;
    updatedRecord;

    @wire(getLotOpportunities,{lotId: '$lotId'})
    wiredLotOpps({data,error}){
        if(data){
            console.log("Lot Id in Opportunities tab is:" + this.lotId);


            
            this.lotOpportunities = data;
            console.log(JSON.stringify(this.agents));
            
            // hide the record edit form everytime a lottId is changed
            //if (this.lotId){
                if (this.lotId || this.lotId.length === 0){
                this.showOpp = false;
            }
           
        }
        else if(error){
            this.showToast('ERROR', error.body.message, 'error');
        }
    }

    get showOpps(){
        if (this.lotOpportunities && this.lotId.length > 0){
            return true;
        }
        return false;
    }
  

    showOppHandler(event){
        this.showOpp = true;
        var selectedOppId  = event.target.id;
        this.selectedOppRecId = selectedOppId.substring(0,18);
        console.log(this.selectedOppRecId);
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
        this.showToast('Opportunity Updated Successfully', this.updatedRecord, 'Success');
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

//.then(url => { window.open(url) });