import { LightningElement, track } from 'lwc';
import getS3FileContent from '@salesforce/apex/GetS3FileContent.getS3FileContent';

export default class GetS3FileByName extends LightningElement {
    @track im;


    handleAWSS3Calloout(){
        getS3FileContent({

        })
        .then(result => {
            


            this.im = result;
            console.log("S3 image is :" + this.im);

        })
        .catch(error => {
            this.error = error;
        });
    }

    previewHandler(event){
        //console.log(event.target.dataset.id)
        this[NavigationMixin.Navigate]({ 
            type:'standard__namedPage',
            attributes:{ 
                pageName:'filePreview'
            },
            state:{ 
                selectedRecordId: event.target.dataset.id
            }
        })
    }

}