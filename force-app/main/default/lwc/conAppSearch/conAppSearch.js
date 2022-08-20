import { LightningElement, track, api, wire } from "lwc";
import getCons from "@salesforce/apex/GetContactsFromSearch.getCons";
import getConFromLookUp from "@salesforce/apex/GetContactsFromSearch.getConFromLookUp";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { NavigationMixin } from "lightning/navigation";
import CONAPPMC from '@salesforce/messageChannel/MyMessageChannel__c';
import { APPLICATION_SCOPE, createMessageContext, MessageContext, publish, releaseMessageContext, subscribe, unsubscribe } from 'lightning/messageService';

export default class ConAppSearch extends LightningElement {
  conFName = '';
  conLName = '';
  conMob = '';
  conFNameDisabled = true;
  conLNameDisabled = true;
  conMobDisabled = true;
  lookUpDisabled = true;
  conRes;
  isLoading = false;
  @api conRecId = '';
  resetClicked = false;
  conDetailsButtonClicked = false;
  cardClickClass;
  displayAlertBanner = false;
  @api alertMessage = 'Multiple contacts found. Please review contact selection.';
  @api selectedRecordId; //store the record id of the selected 


  @wire(MessageContext) messageContext;

 

  handleConInputChange(event) {
    if (event.target.name === "fname") {
      this.conFName = event.target.value;
    }

    if (event.target.name === "lname") {
      this.conLName = event.target.value;
    }

    if (event.target.name === "mob") {
      this.conMob = event.target.value;
    }
  }

  handleConSearchResetClick() {
    this.conFName = "";
    this.conLName = "";
    this.conMob = "";
    this.conRes = null;
    this.resetClicked = true;
    this.displayAlertBanner = false;
    this.sendMessageService(this.conRecId);
  }

  get conFound() {
    if (this.conRes) {
      return true;
    }
    return false;
  }

  handleConSearchClick() {
    this.isLoading = true;

   



    const allValid = [...this.template.querySelectorAll(".validValue")].reduce(
      (validSoFar, inputCmp) => {
        this.isLoading = true;
        inputCmp.reportValidity();
        this.isLoading = false;
        return validSoFar && inputCmp.checkValidity();
      },
      true
    );
    if (allValid) {
      //Submit information on Server
      getCons({ FName: this.conFName, LName: this.conLName, Mob: this.conMob })
        .then((result) => {
          console.log("Result is: " + result);
          if (Object.keys(result).length === 0){
            this.showToast("Search Result", "No matching contact", 'warn');
            return;
          }

          this.conRes = result;
          console.log(result.values);

          if (Object.keys(result).length > 1){
            this.displayAlertBanner = true;
          }

          
          this.isLoading = false;
        })
        .catch((error) => {
          this.error = error.body.message;
          console.log("Error is: " + this.error);
          this.isLoading = false;
        });
    }
  }

  handleConDetailsClick(event){
    const mystr = event.target.id;
    this.conRecId = mystr.substring(0,18);
    console.log(this.conRecId);
    this.resetClicked = false;
    this.conDetailsButtonClicked = true;
    this.sendMessageService(this.conRecId);
    this.cardClickClass = "slds-box slds-theme_error";
  }

  navigateToEditPage() {
    this[NavigationMixin.Navigate]({
      type: "standard__recordPage",
      attributes: {
        recordId: this.myRecId,
        objectApiName: "Contact",
        actionName: "view"
      }
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

  sendMessageService(conRecId) {
    // explicitly pass boatId to the parameter recordId
    publish(this.messageContext, CONAPPMC, { recordId : conRecId, conFName: this.conFName, conLName: this.conLName, resetClicked: this.resetClicked, conDetailsButtonClicked: this.conDetailsButtonClicked });
  }

  handleNameSelect(event){
  event.preventDefault();
  }

  
    handleValueSelcted(event) {
        this.selectedRecordId = event.detail;
        //this.conRecId = this.selectedRecordId;
        console.log("Lookup value change conRecId is:" + this.selectedRecordId);

      this.getContact();
        
       
    }

    getContact(){
      getConFromLookUp({ conId: this.selectedRecordId[0] })
        .then((result) => {
          console.log("ConRecId is: " + this.selectedRecordId[0]);
          console.log("Result is: " + result);
         // console.log("Result is: " + JSON.stringify(result));
          if (Object.keys(result).length === 0){
            this.showToast("Search Result", "No matching contact", 'warn');
            return;
          }
          //var myResult = JSON.stringify(result);
          this.conFName = result.FirstName;
          this.conLName = result.LastName;
          this.conMob = result.MobilePhone;

          //for (var key in result) {
           // console.log(result[key].FirstName);
          //}
         

          
          console.log(result.FirstName);
          console.log(result.LastName);
          console.log(result.MobilePhone);


          

          
          this.isLoading = false;
        })
        .catch((error) => {
          this.error = error.body.message;
          console.log("Error is: " + this.error);
          this.isLoading = false;
        });
    }

    toggleChange(event){

      if (event.target.checked){
      this.conFNameDisabled = true;
      this.conLNameDisabled = true;
      this.conMobDisabled = true;
      this.lookUpDisabled = false;
      }else{
        this.conFNameDisabled = false;
      this.conLNameDisabled = false;
      this.conMobDisabled = false;
      this.lookUpDisabled = true;
      }
    }

}