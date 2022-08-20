import { LightningElement, api, track } from 'lwc';
import { updateRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';





export default class UeBundleSupplyAssessment extends LightningElement {

    columns = [
        {
            label: 'Application Number',
            fieldName: 'AppNum',
            type: 'text',
        }, {
            label: 'Is CT Required?',
            fieldName: 'CTReq',
            type: 'boolean',
            editable: true,
        }, {
            label: 'Agreed rate (in amps or kVA)',
            fieldName: 'AgreedRate',
            type: 'text',
            editable: true,
        }, {
            label: 'Mains Size',
            fieldName: 'MSZ',
            type: 'text',
            editable: true
        }, {
            label: 'Mains Type',
            fieldName: 'MTYP',
            type: 'text',
            editable: true
        }
    ];
    
 
    
        //columns = columns;
        saveDraftValues = [];

     
    

        @track data = [{uid: 1, AppNum: 'UECR-1980', CTReq: true, AgreedRate: '100', MSZ: 'DEF', MTYP: 'PLO'},
        {uid: 2, AppNum: 'UECR-1019', CTReq: false, AgreedRate: '90', MSZ: 'DUHGEF', MTYP: 'FRE'}
    ];
            //{ uid: 2, name: 'Arnav', phone: '1112223334' }
        
        
      
    
        handleSave(event) {
            this.saveDraftValues = event.detail.draftValues;
            const recordInputs = this.saveDraftValues.slice().map(draft => {
                const fields = Object.assign({}, draft);
                return { fields };
            });
    
            // Updateing the records using the UiRecordAPi
            const promises = recordInputs.map(recordInput => updateRecord(recordInput));
            Promise.all(promises).then(res => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Records Updated Successfully!!',
                        variant: 'success'
                    })
                );
                this.saveDraftValues = [];
                return this.refresh();
            }).catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error',
                        message: 'An Error Occured!!',
                        variant: 'error'
                    })
                );
            }).finally(() => {
                this.saveDraftValues = [];
            });
        }
    
        // This function is used to refresh the table once data updated
        async refresh() {
            await refreshApex(this.contacts);
        }


}