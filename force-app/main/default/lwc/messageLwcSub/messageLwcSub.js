import { LightningElement,wire,track } from 'lwc';
import { subscribe, unsubscribe, APPLICATION_SCOPE, MessageContext } from 'lightning/messageService';
import MYMESSAGE from '@salesforce/messageChannel/MyMessageChannel__c';

export default class MessageLwcSub extends LightningElement {


    @wire(MessageContext)
    messageContext;

    subscription = null;
    @track receivedMessage;

    subscribeToMessageChannel(){
        if (this.subscription) {
            return;
        }
            this.subscription = subscribe(
                this.messageContext,
                MYMESSAGE,
                message => {
                  this.handleMessage(message);
                },
                { scope: APPLICATION_SCOPE }
              );
        
    }

    handleMessage(message){
        this.receivedMessage = message ? JSON.stringify(message, null, '\t') : 'no message payload';
        console.log("receivedMessage is: " + this.receivedMessage);
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
        //this.unsubscribeToMessageChannel();
    }
}