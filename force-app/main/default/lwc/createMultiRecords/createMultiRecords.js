import { LightningElement } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import createMultiRecords from '@salesforce/apex/CreateMultiRecords.CreateMultiRecords';
export default class CreateMultiRecords extends LightningElement {

    value = 'new';
    fName;
    lName;
    pType;
    

    handleTextChange(event){

        if (event.target.name === 'fName'){
        this.fName = event.target.value;
        }
        else if (event.target.name === 'lName'){
        this.lName = event.target.value;
        }
    }


    get options() {
        return [
            { label: 'New', value: 'new' },
            { label: 'Used', value: 'used' }
        ];
    }

    handleChange(event){
        this.pType = event.target.value;
    }

    handleClick(event){
        createMultiRecords({FName: this.fName,LName: this.lName,ProductType: this.pType})
        .then(() => {
            console.log("Success");
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success on data save',
                    message: "Saved",
                    variant: 'Success',
                }),
            );
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