import { LightningElement,api,track } from 'lwc';
import createenquirycallout from '@salesforce/apex/CreateEnquiryCallOut.CreateEnquiryCallOut';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
export default class SendEnquiry extends LightningElement {

    @track enqNameVal;
    handleTextChange(event){
        if (event.target.name === 'enqName'){
        this.enqNameVal = event.target.value;
        }
    }

    handleClick(event){
        createenquirycallout({enqName: this.enqNameVal})
        .then(() => {
            console.log("Success");
            
        })

        .catch(error => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error on data save',
                    message: "error.message.body",
                    variant: 'error',
                }),
            );
        });
 
    }
}