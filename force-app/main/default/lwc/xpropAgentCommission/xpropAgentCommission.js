import { LightningElement,wire,api,track } from 'lwc';
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import getLotAgentCommission from "@salesforce/apex/GetXPropTabData.getLotAgentCommission";
import updateLotAgentCommission from "@salesforce/apex/GetXPropTabData.updateLotAgentCommission";
import { refreshApex } from '@salesforce/apex';

export default class XpropAgentCommission extends LightningElement {

    firstPaymentMade;
    secondPaymentMade;
    thirdPaymentMade;
    firstPaymentProgress = "0";
    secondPaymentProgress = "0";
    thirdPaymentProgress = "0";
    @api lotId;
    @api lotName;
    @track lotagentcommission;
    error;
    _wiredRecord;

    connectedCallback(){
        clearInterval(this._interval);
    }
    renderedCallback(){
        clearInterval(this._interval);
    }


    @wire(getLotAgentCommission, { lotId: '$lotId' })
    wiredLotAgentCommission(result) {
        this._wiredRecord = result;
        if (result.data) {
            this.lotagentcommission = result.data;
            console.log("Agent Lot Commission:" + this.lotagentcommission);
            console.log("Agent Lot Commission:" + JSON.stringify(this.lotagentcommission));
            this.firstPaymentMade = this.lotagentcommission.First_Payment__c;
            this.secondPaymentMade = this.lotagentcommission.Second_Payment__c;
            this.thirdPaymentMade = this.lotagentcommission.Third_Payment__c;
            this.error = undefined;
            console.log("Agent First Payment:" + this.firstPaymentMade);

            if (this.firstPaymentMade === true){
                this.firstPaymentProgress = "100";
            }else{
                this.firstPaymentProgress = "0";
            }
            if (this.secondPaymentMade === true){
                this.secondPaymentProgress = "100";
            }else{
                this.secondPaymentProgress = "0";
            }
            if (this.thirdPaymentMade === true){
                this.thirdPaymentProgress = "100";
            }else{
                this.thirdPaymentProgress = "0";
            }

        } else if (result.error) {
            this.error = result.error;
            this.lotagentcommission = undefined;
        }
    }

    
    firstPaymentHandler(){
        console.log("Lot Id in Agent Commission tab is" + this.lotId);

        updateLotAgentCommission({
            lotId: this.lotId,
            firstPay: true,
            secondPay: false,
            thirdPay: false

        })
        .then(result => {

            this.firstPaymentMade = true;
            this.showToast('SUCCESS', 'First Commission Payment Sent Successfully', 'success');
            return refreshApex(this._wiredRecord);

        })
        .catch(error => {
            this.showToast('ERROR', error.body.message, 'error');
        });

    }

    secondPaymentHandler(){
        console.log("Lot Id in Agent Commission tab is" + this.lotId);
        updateLotAgentCommission({
            lotId: this.lotId,
            firstPay: false,
            secondPay: true,
            thirdPay: false

        })
        .then(result => {
            this.secondPaymentMade = true;
            this.showToast('SUCCESS', 'Second Commission Payment Sent Successfully', 'success');
            return refreshApex(this._wiredRecord);
        })
        .catch(error => {
            this.showToast('ERROR', error.body.message, 'error');
        });

    }

    thirdPaymentHandler(){
        console.log("Lot Id in Agent Commission tab is" + this.lotId);
        updateLotAgentCommission({
            lotId: this.lotId,
            firstPay: false,
            secondPay: false,
            thirdPay: true

        })
        .then(result => {
            this.thirdPaymentMade = true;
            this.showToast('SUCCESS', 'Third Commission Payment Sent Successfully', 'success');
            return refreshApex(this._wiredRecord);
        })
        .catch(error => {
            this.showToast('ERROR', error.body.message, 'error');
        });

    }

    disconnectedCallback() {
        // it's needed for the case the component gets disconnected
        // and the progress is being increased
        // this code doesn't show in the example
        clearInterval(this._interval);
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