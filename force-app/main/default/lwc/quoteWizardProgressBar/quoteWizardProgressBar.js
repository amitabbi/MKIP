import { LightningElement,wire,api } from 'lwc';
import {
    subscribe,
    unsubscribe,
    APPLICATION_SCOPE,
    MessageContext
  } from "lightning/messageService";
  import MYQUOTEWIZMESSAGE from "@salesforce/messageChannel/MyQuoteWizMessageChannel__c";


export default class QuoteWizardProgressBar extends LightningElement {
    
    
    @wire(MessageContext) messageContext;

    subscription = null;
    currStep = 'step1';
    
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
        this.currStep = message.step;
        console.log("receivedMessage is: " + this.currStep);

       
        
        
       
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