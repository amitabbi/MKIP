import { LightningElement, wire, track, api } from "lwc";
import {
  subscribe,
  unsubscribe,
  APPLICATION_SCOPE,
  MessageContext
} from "lightning/messageService";
import MYMESSAGE from "@salesforce/messageChannel/MyMessageChannel__c";

export default class ConAppRecordDetail extends LightningElement {
  @wire(MessageContext) messageContext;

  subscription = null;
  conRecId;
  conFName;
  conLName;
  resetClicked;
 

  subscribeToMessageChannel() {
    if (this.subscription) {
      return;
    }
    this.subscription = subscribe(
      this.messageContext,
      MYMESSAGE,
      (message) => {
        this.handleMessage(message);
      },
      { scope: APPLICATION_SCOPE }
    );
  }

  handleMessage(message) {
    this.conRecId = message.recordId;
    this.conFName = message.conFName;
    this.conLName = message.conLName;
    this.resetClicked = message.resetClicked;
    console.log("receivedMessage is: " + this.conRecId);
    console.log("receivedMessage is: " + this.conFName);
    console.log("receivedMessage is: " + this.conLName);

    if (this.resetClicked){
        this.conRecId = null;
    }


  }

  unsubscribeToMessageChannel() {
    unsubscribe(this.subscription);
    this.subscription = null;
  }

  //ready = false;
  // Standard lifecycle hooks used to subscribe and unsubsubscribe to the message channel
  connectedCallback() {
    
    //setTimeout(() => {
      this.subscribeToMessageChannel();
      //this.ready = true;
  //}, 5000);
  }

  renderedCallback() {
    //setTimeout(() => {
      this.subscribeToMessageChannel();
      //this.ready = true;
  //}, 5000);
  }

  disconnectedCallback() {
    this.unsubscribeToMessageChannel();
  }

  handleReset(event){

    this.conRecId = false;
  }
}