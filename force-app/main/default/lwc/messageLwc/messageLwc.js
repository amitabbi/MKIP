import { LightningElement, wire,api,track } from 'lwc';
import { APPLICATION_SCOPE, createMessageContext, MessageContext, publish, releaseMessageContext, subscribe, unsubscribe } from 'lightning/messageService';
import MYMESSAGE from '@salesforce/messageChannel/MyMessageChannel__c';

export default class MessageLwc extends LightningElement {

@wire (MessageContext) messageContext;
@track inputMessage;
@track messages = [];


inputMessageHandler(event){
    this.inputMessage = event.target.value;
}



    handlePublish(){
        const mymsg = this.inputMessage;
        console.log(mymsg);
        this.messages.push({
            id: this.messages.length,
            value: mymsg,
            from: "LWC"
        });

        //publish message
      const message = {
        message: mymsg,
        from: "LWC"
      };

      publish(this.messageContext, MYMESSAGE, message);
      console.log(message);
    }

}