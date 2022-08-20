import { LightningElement,api,wire,track } from 'lwc';
import {
    getRecord,
    getFieldValue
} from 'lightning/uiRecordApi';
import { updateRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { refreshApex } from '@salesforce/apex';
import LOT_LANDS_FIELD from '@salesforce/schema/XProp_Lot__c.Landscaping_Observations__c';
import LOT_KIT_FIELD from '@salesforce/schema/XProp_Lot__c.Kitchen_Observations__c';
import LOT_DRIVE_FIELD from '@salesforce/schema/XProp_Lot__c.Driveway_and_Entrance_Observations__c';
import LOT_BATH_FIELD from '@salesforce/schema/XProp_Lot__c.Bathrooms_Observations__c';
import LOT_EXT_FIELD from '@salesforce/schema/XProp_Lot__c.Exterior_Observations__c';
import LOT_STRUC_FIELD from '@salesforce/schema/XProp_Lot__c.Structure_Observations__c';
import LOT_WIN_FIELD from '@salesforce/schema/XProp_Lot__c.Windows_Doors_and_Wood_Trim_Observatio__c';
import LOT_HEAT_FIELD from '@salesforce/schema/XProp_Lot__c.Heating_and_Cooling_Observations__c';
import ID_FIELD from '@salesforce/schema/XProp_Lot__c.Id';

const FIELDS = [LOT_LANDS_FIELD, LOT_KIT_FIELD, LOT_DRIVE_FIELD, LOT_BATH_FIELD, LOT_EXT_FIELD, LOT_STRUC_FIELD, LOT_WIN_FIELD, LOT_HEAT_FIELD];

export default class XpropPrelimInspectView extends LightningElement {

    @api lotId;
    @api lotName;
    land;
    drive;
    exterior;
    windows;
    kitchen;
    bath;
    struct;
    heatcool;
    preliminspection;
    tglLands;
    tglDriv;
    tglExt;
    tglKit;
    tglWindows;
    tglBath;
    tglStruct;
    tglHeatCool;
    //showPI;

    @wire(getRecord, { recordId: '$lotId', fields: FIELDS })
    wiredRecord({ error, data }) {
        if (error) {
            let message = 'Unknown error';
            if (Array.isArray(error.body)) {
                message = error.body.map(e => e.message).join(', ');
            } else if (typeof error.body.message === 'string') {
                message = error.body.message;
            }
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error loading contact',
                    message,
                    variant: 'error',
                }),
            );
        } else if (data) {
            this.preliminspection = data;
            this.tglLands = this.preliminspection.fields.Landscaping_Observations__c.value;
            this.tglKit = this.preliminspection.fields.Kitchen_Observations__c.value;
            this.tglDriv = this.preliminspection.fields.Driveway_and_Entrance_Observations__c.value;
            this.tglExt = this.preliminspection.fields.Exterior_Observations__c.value;
            this.tglWindows = this.preliminspection.fields.Windows_Doors_and_Wood_Trim_Observatio__c.value;
            this.tglBath = this.preliminspection.fields.Bathrooms_Observations__c.value;
            this.tglStruct = this.preliminspection.fields.Structure_Observations__c.value;
            this.tglHeatCool = this.preliminspection.fields.Heating_and_Cooling_Observations__c.value;
            }
        }
    
        get showPI(){
            if ((this.tglLands !== null || this.tglKit !== null || this.tglDriv !== null || this.tglExt !== null || this.tglWindows !== null || this.tglBath !== null || this.tglStruct !== null || this.tglHeatCool !== null) && this.lotId.length > 0){
                return true;
            }
            return false;
        }

   
    txChangeHandler(event){

        if (event.target.name === 'input1'){
            this.land = event.target.value;
        }
        if (event.target.name === 'input2'){
            this.drive = event.target.value;
        }
        if (event.target.name === 'input3'){
            this.exterior = event.target.value;
        }
        if (event.target.name === 'input4'){
            this.windows = event.target.value;
        }
        if (event.target.name === 'input5'){
            this.kitchen = event.target.value;
        }
        if (event.target.name === 'input6'){
            this.bath = event.target.value;
        }
        if (event.target.name === 'input7'){
            this.struct = event.target.value;
        }
        if (event.target.name === 'input8'){
            this.heatcool = event.target.value;
        }

    }


    prelimInspectSubmitHandler(event){
        event.preventDefault();


        const fields = {};
        fields[ID_FIELD.fieldApiName] = this.lotId;
        fields[LOT_LANDS_FIELD.fieldApiName] = this.land;
        fields[LOT_DRIVE_FIELD.fieldApiName] = this.drive;
        fields[LOT_EXT_FIELD.fieldApiName] = this.exterior;
        fields[LOT_WIN_FIELD.fieldApiName] = this.windows;
        fields[LOT_KIT_FIELD.fieldApiName] = this.kitchen;
        fields[LOT_BATH_FIELD.fieldApiName] = this.bath;
        fields[LOT_STRUC_FIELD.fieldApiName] = this.struct;
        fields[LOT_HEAT_FIELD.fieldApiName] = this.heatcool;
   

      

        const recordInput  = {fields};

        updateRecord(recordInput).then( feedback => {
           
        


            this.showToast('SUCCESS', 'Lot Record Updated Successfully', 'success');
            return refreshApex(this.preliminspection);
          

        }).catch( error => {
            //console.log("Inside Error enquiries promise");
            //this.isLoading = false;
            this.showToast('ERROR', error.body.message, 'error');
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