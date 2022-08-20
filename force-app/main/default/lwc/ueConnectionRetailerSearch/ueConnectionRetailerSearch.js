import { LightningElement,wire,api,track } from 'lwc';
import getRetailer from '@salesforce/apex/GetUEEstablishSupplyData.searchRetailer';
//import searchRetailer from "@salesforce/apex/";
import { ShowToastEvent } from "lightning/platformShowToastEvent";

export default class UeConnection extends LightningElement {

    qRECNum;
    qRECName;
    qRECPhone;
    qRECEmail;
    recFound = true;
    inputDisabled = false;


    handleChange(event){
        if (event.target.name === "qRECNum") {
            this.qRECNum = event.target.value;
          }

        
          console.log("REC Number is:" + this.qRECNum);
    }


    handleSearch(){

        const isInputsCorrect = [...this.template.querySelectorAll('lightning-input')]
            .reduce((validSoFar, inputField) => {
                inputField.reportValidity();
                return validSoFar && inputField.checkValidity();
            }, true);
        if (isInputsCorrect) {
         //perform success logic



         getRetailer({ qRECNum: this.qRECNum })
        .then((result) => {
            console.log("REC Number is: " + this.qRECNum);
          console.log("Result is: " + result);
         // console.log("Result is: " + JSON.stringify(result));
        
          this.recFound = true;
          this.qRECName = result.REC_Name__c;
          this.qRECPhone = result.REC_Phone__c;
          this.qRECEmail = result.REC_Email__c;
    
         

          console.log(result.REC_Name__c);
          console.log(result.REC_Phone__c);
          console.log(result.REC_Email__c);

          
          

          
          //this.isLoading = false;
        })
        .catch((error) => {
          this.error = error.body.message;
          console.log("Error is: " + this.error);
          this.recFound = false;
          this.qRECName = '';
          this.qRECPhone = '';
          this.qRECEmail = '';
          //this.isLoading = false;
        });






        }
       

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