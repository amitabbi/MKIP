import { LightningElement,api,wire } from 'lwc';

export default class XpropAssignmentMaster extends LightningElement {

    @api lotId;
    @api lotName;
    @api projectChanged;
    @api buildingChanged;
    @api projectId;
    @api projectName;
    showAssignmentResultsView = false;


    captureLotInfo(event){
        this.lotId = event.detail.lotId;
        this.lotName = event.detail.lotName;
        console.log("Assignment Master Component" + this.lotId);
        console.log("Assignment Master Component" + this.lotName);
        if (this.lotId){
            this.showAssignmentResultsView = true;
        }
        
        
    }

    captureProjectInfo(event){
        this.projectChanged = event.detail.projectChanged;
        this.projectId = event.detail.projectId;
        this.projectName = event.detail.projectName;
        console.log("Assignment Master Component" + this.projectChanged);
        if (this.projectChanged){
            this.showAssignmentResultsView = false;
        }
    }

    captureBuildingInfo(event){
        this.buildingChanged = event.detail.buildingChanged;
        console.log("Assignment Master Component" + this.buildingChanged);
        if (this.buildingChanged){
            this.showAssignmentResultsView = false;
        }
    }

  

 

}