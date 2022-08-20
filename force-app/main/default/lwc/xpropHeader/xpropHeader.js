import { LightningElement,wire } from 'lwc';
import {
    subscribe,
    unsubscribe,
    APPLICATION_SCOPE,
    MessageContext
  } from "lightning/messageService";
  import MYXPROPSUBMESSAGE from "@salesforce/messageChannel/MyXPropMessageChannel__c";
  import {
    getRecord,
    getFieldValue
} from 'lightning/uiRecordApi';
import PROJECT_NAME_FIELD from '@salesforce/schema/XProp_Project__c.Name';
import BUILDING_NAME_FIELD from '@salesforce/schema/XProp_Building__c.Name';
import BEDROOMS_NAME_FIELD from '@salesforce/schema/XProp_Lot__c.Bedrooms__c';
import BATHROOMS_NAME_FIELD from '@salesforce/schema/XProp_Lot__c.Bathrooms__c';
import FLOOR_NAME_FIELD from '@salesforce/schema/XProp_Lot__c.Floor__c';
import PRICE_NAME_FIELD from '@salesforce/schema/XProp_Lot__c.Price__c';
import LOTSTATUS_NAME_FIELD from '@salesforce/schema/XProp_Lot__c.Lot_Status__c';
import LOTSOLD_NAME_FIELD from '@salesforce/schema/XProp_Lot__c.Lot_Sold__c';

export default class XpropHeader extends LightningElement {

    @wire(MessageContext) messageContext;
    subscription = null;
    selectedProjectId;
    selectedBuildingId;
    selectedLotId;
    selectedLotName;
    showFirstDiv = false;
    buildingChanged;


    @wire(getRecord, {
        recordId: '$selectedProjectId',
        fields: [PROJECT_NAME_FIELD]
    })
    project;

    get projectName() {

        if (this.selectedProjectId && this.selectedProjectId.length > 0){
            //if (this.selectedProjectId && this.selectedProjectId.length > 0){
        return getFieldValue(this.project.data, PROJECT_NAME_FIELD);
        }

        //if (this.selectedProjectId){
        //    this.selectedLotName = '';
        //}
        
        return '';
    }

    @wire(getRecord, {
        recordId: '$selectedBuildingId',
        fields: [BUILDING_NAME_FIELD]
    })
    building;

    get buildingName() {

        //if (this.selectedBuildingId){
            if (this.selectedBuildingId && this.selectedBuildingId.length > 0){
        return getFieldValue(this.building.data, BUILDING_NAME_FIELD);
            }
        return '';
    }


    @wire(getRecord, {
        recordId: '$selectedLotId',
        fields: [FLOOR_NAME_FIELD,BEDROOMS_NAME_FIELD,BATHROOMS_NAME_FIELD,PRICE_NAME_FIELD,LOTSTATUS_NAME_FIELD,LOTSOLD_NAME_FIELD]
    })
    lot;

    get lotBedrooms() {
        if (this.selectedLotId && this.selectedLotId.length > 0){
           // this.showFirstDiv = true;
        return getFieldValue(this.lot.data, BEDROOMS_NAME_FIELD);
        }
        return '';  
    }
    get lotBathrooms() {
        if (this.selectedLotId && this.selectedLotId.length > 0){
           // this.showFirstDiv = true;
        return getFieldValue(this.lot.data, BATHROOMS_NAME_FIELD);
        }
        return '';  
    }

    get lotFloor() {
        if (this.selectedLotId && this.selectedLotId.length > 0){
           // this.showFirstDiv = true;
        return getFieldValue(this.lot.data, FLOOR_NAME_FIELD);
        }
        return '';  
    }

    get lotPrice() {
        if (this.selectedLotId && this.selectedLotId.length > 0){
           // this.showFirstDiv = true;
        return getFieldValue(this.lot.data, PRICE_NAME_FIELD);
        }
        return '';  
    }

    get lotStatus() {
        if (this.selectedLotId && this.selectedLotId.length > 0){
           // this.showFirstDiv = true;
        return getFieldValue(this.lot.data, LOTSTATUS_NAME_FIELD);
        }
        return '';  
    }

    get lotSold() {
        if (this.selectedLotId && this.selectedLotId.length > 0){
           // this.showFirstDiv = true;
        return getFieldValue(this.lot.data, LOTSOLD_NAME_FIELD);
        }
        return '';  
    }





    subscribeToMessageChannel() {
        if (this.subscription) {
          return;
        }
        this.subscription = subscribe(
          this.messageContext,
          MYXPROPSUBMESSAGE,
          (message) => {
            this.handleMessage(message);
          },
          { scope: APPLICATION_SCOPE }
        );
      }

      handleMessage(message) {
        
        this.selectedProjectId = message.projectId;
        this.selectedBuildingId = message.buildingId;
        this.selectedLotId = message.lotId;
        this.selectedLotName = message.lotName;
        //this.selectedLotName = message.lotName;
        console.log("receivedMessage is: " + this.selectedProjectId);
        console.log("receivedMessage is: " + this.selectedBuildingId);
        console.log("receivedMessage lotName is: " + this.selectedLotName);
        console.log("receivedMessage selectedLotId is: " + this.selectedLotId);
        //console.log("receivedMessage is: " + this.selectedLotName);
        //console.log("Lot Id in Header" + this.selectedLotId.length);

        if (this.selectedLotId === undefined || this.selectedLotId === '' || this.selectedBuildingId === '' || this.selectedProjectId === ''){
            //if (this.selectedLotId === undefined || this.selectedBuildingId === '' || this.selectedProjectId === ''){
                this.selectedLotId = '';
                this.selectedLotName = '';
            this.showFirstDiv = false;
            
        }else{
            this.showFirstDiv = true;
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