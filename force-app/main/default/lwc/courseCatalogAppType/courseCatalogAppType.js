import { LightningElement,wire,api,track } from 'lwc';
import getApplicationSelections from '@salesforce/apex/CourseCatalog.getApplicationSelections';
import { NavigationMixin } from 'lightning/navigation';

export default class CourseCatalogAppType extends NavigationMixin(LightningElement) {

    @track appTypes = [];
    @track appSubTypes = [];
    @track appSubTypesList = [];
    isLoading = false;
    isEducation;
    isIT;
    isMedicine;
    showSubTypes;
    sfdcBaseURL;
    flowType;

    renderedCallback(){
        this.sfdcBaseURL = window.location.href;
        console.log('sfdcBaseURL is:' + this.sfdcBaseURL);
    }

    @wire(getApplicationSelections)
    wiredAppTypes({data,error}){
        if(data){
            this.isLoading = true;
            this.appTypes = data.applicationTypeList;
            console.log('Application Types List:' + JSON.stringify(this.appTypes));
            this.isLoading = false;
        }
        else if(error){
            this.showToast('ERROR', error.body.message, 'error');
        }
    }


    @wire(getApplicationSelections)
    wiredSubAppTypes({data,error}){
        if(data){
            this.isLoading = true;
            this.appSubTypes = data.applicationSubTypeList;
            console.log('Application Sub Types List:' + JSON.stringify(this.appSubTypes));
            this.isLoading = false;
        }
        else if(error){
            this.showToast('ERROR', error.body.message, 'error');
        }
    }

    handleApppTypeClick(event){

        event.preventDefault();
        event.stopPropagation();
        console.log('Inside Click Handler');
        // iterate through the sub types and insert into an array based on the applicaton type selection.

            console.log('Application Type Name' + event.target.name);

            var AppTypeName = event.target.name;
            this.flowType = event.target.name;
            this.appSubTypesList = [];
            //if (!this.showSubTypes){
            for(let i = 0; i < this.appSubTypes.length; i++) {
                if (this.appSubTypes[i].Application_Type__r.Name === AppTypeName){
                    
                this.appSubTypesList.push({Id: this.appSubTypes[i].Id, Application_Sub_Type_URL__c: this.appSubTypes[i].Application_Sub_Type_URL__c});
                }
                this.showSubTypes = true;
            //}
        }
            
        //});

           /* if (subt.Application_Type__r.Name === 'Science'){
                //this.appSubTypesList.push(subt.Id);
                console.log('Inside the IF loop');
                this.appSubTypesList=  this.appSubTypesList.push({Id: subt.Id, Application_Sub_Type_URL__c: subt.Application_Sub_Type_URL__c});
                this.appSubTypesList = [...this.appSubTypesList, myNewElement];
                console.log('After Push');
                this.showSubTypes = true;
            }


            
        });*/
        
        console.log(JSON.stringify(this.appSubTypesList));

    }

    handleApppSubTypeClick(event){
        event.preventDefault();
        event.stopPropagation();
        console.log('Inside ApppSubType Click Handler');
        

    }

    handleGetStartedClick(){
        console.log('Before redirection handleGetStartedClick');
        this.navigateToWebPage(this.getBaseUrl(),true);
        console.log('After redirection handleGetStartedClick');
    }

    getBaseUrl(){
        //let sfdcBaseURL = window.location.origin;
        console.log('sfdcBaseURL is:' + this.sfdcBaseURL);
        let baseUrl = 'https://amitabbikip-developer-edition.ap8.force.com/saras/s/createapplication?'+'flowType='+this.flowType;
        console.log('Base URL is:' + baseUrl);
        return baseUrl;
    }

	/** Navigate to external web page
	* //
	*/
    navigateToWebPage(url,currentWindow){
        if(currentWindow){
            window.open(url, "_self"); //Navigates to external url in same/current tab  
        }else{
            this[NavigationMixin.Navigate]({ //Navigates to external url in new/different tab
                type: this.standardWebPageType,
                attributes : {
                    url: url
                }
            });
        }
	}	

}