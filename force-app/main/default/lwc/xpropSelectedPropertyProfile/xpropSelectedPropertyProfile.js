import { LightningElement,wire,api,track } from 'lwc';
import getSelectedProject from '@salesforce/apex/GetXPropTabData.getSelectedProject';
import { ShowToastEvent } from "lightning/platformShowToastEvent";

export default class XpropSelectedPropertyProfile extends LightningElement {
    
    selectedProject;
    @api selectedProjectId;
    
    
    @wire(getSelectedProject,{projectId: '$selectedProjectId'})
    wiredProject({data,error}){
        if(data){

            this.selectedProject = data.Project_Picture__c;
        }
        else if(error){
            this.showToast('ERROR', error.body.message, 'error');
        }
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