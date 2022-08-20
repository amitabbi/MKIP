import { LightningElement,api,wire,track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getExperiences from '@salesforce/apex/CarExperience.getExperiences';
import { NavigationMixin } from 'lightning/navigation';

export default class CarExperiences extends NavigationMixin(LightningElement) {

    privateCarId;
    @track carExperiences = [];
    connectedCallback(){
        this.getCarExperiences();
    }

    @api
    get carId(){
        this.privateCarId;
    }

    
    set carId(value){
        this.privateCarId = value;
        this.getCarExperiences();
    }

    @api
    getCarExperiences(){
        getExperiences({carId : this.privateCarId}).then( (experiences) =>{
            this.carExperiences = experiences;
        }).catch((error) =>{
            this.showToast('ERROR', error.body.message, 'error');
        })
    }

    userClickHandler(event){
        const userId = event.target.getAttribute('data-userId');
        this[NavigationMixin.Navigate]({
            type:'standard__objectPage',
            attributes:{
                recordId : userId,
                actionName : 'view'
            },
        });
    }

    get hasExperiences(){
        if (this.carExperiences.length > 0){
            return true;
        }
        return false;
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