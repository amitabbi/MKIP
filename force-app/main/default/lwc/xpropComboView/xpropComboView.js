import { LightningElement,api,wire } from 'lwc';
import getProjects from '@salesforce/apex/GetPropComboValues.getProjects';
import getBuildings from '@salesforce/apex/GetPropComboValues.getBuildings';
import getLots from '@salesforce/apex/GetPropComboValues.getLots';
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import XPROPPUBAPPMC from '@salesforce/messageChannel/MyXPropMessageChannel__c';
import { APPLICATION_SCOPE, createMessageContext, MessageContext, publish, releaseMessageContext, subscribe, unsubscribe } from 'lightning/messageService';

export default class XpropComboView extends LightningElement {

    projectOptions;
    buildingOptions;
    lotOptions;
    @wire(MessageContext) messageContext;
    @api lotId;
    @api projectId;
    @api buildingId;
    @api lotName;
    @api projectName;
    error;


    @wire(getProjects)
    wiredProjects({data,error}){
        if (data){
            this.projectOptions = [{value:'', label:'None'}];
            data.forEach(element => {
                
                const projs = {};
                projs.label = element.Name;
                projs.value = element.Id;
                this.projectOptions.push(projs);
            });

            
        }else if (error){
            this.showToast('ERROR', error.body.message, 'error');
        }
    }

    get flgObjCb(){
        if (this.projectId){
            return false;
        }
        return true;
    }

    handleProjectChange(event){
        this.projectId = event.detail.value;
        console.log("Project Id is:" + this.projectId);

        // get label of the selected value from the Lot combobox
        var currentLabel = this.projectOptions.filter(option => {
            return option.value == this.projectId;
         });

         this.projectName = currentLabel[0].label;

       
        this.lotId = ''; // setting lotId to empty as header should display content only when lot is selected.
        // publish the message to the LMS channel
        this.sendMessageService();

        const selectedEvent = new CustomEvent("captureprojectinfo", {
            detail: {
                projectChanged: 'true',
                projectId: this.projectId,
                projectName: this.projectName
            },
            bubbles: true
            
          });
          
          // Dispatches the event.
          this.dispatchEvent(selectedEvent);
        
        //this.lotOptions = '';

        // get label of the selected value from the Lot combobox
        //var currentProjLabel = this.projectOptions.filter(option => {
         //   return option.value == this.projectId;
        // });

         //this.projName = currentProjLabel[0].label;
         //if (this.projName === 'None'){
           // this.buildingOptions = null;
           // this.lotOptions = null;
           // return;
       //  }

        // remove previous selection in the Buildings Combobox when building change event is fired
         this.template.querySelectorAll(".example").forEach(each => {
            each.value = undefined;
       });
      


            getBuildings({
                projId: this.projectId
            })
            .then(data => {
                if (data){
                    this.buildingOptions = [{value:'', label:'None'}];
                    data.forEach(element => {
                        
                        const builds = {};
                        builds.label = element.Name;
                        builds.value = element.Id;
                        this.buildingOptions.push(builds);
                    });

                    console.log(this.buildingOptions);
                }
    
                
      
            })
            .catch(error => {
                this.showToast('ERROR', error.body.message, 'error');
            });

            //publish(this.messageContext, XPROPPUBAPPMC, { projectId : this.projectId });

           
    }

    handleBuildingChange(event){
        
        this.buildingId = event.detail.value;
        console.log("Building Id is:" + this.buildingId);

        this.lotId = ''; // setting lotId to empty as header should display content only when lot is selected.
        this.sendMessageService();
        

        const selectedEvent = new CustomEvent("capturebuildinginfo", {
            detail: {
                buildingChanged: 'true'
            },
            bubbles: true
            
          });
          
          // Dispatches the event.
          this.dispatchEvent(selectedEvent);

          

        // remove previous selection in the Lots Combobox when building change event is fired
        this.template.querySelectorAll(".exampleext").forEach(each => {
            each.value = undefined;
       });

       

            getLots({
                buildId: this.buildingId
            })
            .then(data => {
                if (data){
                    this.lotOptions = [{value:'', label:'None'}];
                    data.forEach(element => {
                        
                        const lots = {};
                        lots.label = element.Name;
                        lots.value = element.Id;
                        this.lotOptions.push(lots);
                    });

                    console.log(this.lotOptions);
                }
    
                
      
            })
            .catch(error => {
                this.showToast('ERROR', error.body.message, 'error');
            });

            //publish(this.messageContext, XPROPPUBAPPMC, { buildingId : this.buildingId });
            
       
    }


    handleLotChange(event){
       
        this.lotId = event.detail.value;
       console.log(this.lotId);

        // get label of the selected value from the Lot combobox
        var currentLabel = this.lotOptions.filter(option => {
            return option.value == this.lotId;
         });

         this.lotName = currentLabel[0].label;

        console.log("Lot Id is:" + this.lotId);
        console.log("Lot Name is:" + this.lotName);

       /* if (this.lotName === 'None'){
            this.showSalesView = false;
            }else{
                this.showSalesView = true;
            }*/

             // publish the message to the LMS channel
             this.sendMessageService();
             //publish(this.messageContext, XPROPPUBAPPMC, { buildingId : this.buildingId  });

            const selectedEvent = new CustomEvent("capturelotinfo", {
                detail: {
                    lotId: this.lotId,
                    lotName: this.lotName
                },
                bubbles: true
                
              });
               // Dispatches the event.
               this.dispatchEvent(selectedEvent);
            

             

    }


    sendMessageService() {

   
        
        publish(this.messageContext, XPROPPUBAPPMC, { projectId : this.projectId, buildingId : this.buildingId, lotId : this.lotId, lotName : this.lotName });
        
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