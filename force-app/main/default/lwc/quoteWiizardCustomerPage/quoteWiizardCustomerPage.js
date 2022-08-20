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
  import getConFromLookUp from "@salesforce/apex/GetContactsFromSearch.getConFromLookUp";

export default class QuoteWiizardCustomerPage extends LightningElement {

    quoteCustPagePreviousClicked;
    quoteCustPageNextClicked;
    @wire(MessageContext) messageContext;
    homeGround;
    group;
    gender;
    discount;
    lookUpDisabled = true;
    inputDisabled = true;
    subscription = null;
    qCompany;
    qFName;
    qLName;
    qMob;
    qEmail;
    sport;
    selectedRecordId;


    handleCustPreviousClick(event){
        this.quoteCustPagePreviousClicked = true;
        const selectedEvent = new CustomEvent("quotecustpagepreviousclicked", {
            detail: this.quoteCustPagePreviousClicked,
            bubbles: true
            
          });
          
          // Dispatches the event.
          this.dispatchEvent(selectedEvent);
          console.log("QuoteCustPagePreviousClicked event is dispatched");

          publish(this.messageContext, QUOTEWIZAPPMC, { homeGround : this.homeGround, step : 'step1' });
    }


    handleCustNextClick(event){
        //event.preventDefault();
        this.quoteCustPageNextClicked = true;
        const selectedEvent = new CustomEvent("quotecustpagenextclicked", {
            detail: this.quoteCustPageNextClicked,
            bubbles: true
            
          });
          
          // Dispatches the event.
          this.dispatchEvent(selectedEvent);
          console.log("QuoteCustPageNextClicked event is dispatched");

          publish(this.messageContext, QUOTEWIZAPPMC, { homeGround : this.homeGround, step : 'step3', group : this.group, gender : this.gender, discount :  this.discount,
          custCompany :  this.qCompany, custFName :  this.qFName, custLName :  this.qLName, custMob :  this.qMob, custEmail :  this.qEmail, sport : this.sport, conId: this.selectedRecordId });
          console.log("Quote Cstomer publish done");

    }

    items = [
        {
            label: 'Western Sales Director',
            name: '1',
            expanded: true,
            items: [
                {
                    label: 'Western Sales Manager',
                    name: '2',
                    expanded: true,
                    items: [
                        {
                            label: 'CA Sales Rep',
                            name: '3',
                            expanded: true,
                            items: [],
                        },
                        {
                            label: 'OR Sales Rep',
                            name: '4',
                            expanded: true,
                            items: [],
                        },
                    ],
                },
            ],
        },
       
    ];

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
        this.sport = message.sport;
        //this.step = message.step;
        console.log("receivedMessage is: " + this.homeGround);
    
      
        
       
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

        if (event.target.checked){
        this.inputDisabled = true;
        this.lookUpDisabled = false;
        }else{
        this.inputDisabled = false;
        this.lookUpDisabled = true;
        this.qCompany = '';
        this.qFName = '';
        this.qLName = '';
        this.qMob = '';
        this.qEmail = '';
        this.selectedRecordId = '';
        }
      }

      handleChange(event){
        if (event.target.name === 'qCompany'){
            this.qCompany = event.target.value;
        }
        if (event.target.name === 'qFName'){
            this.qFName = event.target.value;
        }
        if (event.target.name === 'qLName'){
            this.qLName = event.target.value;
        }
        if (event.target.name === 'qMob'){
            this.qMob = event.target.value;
        }
        if (event.target.name === 'qEmail'){
            this.qEmail = event.target.value;
        }
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
          this.qCompany = result.FirstName + ' ' + result.LastName;
          this.qFName = result.FirstName;
          this.qLName = result.LastName;
          this.qMob = result.MobilePhone;
          this.qEmail = result.Email;

          


          

          
          //this.isLoading = false;
        })
        .catch((error) => {
          this.error = error.body.message;
          console.log("Error is: " + this.error);
          this.isLoading = false;
        });

        

      }

}