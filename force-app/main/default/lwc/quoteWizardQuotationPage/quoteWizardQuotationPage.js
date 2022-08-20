import { LightningElement,api,wire,track } from 'lwc';
import QUOTEWIZAPPMC from '@salesforce/messageChannel/MyQuoteWizMessageChannel__c';
import { APPLICATION_SCOPE, createMessageContext, MessageContext, publish, releaseMessageContext, subscribe, unsubscribe } from 'lightning/messageService';
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import CricketAustralia from '@salesforce/resourceUrl/CricketAustralia';
import TennisAustralia from '@salesforce/resourceUrl/TennisAustralia';
import AFLAustralia from '@salesforce/resourceUrl/AFLAustralia';

const items = [
    {
        label: 'Quote Summary',
        name: '1',
        expanded: true,
        items: [],
    },
   
];

export default class QuoteWizardQuotationPage extends LightningElement {

    @track value = '';
    @api quotePageProceedClicked = false;
    radioGroup1Val;
    radioGroup2Val;
    radioGroup3Val;
    radioGroup4Val;
    totalBeforeDiscount;
    totalAfterDiscount;
    radioGroupSportVal;
    @wire(MessageContext) messageContext;
    quoteTrue = true;
    sportImg;
    displayCricket = false;
    displayTennis = false;
    displayFooty = false;
    conId;
    isLoading = false;


    treeList = items;

    get optionsSport() {
        return [
            { label: 'Cricket', value: 'Cricket' },
            { label: 'Footy', value: 'Footy' },
            { label: 'Tennis', value: 'Tennis' },
        ];
    }

    get options1() {
        return [
            { label: '8-10', value: 'Kid' },
            { label: '13-20', value: 'Teen' },
            { label: '20+', value: 'Adult' },
        ];
    }

    get options2() {
        return [
            { label: 'Female', value: 'Female' },
            { label: 'Male', value: 'Male' },
        ];
    }

    get options3() {
        return [
            { label: 'MCG', value: 'MCG' },
            { label: 'Marvel', value: 'Marvel' },
            { label: 'Rod Laver', value: 'Rod Laver' },
        ];
    }

    get options4() {
        return [
            { label: '5%', value: '5%' },
            { label: '10%', value: '10%' },
            { label: '15%', value: '15%' },
            { label: '20%', value: '20%' },
        ];
    }

    selectHandler(event){

        if (event.target.name === 'radioGroupSport'){
            this.radioGroupSportVal = event.target.value;

            if (this.radioGroupSportVal === 'Tennis'){
                this.displayTennis = true;
                this.displayCricket = false;
                this.displayFooty = false;
                this.sportImg = this.tennisAustraliaURL;
            }else if (this.radioGroupSportVal === 'Cricket'){
                this.displayCricket = true;
                this.displayTennis = false;
                this.displayFooty = false;
                this.sportImg = this.cricketAustraliaURL;
            }else if (this.radioGroupSportVal === 'Footy'){
                this.displayFooty = true;
                this.displayCricket = false;
                this.displayTennis = false;
                this.sportImg = this.aflAustraliaURL;
                
            }

     

        }

        if (event.target.name === 'radioGroup1'){
            this.radioGroup1Val = event.target.value;

     

        }
        if (event.target.name === 'radioGroup2'){
            this.radioGroup2Val = event.target.value;

          
        }
        if (event.target.name === 'radioGroup3'){
            this.radioGroup3Val = event.target.value;
            this.sendMessageService();

           
        }
        if (event.target.name === 'radioGroup4'){
            this.radioGroup4Val = event.target.value;

            if (this.radioGroup4Val === '5%'){
                this.totalBeforeDiscount = 'Before Discount: $100'
                this.totalAfterDiscount = 'After Discount: $95'
            }

            if (this.radioGroup4Val === '10%'){
                this.totalBeforeDiscount = 'Before Discount: $100'
                this.totalAfterDiscount = 'After Discount: $90'
            }

            if (this.radioGroup4Val === '15%'){
                this.totalBeforeDiscount = 'Before Discount: $100'
                this.totalAfterDiscount = 'After Discount: $85'
            }

            if (this.radioGroup4Val === '20%'){
                this.totalBeforeDiscount = 'Before Discount: $100'
                this.totalAfterDiscount = 'After Discount: $80'
            }

        }

   
    }

    sendMessageService() {
        
        publish(this.messageContext, QUOTEWIZAPPMC, { homeGround : this.radioGroup3Val, conId : '' });
      }

    

    @api
    handleQuoteProceedClick(event){
        
        if (!this.radioGroup1Val || !this.radioGroup2Val || !this.radioGroup3Val || !this.radioGroup4Val){
            this.showToast("Proceed Warning", "Selections are incomplete", 'warn');
            return;
        }


        this.isLoading = true;

        //event.preventDefault();
        this.quotePageProceedClicked = true;
        const selectedEvent = new CustomEvent("quotepageproceedclicked", {
            detail: this.quotePageProceedClicked,
            bubbles: true
            
          });
          
          // Dispatches the event.
          this.dispatchEvent(selectedEvent);
          this.isLoading = false;
          console.log("QuotePageProceedClicked event is dispatched");
          
          publish(this.messageContext, QUOTEWIZAPPMC, { homeGround : this.radioGroup3Val, step : 'step2', group : this.radioGroup1Val, gender : this.radioGroup2Val, discount :  this.radioGroup4Val, sport : this.radioGroupSportVal });
          
    }

    handleQuoteResetClick(event){
        this.totalBeforeDiscount = ''
        this.totalAfterDiscount = ''
        this.value = undefined;
        this.radioGroup1Val = '';
        this.radioGroup2Val = '';
        this.radioGroup3Val = '';
        this.radioGroup4Val = '';
        publish(this.messageContext, QUOTEWIZAPPMC, { homeGround : false });
    }



    showToast(title, message, variant) {
        const evt = new ShowToastEvent({
          title: title,
          message: message,
          variant: variant
        });
        this.dispatchEvent(evt);
      }

      @api
      get cricketAustraliaURL() {
        return CricketAustralia;
      }

      @api
      get tennisAustraliaURL() {
        return TennisAustralia;
      }

      @api
      get aflAustraliaURL() {
        return AFLAustralia;
      }


     

}