import { LightningElement,wire,api,track } from 'lwc';
import getAssignedAgents from "@salesforce/apex/GetXPropTabData.getAssignedAgents";
import getAgentLeads from "@salesforce/apex/GetXPropTabData.getAgentLeads";
import getAgentOpportunities from "@salesforce/apex/GetXPropTabData.getAgentOpportunities";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { NavigationMixin } from "lightning/navigation";
import USER_ID from '@salesforce/user/Id';

const actions = [
    { label: "View", name: "view" },
    { label: "Edit", name: "edit" }
  ];

export default class XpropSales extends NavigationMixin(LightningElement) {

    @api lotId;
    @api lotName;
    @track agents = [];
    error;
    agentpic = [];
    agentLeads = [];
    agentOpportunities = [];

    @wire(getAssignedAgents,{lotId: '$lotId'})
    wiredAgents({data,error}){
        if(data){
            console.log("Lot Id in Sales tab is:" + this.lotId);

            //if (Object.keys(data).length === 0){
                this.agentLeads = [];
                this.agentOpportunities = [];
                //return;
           // }


            this.agents = data;
            console.log(JSON.stringify(this.agents));

           
           
        }
        else if(error){
            this.showToast('ERROR', error.body.message, 'error');
        }
    }
    

    get agentsFound(){
        console.log("Length is:" + Object.keys(this.agents).length);
        if (Object.keys(this.agents).length > 0 && this.lotId.length > 0){
            //if (this.lotOpportunities && this.lotId.length > 0){
            //if (this.agents){
            return true;
        }
        return false;
    }

    handleAgentSelect(event){
        event.preventDefault();
    }

    showAgentDetHandler(event){

        const agentRecId = event.currentTarget.id;
        var agentId = agentRecId.substring(0,18);
        console.log(agentId);
        console.log(this.lotId);
        getAgentLeads({
            agentId: agentId,
            lotId: this.lotId
        })
        .then(data => {

          


            this.leadcolumns = [
                { label: "Name", fieldName: "Name" },
                { label: "Lead Source", fieldName: "LeadSource" },
                { label: "Lead Status", fieldName: "Status" },
                {
                    type: "action",
                    typeAttributes: { rowActions: actions }
                  }

            ];

           
    

            this.agentLeads = data;
           
           
            console.log("Agent Leads Result is :" + JSON.stringify(this.agentLeads));
  
        })
        .catch(error => {
            this.error = error;
        });


        getAgentOpportunities({
            agentId: agentId,
            lotId: this.lotId
        })
        .then(data1 => {

           

            this.oppcolumns = [
                { label: "Name", fieldName: "Name" },
                { label: "Close Date", fieldName: "CloseDate" },
                { label: "Stage Name", fieldName: "StageName" },
                {
                    type: "action",
                    typeAttributes: { rowActions: actions }
                  }

            ];

            this.agentOpportunities = data1;
           
            console.log("Agent Opportunity Result is :" + JSON.stringify(this.agentLeads));
  
        })
        .catch(error => {
            this.error = error;
        });



    }

    handleRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;
        console.log("Row Id is:" + row.Id);
        switch (actionName) {
          case "view":
            this.navigateToViewPage(row);
            break;
          case "edit":
            this.navigateToEditPage(row);
            break;
          default:
        }
      }

      navigateToViewPage(row) {
        console.log(row);
        this[NavigationMixin.Navigate]({
          type: "standard__recordPage",
          attributes: {
            recordId: row.Id,
            actionName: "view"
          }
        });
      }
    
      navigateToEditPage(row) {
        this[NavigationMixin.Navigate]({
          type: "standard__recordPage",
          attributes: {
            recordId: row.Id,
            actionName: "edit"
          }
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