import { LightningElement,wire,api } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import getAccountData from '@salesforce/apex/GetAccountPaginateData.GetAccPagData';


const columns = [
    { label: 'Account Name', fieldName: 'Name' },
    { label: 'Account Number', fieldName: 'AccountNumber' },
];

const FIELDS = [
    'Account.Name',
    'Account.AccountNumber'
];

export default class PaginateData extends LightningElement {

    columns = columns;
    accounts=[];
    offsetval = 0;
    loadMoreStatus;
    totalNumberOfRows = 200;
    targetDatatable; 
    error;

    //@wire(getAccountData,  { v_Offset: '$offsetval'})
    //accounts;

    connectedCallback(){

        this.getAccountRecords();
       
    }

    getAccountRecords(){
        return getAccountData({
            v_Offset: this.offsetval
        })
        .then(result => {
            let updatedRecords = [...this.accounts, ...result];
            this.accounts = updatedRecords;
            this.error = undefined;

        })
        .catch(error => {
            this.error = error;
            this.accounts = undefined;
        });
    }

    loadMoreData(event) {
        const { target } = event;
        target.isLoading = true;

        this.offsetval = this.offsetval + 20;
        this.getAccountRecords()
            .then(()=> {
                target.isLoading = false;
            });   
    }

    


    
}