import { LightningElement,api } from 'lwc';

export default class QuoteWizardMaster extends LightningElement {

    quotePageVisible = true;
    custPageVisible = false;
    priContactPageVisible = false;

    @api
    quotePageProceedClickHandler(event){
        console.log("Before Proceed Click");
        const quotePageState = event.detail;
        console.log(quotePageState);
       // this.custPageVisible = true;
        //this.quotePageVisible = false;
        this.template.querySelector('div.step1').classList.add('slds-hide');
        this.template.querySelector('div.step2').classList.remove('slds-hide');
        console.log("After Proceed Click");
    }

    @api
    quoteCustPagePreviousClickHandler(event){
        console.log("Before Previous Click");
        const quoteCustPageState = event.detail;
        console.log(quoteCustPageState);
        this.template.querySelector('div.step1').classList.remove('slds-hide');
        this.template.querySelector('div.step2').classList.add('slds-hide');
        console.log("After Previous Click");
    }


    @api
    quoteCustPageNextClickHandler(event){
        console.log("Before Next Click");
        const quoteCustPageNextState = event.detail;
        console.log(quoteCustPageNextState);
        this.template.querySelector('div.step3').classList.remove('slds-hide');
        this.template.querySelector('div.step2').classList.add('slds-hide');
        console.log("After Next Click");
    }

    @api
    quotePriConPagePreviousClickHandler(event){
        console.log("Before Pri Con Previous Click");
        const quotePriConPageNextState = event.detail;
        console.log(quotePriConPageNextState);
        this.template.querySelector('div.step3').classList.add('slds-hide');
        this.template.querySelector('div.step2').classList.remove('slds-hide');
        console.log("After Pri Con Previous Click");
    }
    
}