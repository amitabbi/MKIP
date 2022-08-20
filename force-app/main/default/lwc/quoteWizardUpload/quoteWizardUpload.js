import { LightningElement,wire,api } from 'lwc';
import ContactId from '@salesforce/schema/AccountContactRelation.ContactId';
import saveFile from '@salesforce/apex/UploadFile.saveFile';
import { ShowToastEvent } from "lightning/platformShowToastEvent";

export default class QuoteWizardUpload extends LightningElement {
    lookUpDisabled;
    targetFieldAPIName;
    targetObjectAPIName;
    displayReset = true;
    @api myRecordId;
    flgObjCb;
    targetObjectAPIName = 'Opportunity';
    targetFieldAPIName = 'ContactId';
    selectedRecordId;
    filesUploaded = [];
    file;
    fileContents;
    fileReader;
    content;
    fileName = '';
    UploadFile = 'Upload File';
    activeSection = 'A';
    fileDisabled = true;

    get objOptions() {
        return [
            { label: 'Account', value: 'Account' },
            { label: 'Contact', value: 'Contact' },
            { label: 'Case', value: 'Case' },
            { label: 'Opportunity', value: 'Opportunity' },
        ];
      }

    handleToggleSection(event){

    }

    handleValueSelcted(event){
        this.selectedRecordId = event.detail;
        this.myRecordId = event.detail;
        this.activeSection = 'C';
        this.fileDisabled = false;
        console.log("myRecordId is:" + this.myRecordId);
    }

    handleObjectChange(event){
        this.activeSection = 'B';
       
       // this.refreshValues();

        if (event.detail.value === 'Account'){
            this.targetObjectAPIName = 'Contact';
            this.targetFieldAPIName = 'AccountId';
        }

        if (event.detail.value === 'Contact'){
            this.targetObjectAPIName = 'Case';
            this.targetFieldAPIName = 'ContactId';
        }

        if (event.detail.value === 'Opportunity'){
            this.targetObjectAPIName = 'Order';
            this.targetFieldAPIName = 'OpportunityId';
        }

        if (event.detail.value === 'Case'){
            this.targetObjectAPIName = 'Asset';
            this.targetFieldAPIName = 'CaseId__c';
        }
        
    }

    selectedRecordHandler(event){
        this.selectedRecordId = event.detail;
        this.fileDisabled = true;
    }
 

    get acceptedFormats() {
        return ['.pdf', '.png','.jpg','.jpeg'];
    }

    handleUploadFinished(event) {
        // Get the list of uploaded files
        const uploadedFiles = event.detail.files;
        alert("No. of files uploaded : " + uploadedFiles.length);
    }

    handleFilesChange(event){

        if(event.target.files.length > 0) {
            this.filesUploaded = event.target.files;
            this.fileName = event.target.files[0].name;
            this.upload();
        }
    }

    upload() {
        this.file = this.filesUploaded[0];
       if (this.file.size > this.MAX_FILE_SIZE) {
            window.console.log('File Size is to long');
            return ;
        }
        this.showLoadingSpinner = true;
        // create a FileReader object 
        this.fileReader= new FileReader();
        // set onload function of FileReader object  
        this.fileReader.onloadend = (() => {
            this.fileContents = this.fileReader.result;
            let base64 = 'base64,';
            this.content = this.fileContents.indexOf(base64) + base64.length;
            this.fileContents = this.fileContents.substring(this.content);
            
            // call the uploadProcess method 
            this.saveToFile();
        });
    
        this.fileReader.readAsDataURL(this.file);
    }

    saveToFile(){
        console.log("idParent is:" + this.myRecordId);
        saveFile({ idParent: this.myRecordId[0], strFileName: this.file.name, base64Data: encodeURIComponent(this.fileContents)})
        .then(result => {
            //window.console.log('result ====> ' +result);
            // refreshing the datatable
            //this.getRelatedFiles();
            

            this.fileName = this.fileName + ' - Uploaded Successfully';
            this.UploadFile = 'File Uploaded Successfully';
            this.isTrue = true;
            //this.showLoadingSpinner = false;

            // Showing Success message after file insert
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success!!',
                    message: this.file.name + ' - Uploaded Successfully!!!',
                    variant: 'success',
                }),
            );

        })
        .catch(error => {
            // Showing errors if any while inserting the files
            window.console.log(error);
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error while uploading File',
                    message: error.message,
                    variant: 'error',
                }),
            );
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