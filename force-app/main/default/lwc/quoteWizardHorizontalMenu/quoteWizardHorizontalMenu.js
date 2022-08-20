import { LightningElement,wire,track,api } from 'lwc';
import getTaskList from '@salesforce/apex/GetQuoteWizardMenuRecords.getTasks';
import getLeadList from '@salesforce/apex/GetQuoteWizardMenuRecords.getLeads';
import getCaseList from '@salesforce/apex/GetQuoteWizardMenuRecords.getCases';
import getTaskTypeAhead from '@salesforce/apex/GetQuoteWizardMenuRecords.getTypeAheadTasks';
import getLeadTypeAhead from '@salesforce/apex/GetQuoteWizardMenuRecords.getTypeAheadLeads';
import getCaseTypeAhead from '@salesforce/apex/GetQuoteWizardMenuRecords.getTypeAheadCases';
import USER_ID from '@salesforce/user/Id';
import { refreshApex } from '@salesforce/apex';
import { NavigationMixin } from 'lightning/navigation';

/** The delay used when debouncing event handlers before invoking Apex. */
const DELAY = 300;

export default class QuoteWizard extends NavigationMixin(LightningElement) {
    ownId;
    tasksDisabled = true;
    leadsDisabled = false;
    casesDisabled = false;
    showTasks = true;
    showLeads = false;
    showCases = false;
    showTA = false;
    @track leads = [];
    @track cases = [];
    searchKey = '';
    showTasksTA = false;
    showLeadsTA = false;
    showCasesTA = false;
    isLoading = false;


    @wire(getTaskList, { ownId: USER_ID})
    tasks;

    @wire(getTaskTypeAhead, { ownId: USER_ID, searchKey: '$searchKey' })
    tasksTypeAheadRes;

    @wire(getLeadTypeAhead, { ownId: USER_ID, searchKey: '$searchKey' })
    leadsTypeAheadRes;

    @wire(getCaseTypeAhead, { ownId: USER_ID, searchKey: '$searchKey' })
    casesTypeAheadRes;

    connectedCallback(){
        console.log(USER_ID);
    }

    tasksClickHandler(event){

        this.isLoading = true;
        
        this.tasksDisabled = true;
        this.leadsDisabled = false;
        this.casesDisabled = false;
        this.isLoading = false;
        this.showLeads = false;
        this.showCases = false;
        this.showTasks = true;
        this.showTasksTA = false;
            this.showLeadsTA = false;
            this.showCasesTA = false;
        this.refresh();
        
    }

    leadsClickHandler(event){
        this.isLoading = true;
        console.log("Inside Leads Handler");
        this.tasksDisabled = false;
        this.leadsDisabled = true;
        this.casesDisabled = false;
        this.isLoading = false;
        this.showTasks = false;
        
        this.showCases = false;
        this.showTasksTA = false;
        this.showLeadsTA = false;
        this.showCasesTA = false;

        getLeadList({ ownId: USER_ID })
        .then(data => {
            this.leads = data;
            console.log("User Id is:" + USER_ID);
            console.log(this.leads);
            this.showLeads = true;
           
        })
        .catch(error => {
            this.error = error;
        });

        console.log("After Leads Handler");
    }

    casesClickHandler(event){
        this.tasksDisabled = false;
        this.leadsDisabled = false;
        this.casesDisabled = true;
        this.showTasks = false;
        this.showLeads = false;
        this.showTasksTA = false;
        this.showLeadsTA = false;
        this.showCasesTA = false;

        getCaseList({ ownId: USER_ID })
        .then(data => {
            this.cases = data;
            console.log("User Id is:" + USER_ID);
            console.log(this.cases);
            this.showCases = true;
           
        })
        .catch(error => {
            this.error = error;
        });


        
    }

    @api
    refresh(){
        return refreshApex(this.tasks);
    }

    handleKeyChange(event) {

        

        if (this.tasksDisabled === true){
            console.log("Inside");
            this.showTasks = false;
            this.showLeads = false;
            this.showCases = false;
            this.showTasksTA = true;
            this.showLeadsTA = false;
            this.showCasesTA = false;
            console.log("End");
           
        }
        if (this.leadsDisabled === true){
            console.log("Inside");
            this.showTasks = false;
            this.showLeads = false;
            this.showCases = false;
            this.showTasksTA = false;
            this.showLeadsTA = true;
            this.showCasesTA = false;
            console.log(this.showTasksTA);
            console.log("End");
           
        }
        if (this.casesDisabled === true){
            this.showTasks = false;
            this.showLeads = false;
            this.showCases = false;
            this.showTasksTA = false;
            this.showLeadsTA = false;
            this.showCasesTA = true;
       
        }

       
        

        // Debouncing this method: Do not update the reactive property as long as this function is
        // being called within a delay of DELAY. This is to avoid a very large number of Apex method calls.
        this.isLoading = true;
        window.clearTimeout(this.delayTimeout);
        
        const searchKey = event.target.value;
        console.log("Search Key is:" + searchKey);
        this.delayTimeout = setTimeout(() => {
            
            this.searchKey = searchKey;
            this.isLoading = false;
        }, DELAY);
    }


    navigateToEditPage(myRecId) {
        console.log(myRecId);
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: myRecId,
                actionName: 'edit'
            }
        });
    }

    editTaskHandler(event){
        var cardId = event.currentTarget.id;
        var myRecId = cardId.substring(0,18);
        this.navigateToEditPage(myRecId);
    }

    editLeadHandler(event){
        var cardId = event.currentTarget.id;
        var myRecId = cardId.substring(0,18);
        this.navigateToEditPage(myRecId);
    }

    editCaseHandler(event){
        var cardId = event.currentTarget.id;
        var myRecId = cardId.substring(0,18);
        this.navigateToEditPage(myRecId);
    }

}