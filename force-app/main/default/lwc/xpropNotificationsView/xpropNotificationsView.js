import { LightningElement,wire,api } from 'lwc';
import getAgentWebLeads from "@salesforce/apex/GetXPropTabData.getAgentWebLeads";
import getNext from "@salesforce/apex/GetXPropTabData.getNext";
import getPrevious from "@salesforce/apex/GetXPropTabData.getPrevious";
import TotalAgentWebLeads from "@salesforce/apex/GetXPropTabData.TotalAgentWebLeads";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import USER_ID from '@salesforce/user/Id';
import {
    subscribe,
    unsubscribe,
    onError,
    setDebugFlag,
    isEmpEnabled
} from 'lightning/empApi';

export default class XpropNotificationsView extends LightningElement {

    showAlert;
    showTicker;
    interval;
    isLoading;
    agentWebLeads;
    v_TotalAgentLeadRecords;
    page_size = 1;
    v_Offset = 0;
    // lightning:emp API
    channelName = '/event/XProp__e';
    isSubscribeDisabled = false;
    isUnsubscribeDisabled = !this.isSubscribeDisabled;
    subscription = {};
 

    /*@wire(getAgentWebLeads,{agentId: USER_ID})
    wiredAgentWebLeads({data,error}){
        if(data){
            
            this.agentWebLeads = data;
            console.log(JSON.stringify(this.agentWebLeads));
            }
           
        
        else if(error){
            this.showToast('ERROR', error.body.message, 'error');
        }
    }*/

    handleNext(){
        this.isLoading = true;
        //this.checkDisabled = false;
        getNext({ v_Offset: this.v_Offset, v_pagesize: this.page_size }).then(
            (data) => {
              if (this.v_Offset + 1 < this.v_TotalAgentLeadRecords) {
                this.v_Offset = data;
                this.handleNextAgentLead();
              }
              this.isLoading = false;
            }
          );
    }

    handlePrevious() {
        this.isLoading = true;
        //this.checkDisabled = false;
        console.log(this.page_size);
        getPrevious({ v_Offset: this.v_Offset, v_pagesize: this.page_size }).then(
          (data) => {
            if (data >= 0) {
              this.v_Offset = data;
              this.handleNextAgentLead();
              

            }
            this.isLoading = false;
          }
        );
      }



    connectedCallback(){
        this.v_Offset = 0;
        getAgentWebLeads({
            agentId: USER_ID,
            v_Offset: this.v_Offset,
            v_pagesize: this.page_size
        })
        .then(data => {
            this.agentWebLeads = data;

            TotalAgentWebLeads({ agentId: USER_ID }).then((result1) => {
                this.v_TotalAgentLeadRecords = result1;
                console.log("Total records on load:" + this.v_TotalAgentLeadRecords);
              });

        })
        .catch(error => {
            this.error = error;
        });

    
       
      }

      handleNextAgentLead(){
        getAgentWebLeads({
            agentId: USER_ID,
            v_Offset: this.v_Offset,
            v_pagesize: this.page_size
        })
        .then(data => {
            this.agentWebLeads = data;

     

        })
        .catch(error => {
            this.error = error;
        });
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
                this.showToast("Web Enquiry", "New Web Enquiry", "warn");
                this.v_TotalAgentLeadRecords = parseInt(this.v_TotalAgentLeadRecords) + 1;
                //this.refresh();
            console.log('New message received: ', JSON.stringify(response));
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



        showToast(title, message, variant) {
            const evt = new ShowToastEvent({
              title: title,
              message: message,
              variant: variant
            });
            this.dispatchEvent(evt);
          }
    

}