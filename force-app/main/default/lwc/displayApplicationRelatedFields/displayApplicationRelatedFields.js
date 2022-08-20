import { LightningElement,wire,api, track } from 'lwc';
import getApplicationRelatedFields from '@salesforce/apex/ApplicationRelatedFields.GetApplicationRelatedFields';

export default class DisplayApplicationRelatedFields extends LightningElement {

    @track appFieldValues = [];
    woFieldValues;
    @api recordId;
    @track mapData= [];
    
    connectedCallback(){
        this.fetchApplicationRelatedFields();
    }

    fetchApplicationRelatedFields(){
        getApplicationRelatedFields({recordId: this.recordId})
        .then(result => {
            //console.log("result :", result);
            //this.appFieldValues = result[0];
            //this.woFieldValues = result[1];
            

            /*for(let key in result) {
                // Preventing unexcepted data
                if (result.hasOwnProperty(key)) { // Filtering the data in the loop
                    this.fieldValues.push({value:result[key], key:key});
                }
            }*/
            //console.log("result :", this.appFieldValues);
            //console.log("result :", this.woFieldValues);

            //this.contacts = result;

            var conts = result;
            console.log("conts :", conts);
            for(var key in conts){
                this.mapData.push({value:conts[key], key:key}); //Here we are creating the array to show on UI.
            }
            console.log("mapData :", this.mapData);

        })
    }


}