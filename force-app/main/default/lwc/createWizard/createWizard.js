import { LightningElement,api,track} from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import createsimplewizardrecords from '@salesforce/apex/CreateSimpleWizardRecords.CreateSimpleWizardRecords';
export default class CreateWizard extends LightningElement {
step1 = true;
step2 = false;
step3 = false;
@track accountName;
@track conFirstName;
@track conLastName;
@track enqName;
@api accName;
step1accountnameval;

    handleStep1NextClick(event){
        console.log("Inside Parent Step 1 Button Click");
        console.log("Account Name is " + this.accountName);
        this.step1 = false;
        this.step2 = true;

    }

    @api handleStep2PreviousClick(event){
        this.step1 = true;
        this.step2 = false;
        console.log("Inside Step 2 Previous Button Click");
        console.log(this.accountName);
        //msg = "Great"
        this.template.querySelector('c-create-wizard-step1').connectedCallBack(this.accountName);
        //let template = document.getElementById('ftemp');
        //this.template.querySelector('.ftemp').setInputVal();



        


    }

    handleStep2NextClick(event){
        console.log("Inside Parent Step 2 Button Click");
        console.log("First Name is " + this.conFirstName);
        console.log("Last Name is " + this.conLastName);
        this.step2 = false;
        this.step3 = true;

    }

    handleStep3PreviousClick(event){
        this.step2 = true;
        this.step3 = false;

    }

    handleAccountName(event){
        this.accountName = event.detail;
    }

    handleCon(event){
        this.conFirstName = event.detail.FirstName;
        this.conLastName = event.detail.LastName;
    }

    handleEnq(event){
        this.enqName = event.detail.EnquiryName;
    }



    handleStep3SubmitClick(event){
        console.log("Enquiry Name is " + this.enqName);
        createsimplewizardrecords({aName: this.accountName, fName: this.conFirstName,lName: this.conLastName,enqName: this.enqName})
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