import { LightningElement,wire,track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';
import managecontactenquiries from '@salesforce/apex/GetConEnqData.GetConEnqData';
import getNext from '@salesforce/apex/GetConEnqData.getNext';
import getPrevious from '@salesforce/apex/GetConEnqData.getPrevious';
import TotalRecords from '@salesforce/apex/GetConEnqData.TotalRecords';
export default class ManageContactEnquiries extends NavigationMixin(LightningElement) {
@track v_Offset=0;
@track v_TotalRecords;
@track page_size = 3;
@track enqId;
@track recordId;
record = {};
   @wire(managecontactenquiries,{ v_Offset: '$v_Offset', v_pagesize: '$page_size' }) conenq;
  
    
    

    //Executes on the page load
    connectedCallback() {
    TotalRecords().then(result=>{
        this.v_TotalRecords = result;
        });
    }

    handleNext(event) {
        console.log("Inside handleNext");
        console.log(this.v_Offset);
        getNext({v_Offset: this.v_Offset, v_pagesize: this.page_size}).then(result=>{
            if (this.v_Offset + 3 < this.v_TotalRecords){
            this.v_Offset = result;
            }
            console.log("Inside getNext");
            console.log(this.v_Offset);
            /*if(this.v_Offset + 3 > this.v_TotalRecords){
                this.template.querySelector('lightning-button.Next').disabled = true;
            }else{
                this.template.querySelector('lightning-button.Next').disabled = false;
            }*/
        });
    }

    handlePrevious(event) {
        console.log("Inside handlePrevious");
        console.log(this.page_size);
        getPrevious({v_Offset: this.v_Offset, v_pagesize: this.page_size}).then(result=>{
            if (result >=0){
            this.v_Offset = result;
            }
            console.log("Inside getPrevious");
            console.log(this.v_Offset);
            /*if(this.v_Offset === 0){
                this.template.querySelector('lightning-button.Previous').disabled = true;
            }else{
                this.template.querySelector('lightning-button.Previous').disabled = false;
            }*/
        });
    }

    handleCardClick(event){
        var cardId = event.currentTarget.id;
        var myRecId = cardId.substring(0,18); // added a substring function as the id was returned with -101 after the actual 18 digit id
        //cardId = this.recordId;
        //const cardId = "a1M0o00000JIdfeEAD";
        this.navigateToViewEnquiryPage(myRecId);
    }

    // Navigate to View Enquiry Page
    navigateToViewEnquiryPage(myRecId) {
        //const cardId = event.target.key;
        //const cardId = this.template.querySelector("lightning-card[key]");
        //this.enqId = conenq.Id;
        console.log("Inside NavigationMixin for Enquiry");
        console.log(myRecId);
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: myRecId,
                actionName: 'edit'
            }
        });
    }

   

    

}