import { LightningElement,api,wire } from 'lwc';
import MCG_IMAGE from '@salesforce/resourceUrl/MCG';
import MARVEL_IMAGE from '@salesforce/resourceUrl/Marvel';
import RODLAVER_IMAGE from '@salesforce/resourceUrl/RodLaver';
import {
    subscribe,
    unsubscribe,
    APPLICATION_SCOPE,
    MessageContext
  } from "lightning/messageService";
  import MYQUOTEWIZMESSAGE from "@salesforce/messageChannel/MyQuoteWizMessageChannel__c";

export default class QuoteWizardHomeGround extends LightningElement {
    @wire(MessageContext) messageContext;

  subscription = null;

    mcgClicked = false;
    marvelClicked = false;
    rodLaverClicked = false;
    homeGround;

    @api
  get mcgURL() {
    return MCG_IMAGE;
  }

  @api
  get marvelURL() {
    return MARVEL_IMAGE;
  }

  @api
  get rodLaverURL() {
    return RODLAVER_IMAGE;
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
    console.log("receivedMessage is: " + this.homeGround);

    if (this.homeGround === 'MCG'){
        this.mcgClicked = true;
        this.marvelClicked = false;
        this.rodLaverClicked = false;
    }else if (this.homeGround === 'Marvel'){
        this.mcgClicked = false;
        this.rodLaverClicked = false;
        this.marvelClicked = true;
    }else if (this.homeGround === 'Rod Laver'){
        this.mcgClicked = false;
        this.marvelClicked = false;
        this.rodLaverClicked = true;
    }
    else{
        this.mcgClicked = false;
        this.marvelClicked = false;
        this.rodLaverClicked = false;
        this.homeGround = false;
    }
    
   
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

}