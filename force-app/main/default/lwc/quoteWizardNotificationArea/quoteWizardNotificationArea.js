import {
    LightningElement,
    wire,
    api
} from 'lwc';
import getTasksCount from '@salesforce/apex/GetQuoteWizardCounts.getTasksCount';
import getLeadsCount from '@salesforce/apex/GetQuoteWizardCounts.getLeadsCount';
import getCasesCount from '@salesforce/apex/GetQuoteWizardCounts.getCasesCount';
import getOpportunitiesCount from '@salesforce/apex/GetQuoteWizardCounts.getOpportunitiesCount';
import USER_ID from '@salesforce/user/Id';
import {
    subscribe,
    unsubscribe,
    onError,
    setDebugFlag,
    isEmpEnabled
} from 'lightning/empApi';
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { refreshApex } from '@salesforce/apex';

export default class QuoteWizardNotificationArea extends LightningElement {

    tasksCount;
    leadsCount;
    casesCount;
    oppsCount;

    // lightning:emp API
    channelName = '/event/COLT__e';
    isSubscribeDisabled = false;
    isUnsubscribeDisabled = !this.isSubscribeDisabled;
    subscription = {};

   

    connectedCallback() {


        getTasksCount({
                ownId: USER_ID
            })
            .then(data => {
                this.tasksCount = data;

            })
            .catch(error => {
                this.error = error;
            });


        getLeadsCount({
                ownId: USER_ID
            })
            .then(data => {
                this.leadsCount = data;

            })
            .catch(error => {
                this.error = error;
            });

        getCasesCount({
                ownId: USER_ID
            })
            .then(data => {
                this.casesCount = data;

            })
            .catch(error => {
                this.error = error;
            });

        getOpportunitiesCount({
                ownId: USER_ID
            })
            .then(data => {
                this.oppsCount = data;

            })
            .catch(error => {
                this.error = error;
            });


       
        

        this.registerErrorListener();

    }

    registerErrorListener() {
        // Invoke onError empApi method
        onError(error => {
            console.log('Received error from server: ', JSON.stringify(error));
            // Error contains the server-side error
        });
    }


    toggleChange(event){

        if (event.target.checked){
         // Callback invoked whenever a new event message is received
        // const messageCallback = function (response) {
            const messageCallback = response => {
                this.showToast("New Lead", "New Lead Created", "warn");
                this.leadsCount = parseInt(this.leadsCount) + 1;
                //this.refresh();
            console.log('New message received: ', JSON.stringify(response));
            
            
            
            
            // Response contains the payload of the new message received
        };

        
          
         

    

        // Invoke subscribe method of empApi. Pass reference to messageCallback
        subscribe(this.channelName, -1, messageCallback).then(response => {
            // Response contains the subscription information on subscribe call
            console.log('Subscription request sent to: ', JSON.stringify(response.channel));
            this.subscription = response;
            
            //this.toggleSubscribeButton(true);

        });

        
    }
    else{
        this.isSubscribeDisabled = true;
        // Invoke unsubscribe method of empApi
        unsubscribe(this.subscription, response => {
            console.log('unsubscribe() response: ', JSON.stringify(response));
            // Response is true for successful unsubscribe
        });
    }
    }

    @api
    refresh(){
        getLeadsCount({
            ownId: USER_ID
        })
        .then(data => {
            this.leadsCount = data;
            console.log(this.leadsCount);

        })
        .catch(error => {
            this.error = error;
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