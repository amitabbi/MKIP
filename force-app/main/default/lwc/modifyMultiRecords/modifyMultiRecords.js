import { LightningElement, track, api } from 'lwc';
import SearchContact from '@salesforce/apex/SearchContact.SearchContact';
import ModifyContact from '@salesforce/apex/ModifyContact.ModifyContact';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
export default class ModifyMultiRecords extends LightningElement {
    @track contact;
    @track error;

CEmail;
@track CPhone;
@track ConId;

handleChange(event){

    if (event.target.name === 'CEmail'){
        this.CEmail = event.target.value;
        console.log(this.CEmail);
    }
    else if (event.target.name === 'CPhone'){
        this.CPhone = event.target.value;
    }
}

handleSearchClick(){
    SearchContact({searchKey: this.CEmail})
    .then(result => {
        if (result != null){
        this.contact = result;
        this.CPhone = result.Phone;
        this.ConId = result.Id;
        //console.log(ConId);
        
        console.log("Success finding a contact");
        }
    })
    .catch(error => {
        this.error = error;
        console.log("Error finding a contact");
    });
}

handleClick(){
    ModifyContact({ConId: this.ConId,CPhone: this.CPhone})
    
    .then(() => {

        console.log("Success updating a contact");
        
        
    })
    .catch(error => {
        this.error = error;
        console.log("Error updating a contact");
    });
}




}