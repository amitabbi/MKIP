import { LightningElement,wire } from 'lwc';
import {
    subscribe,
    unsubscribe,
    APPLICATION_SCOPE,
    MessageContext
  } from "lightning/messageService";
  import MYQUOTEWIZMESSAGE from "@salesforce/messageChannel/MyQuoteWizMessageChannel__c";

export default class QuoteWizardMap extends LightningElement {

    homeGround;
    zoomLevel = 15;
    lat;
    long;
    mapMarkers = [];
    @wire(MessageContext) messageContext;

    subscription = null;


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
            const Latitude = '-37.819954';
            const Longitude = '144.983398';
            this.mapMarkers = [{
                location: { Latitude, Longitude }
       
            }];
        }else if (this.homeGround === 'Marvel'){
            const Latitude = '-37.8166';
            const Longitude = '144.9475';
            this.mapMarkers = [{
                location: { Latitude, Longitude }
       
            }];
        }else if (this.homeGround === 'Rod Laver'){
            const Latitude = '-37.8216';
            const Longitude = '144.9786';
            this.mapMarkers = [{
                location: { Latitude, Longitude }
       
            }];
        }
        else{
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