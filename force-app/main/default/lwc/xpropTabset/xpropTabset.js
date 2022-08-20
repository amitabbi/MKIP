import { LightningElement,wire,api,track } from 'lwc';


export default class XpropTabset extends LightningElement {
    
    @api lotId;
    @api lotName;
    @api projectChanged;
    @api buildingChanged;
    @api projectId;
    @api projectName;
    showSalesView = false;
    showOppsView = false;
    showActView = false;
    showServContractView = false;
    showServVariationsView = false;
    showAgentCommissionView = false;
    showAgentCompletionView = false;
    showPrelimInspectView = false;
    showManagementView = false;
    showFinalInspectView = false;
    showServiceManagementView = false;
    showAppointmentView = false;

    captureLotInfo(event){
        this.lotId = event.detail.lotId;
        this.lotName = event.detail.lotName;
        console.log("Master Component" + this.lotId);
        console.log("Master Component" + this.lotName);
        if (this.lotId){
            this.showManagementView = true;
            this.showSalesView = true;
            this.showOppsView = true;
            this.showActView = true;
            this.showServContractView = true;
            this.showServVariationsView = true;
            this.showAgentCommissionView = true;
            this.showAgentCompletionView = true;
            this.showPrelimInspectView = true;
            this.showFinalInspectView = true;
            this.showServiceManagementView = true;
            this.showAppointmentView = true;
        }
        
        
    }

    captureProjectInfo(event){
        this.projectChanged = event.detail.projectChanged;
        this.projectId = event.detail.projectId;
        this.projectName = event.detail.projectName;
        console.log("Master Component" + this.projectChanged);
        if (this.projectChanged){
            this.showManagementView = false;
            this.showSalesView = false;
            this.showOppsView = false;
            this.showActView = false;
            this.showServContractView = false;
            this.showServVariationsView = false;
            this.showAgentCommissionView = false;
            this.showAgentCompletionView = false;
            this.showPrelimInspectView = false;
            this.showFinalInspectView = false;
            this.showServiceManagementView = false;
            this.showAppointmentView = false;
        }
    }

    captureBuildingInfo(event){
        this.buildingChanged = event.detail.buildingChanged;
        console.log("Master Component" + this.buildingChanged);
        if (this.buildingChanged){
            this.showManagementView = false;
            this.showSalesView = false;
            this.showOppsView = false;
            this.showActView = false;
            this.showServContractView = false;
            this.showServVariationsView = false;
            this.showAgentCommissionView = false;
            this.showAgentCompletionView = false;
            this.showPrelimInspectView = false;
            this.showFinalInspectView = false;
            this.showServiceManagementView = false;
            this.showAppointmentView = false;
        }
    }

  

 

    handleSalesViewActive(event){
        event.preventDefault();
    }
   
}