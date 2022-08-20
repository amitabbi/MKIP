import { LightningElement,wire } from 'lwc';
import {
    subscribe,
    unsubscribe,
    publish,
    createMessageContext,
    APPLICATION_SCOPE,
    MessageContext
  } from "lightning/messageService";
  import MYQUOTEWIZMESSAGE from "@salesforce/messageChannel/MyQuoteWizMessageChannel__c";
  import QUOTEWIZAPPMC from '@salesforce/messageChannel/MyQuoteWizMessageChannel__c';
  import { createRecord } from 'lightning/uiRecordApi';
  import getConFromLookUp from "@salesforce/apex/GetContactsFromSearch.getConFromLookUp";
  import getAllCons from "@salesforce/apex/GetContactsFromSearch.getAllCons";
  import submitorder from "@salesforce/apex/SubmitQuoteWizard.submitorder";
  import { NavigationMixin } from 'lightning/navigation';
  import { ShowToastEvent } from "lightning/platformShowToastEvent";

export default class QuoteWizardPriContactPage extends NavigationMixin(LightningElement) {
    quotePriConPagePreviousClicked;
    @wire(MessageContext) messageContext;
    homeGround;
    group;
    gender;
    discount;
    inputDisabled = false;
    lookUpDisabled = true;
    subscription = null;
    qCompany;
    qFName;
    qLName;
    qMob;
    qEmail;
    qPriFName;
    qPriLName;
    qPriMob;
    qPriEmail;
    sport;
    additionalcontacts = [];
    conId;
    oppId;
    contId;
    isLoading = false;


    handlePriPreviousClick(event){
        
        this.quotePriConPagePreviousClicked = true;
        const selectedEvent = new CustomEvent("quotepriconpagepreviousclicked", {
            detail: this.quotePriConPagePreviousClicked,
            bubbles: true
            
          });
          
          // Dispatches the event.
          this.dispatchEvent(selectedEvent);
          console.log("QuotePriConPagePreviousClicked event is dispatched");
          publish(this.messageContext, QUOTEWIZAPPMC, { homeGround : this.homeGround, step : 'step2', group : this.group, gender : this.gender, discount :  this.discount, sport : this.sport });

    }

    subscribeToMessageChannel() {
        if (this.subscription) {
          return;
        }
        this.subscription = subscribe(
          this.messageContext,
          MYQUOTEWIZMESSAGE,
          (message) => {
            this.handleMessage(message);
          },
          { scope: APPLICATION_SCOPE }
        );
      }

      handleMessage(message) {
        this.homeGround = message.homeGround;
        this.group = message.group;
        this.gender = message.gender;
        this.discount = message.discount;
        this.qCompany = message.custCompany;
        this.qFName = message.custFName;
        this.qLName = message.custLName;
        this.qMob = message.custMob;
        this.qEmail = message.custEmail;
        this.sport = message.sport;
        this.conId = message.conId;
        console.log("receivedMessage is: " + this.homeGround);
        console.log("receivedMessage conId is: " + this.conId);
    
      //this.getAllExistingCons();
        
       
      }

      getAllExistingCons(){
        console.log(this.conId[0]);
        getAllCons({
          
          conId: this.conId[0]
      })
      .then(data => {
          this.additionalcontacts = data;
          console.log("Additional Contacts Result is :" + JSON.stringify(this.additionalcontacts));

      })
      .catch(error => {
          this.error = error;
      });
      }
    
      unsubscribeToMessageChannel() {
        unsubscribe(this.subscription);
        this.subscription = null;
      }
    
      // Standard lifecycle hooks used to subscribe and unsubsubscribe to the message channel
      connectedCallback() {
        this.subscribeToMessageChannel();
       

      }
    
      disconnectedCallback() {
        this.unsubscribeToMessageChannel();
      }

      toggleChange(event){

        /*if (event.target.checked){
        this.inputDisabled = true;
        this.lookUpDisabled = false;
        }else{
        this.inputDisabled = false;
        this.lookUpDisabled = true;
        this.qPriFName = '';
        this.qPriLName = '';
        this.qPriMob = '';
        this.qPriEmail = '';
        }*/

        this.getAllExistingCons();

      }

      handleChange(event){
        if (event.target.name === 'qPriFName'){
            this.qPriFName = event.target.value;
        }
        if (event.target.name === 'qPriLName'){
            this.qPriLName = event.target.value;
        }
        if (event.target.name === 'qPriMob'){
            this.qPriMob = event.target.value;
        }
        if (event.target.name === 'qPriEmail'){
            this.qPriEmail = event.target.value;
        }
      }


      handlePriSubmitClick(){
        this.isLoading = true;
        
        if (this.conId[0] == null){
          this.contId = '';
        }else{
          this.contId = this.conId[0];
        }

        if (this.qPriFName == null){
          this.qPriFName = '';
        }
        console.log("Inside Submit");
        console.log(this.conId[0]);
        console.log(this.qFName);
        console.log(this.qLName);
        console.log(this.qEmail);
        console.log(this.qMob);
        console.log(this.qPriFName);
        console.log(this.qPriLName);
        console.log(this.qPriEmail);
        console.log(this.qPriMob);

        


        submitorder({
          
          conId: this.contId,
          custFName : this.qFName,
          custLName : this.qLName,
          custEmail : this.qEmail,
          custMob: this.qMob,
          priFName : this.qPriFName,
          priLName : this.qPriLName,
          priEmail : this.qPriEmail,
          priMob : this.qPriMob

      })
      
      .then(data => {
       
        console.log(this.conId[0]);
          this.oppId = data;
          console.log("New Opp Id is :" + JSON.stringify(this.oppId));
          //this.navigateToEditPage(this.oppId);
          this.showToast("Submission", "Submission was successfull", 'success');
          
          location.reload();
          this.isLoading = false;
          

      })
      .catch(error => {
          this.error = error;
          this.showToast("Submission Error", "Submission was unsuccessfull", 'error');
          this.isLoading = false;
      });
      
    }

    handleValueSelcted(event){
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
        this.qPriFName = result.FirstName;
        this.qPriLName = result.LastName;
        this.qPriMob = result.MobilePhone;
        this.qPriEmail = result.Email;

        


        

        
        //this.isLoading = false;
      })
      .catch((error) => {
        this.error = error.body.message;
        console.log("Error is: " + this.error);
        this.isLoading = false;
      });

      

    }

    navigateToEditPage(myRecId) {
      console.log(myRecId);
      this[NavigationMixin.Navigate]({
          type: 'standard__recordPage',
          attributes: {
              recordId: myRecId,
              actionName: 'view'
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

    

}