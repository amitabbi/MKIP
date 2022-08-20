import { LightningElement,track,api, wire } from 'lwc';
import getCarTypes from '@salesforce/apex/getCarTypes.getCarTypes';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';
export default class CarSearchForm extends NavigationMixin(LightningElement) {
@track carTypes;

@wire(getCarTypes)
wiredCarType({data,error}){
    if (data){
        this.carTypes = [{value:'', label:'All Types'}];
        data.forEach(element => {
            
            const carType = {};
            carType.label = element.Name;
            carType.value = element.Id;
            this.carTypes.push(carType);
        });
    }else if (error){
        this.showToast('ERROR', error.body.message, 'error');
    }
}

handleNewClick(event){
    console.log("Inside New Click");
    this[NavigationMixin.Navigate]({
        type:'standard__objectPage',
        attributes:{
            objectApiName : 'Car_Type__c',
            actionName : 'new'
        },
    });

}

handleCarTypeChange(event){
    const carTypeId = event.detail.value;

    // Creates the event with the data.
    const selectedEvent = new CustomEvent("cartypeselect", {
        detail: carTypeId,
        bubbles: true
        
      });
      
      // Dispatches the event.
      this.dispatchEvent(selectedEvent);
}

showToast(title, message, variant) {
    const evt = new ShowToastEvent({
        title: title,
        message: message,
        variant: variant,
    });
    this.dispatchEvent(evt);
}




}