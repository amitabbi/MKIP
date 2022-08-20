import {
  LightningElement,
  api,
  wire
} from 'lwc';
import {
  loadScript
} from "lightning/platformResourceLoader";
import charts from "@salesforce/resourceUrl/ch";
import getLotStats from "@salesforce/apex/GetXPropTabData.getLotStats";
import getProjectStats from "@salesforce/apex/GetXPropTabData.getProjectStats";
import getProjectLots from "@salesforce/apex/GetXPropTabData.getProjectLots";
import getProjectOppsByStage from "@salesforce/apex/GetXPropTabData.getProjectOppsByStage";
import getProjectLotsByPrice from "@salesforce/apex/GetXPropTabData.getProjectLotsByPrice";
import {
  ShowToastEvent
} from "lightning/platformShowToastEvent";

export default class XpropManagementView extends LightningElement {

  @api lotId;
  @api lotName;
  @api projectId;
  @api projectName;
  projectInfo;
  lotInfo;
  scriptLoaded = false;
  leadCount;
  opportunityCount;
  buildingCount;
  lotCount;
  oppsCount;
  stageName;
  projOppsStageList;
  projLotsPriceList;
  isRendered;
  isLotClicked;
  isProjectClicked;
  showCharts;
  oppValuesOptions = [];
  oppLabelsOptions = [];
  lotsPriceOptions = [];
  lotsPriceDataOptions = [];
  

  @wire(getLotStats, {
    lotId: '$lotId'
  })
  wiredLotManagement({
    data,
    error
  }) {
    if (data) {
      console.log("Lot Id in Management tab is:" + this.lotId);


      console.log("Data in Management tab is: " + JSON.stringify(data));
      this.leadCount = data[0].lCount;
      this.opportunityCount = data[1].oppCount;
      console.log("Lead Count is: " + JSON.stringify(this.leadCount));
      console.log("Opportunity Count is: " + JSON.stringify(this.opportunityCount));

      if (JSON.stringify(this.leadCount) > 0 && this.lotId.length > 0) {
        this.showCharts = true;
      } else {
        this.showCharts = false;
      }

    } else if (error) {
      this.showToast('ERROR', error.body.message, 'error');
    }
  }

  @wire(getProjectStats, {
    projectId: '$projectId'
  })
  wiredProjectManagement({
    data,
    error
  }) {
    if (data) {
      console.log("Project Id in Management tab is:" + this.projectId);


      console.log("Project Data in Management tab is: " + JSON.stringify(data));
      this.buildingCount = data[0].buildCount;


    } else if (error) {
      this.showToast('ERROR', error.body.message, 'error');
    }
  }

  @wire(getProjectLots, {
    projectId: '$projectId'
  })
  wiredProjectLotsManagement({
    data,
    error
  }) {
    if (data) {
      console.log("Project Id in Management tab is:" + this.projectId);


      console.log("Project Data in Management tab is: " + JSON.stringify(data));
      this.lotCount = data[0].lotCount;


    } else if (error) {
      this.showToast('ERROR', error.body.message, 'error');
    }
  }

  @wire(getProjectOppsByStage, {
    projectId: '$projectId'
  })
  wiredProjectOppsByStageManagement({
    data,
    error
  }) {
    if (data) {
      console.log("Project Id in Management tab is:" + this.projectId);


      console.log("Project Opportunity Stage Data in Management tab is: " + JSON.stringify(data));
      //for(let value of data) {
      //this.oppsCount = value.oppsCount;
      //this.stageName = value.StageName;
      //}
      for(let val of data) {
        this.oppValuesOptions.push(val.value);
        this.oppLabelsOptions.push(val.label);
      }

      this.projOppsStageList = data;
      console.log("Project Opportunity Stage Data in Management tab is: " + JSON.stringify(this.projOppsStageList));
    } else if (error) {
      this.showToast('ERROR', error.body.message, 'error');
    }
  }

  @wire(getProjectLotsByPrice, {
    projectId: '$projectId'
  })
  wiredProjectLotsByPriceManagement({
    data,
    error
  }) {
    if (data) {
      console.log("Project Id in Management tab is:" + this.projectId);


      console.log("Project Lots By Price Data in Management tab is: " + JSON.stringify(data));
      //for(let value of data) {
      //this.oppsCount = value.oppsCount;
      //this.stageName = value.StageName;
      //}
      for(let val of data) {
        
        this.lotsPriceDataOptions.push(val.Price__c)
        this.lotsPriceOptions.push(val.Name);
      }
      this.lotsPriceDataOptions.push('100000');

      this.projLotsPriceList = data;
      console.log("Project Lots By Price Data in Management tab is: " + JSON.stringify(this.projLotsPriceList));
    } else if (error) {
      this.showToast('ERROR', error.body.message, 'error');
    }
  }


  manageLotChartHandler(event) {
    event.preventDefault();
    this.loadLotChartScript();
  }

  manageProjectChartHandler(event) {
    event.preventDefault();
    this.loadProjectChartScript();
  }

  manageProjectOppsByStageChartHandler(event) {
    event.preventDefault();
    this.loadProjectOppsByStageChartScript();
  }

  manageProjectLotsByPriceChartHandler(event){
    event.preventDefault();
    this.loadProjectLotsByPriceChartScript();
  }


  loadLotChartScript() {
    // loadScript(){
    // load the script only once
    // Once its loaded, then directly call the methods to draw chart
    if (this.scriptLoaded) {
      this.callDrawLotStatsPieChart();
    } else {
      this.scriptLoaded = true;
      loadScript(this, charts + "/Chart.min.js")
        .then(() => {
          this.callDrawLotStatsPieChart();
        })
        .catch((error) => {
          console.log("Error:", error);
        });
    }
  }

  loadProjectChartScript() {
    // loadScript(){
    // load the script only once
    // Once its loaded, then directly call the methods to draw chart
    if (this.scriptLoaded) {
      this.callDrawProjectStatsPieChart();
    } else {
      this.scriptLoaded = true;
      loadScript(this, charts + "/Chart.min.js")
        .then(() => {
          this.callDrawProjectStatsPieChart();
        })
        .catch((error) => {
          console.log("Error:", error);
        });
    }
  }

  loadProjectOppsByStageChartScript() {
    // loadScript(){
    // load the script only once
    // Once its loaded, then directly call the methods to draw chart
    if (this.scriptLoaded) {
      this.callDrawProjectOppsByStagePieChart();
    } else {
      this.scriptLoaded = true;
      loadScript(this, charts + "/Chart.min.js")
        .then(() => {
          this.callDrawProjectOppsByStagePieChart();
        })
        .catch((error) => {
          console.log("Error:", error);
        });
    }
  }

  loadProjectLotsByPriceChartScript() {
    // loadScript(){
    // load the script only once
    // Once its loaded, then directly call the methods to draw chart
    if (this.scriptLoaded) {
      this.callDrawProjectLotsByPriceBarChart();
    } else {
      this.scriptLoaded = true;
      loadScript(this, charts + "/Chart.min.js")
        .then(() => {
          this.callDrawProjectLotsByPriceBarChart();
        })
        .catch((error) => {
          console.log("Error:", error);
        });
    }
  }

  callDrawLotStatsPieChart() {
    this.drawPieLotStatsChart(
      "a", {
        label1: "Total Leads",
        label2: "Total Opportunities",
        chartLabel: "Management Data"
      },
      "div.chart1"
    );
  }


  drawPieLotStatsChart(value, labels, className) {
    const config = {
      type: "pie",
      data: {
        datasets: [{
          //data: [value.cases, value.deaths, value.recovered],
          data: [this.leadCount, this.opportunityCount],
          backgroundColor: [
            "rgb(0,188,212)",
            "rgb(235,69,89)",
          ],
          label: labels.chartLabel
        }],
        labels: [labels.label1, labels.label2]
      },
      options: {
        responsive: true,
        legend: {
          position: "right"
        },
        animation: {
          animateScale: true,
          animateRotate: true
        },
        title: {
          display: true,
          text: "Statistics for " + ' ' + this.lotName
        }
      }
    };
    this.insertChartToDOM(className, config);
  }

  callDrawProjectStatsPieChart() {
    this.drawPieProjectStatsChart(
      "b", {
        label1: "Total Buildings",
        label2: "Total Lots",
        chartLabel: "Management Data"
      },
      "div.chart2"
    );
  }

  drawPieProjectStatsChart(value, labels, className) {
    const config = {
      type: "pie",
      data: {
        datasets: [{
          //data: [value.cases, value.deaths, value.recovered],
          data: [this.buildingCount, this.lotCount],
          backgroundColor: [
            "rgb(0,188,212)",
            "rgb(235,69,89)"
          ],
          label: labels.chartLabel
        }],
        labels: [labels.label1, labels.label2]
      },
      options: {
        responsive: true,
        legend: {
          position: "right"
        },
        animation: {
          animateScale: true,
          animateRotate: true
        },
        title: {
          display: true,
          text: "Statistics for " + ' ' + this.projectName
        }
      }
    };
    this.insertChartToDOM(className, config);
  }

  callDrawProjectOppsByStagePieChart() {
   // for(let value of this.projOppsStageList) { 
     // for (var i = 0; i <= this.projOppsStageList.length; i++) {
    this.drawPieProjectOppsByStageStatsChart( 
      "b", {     
        chartLabel: "Management Data"
      },
      "div.chart3"
    );
  }

  drawPieProjectOppsByStageStatsChart(value, labels, className) {
    const config = {
      type: "pie",
      data: {
        datasets: [{
          data: this.oppValuesOptions,
          backgroundColor: [
            "rgb(0,188,212)",
          ],
          label: labels.chartLabel
        }],
        labels: this.oppLabelsOptions
      },
      options: {
        responsive: true,
        legend: {
          position: "right"
        },
        animation: {
          animateScale: true,
          animateRotate: true
        },
        title: {
          display: true,
          text: "Statistics for " + ' ' + this.projectName
        }
      }
    };
  
    this.insertChartToDOM(className, config);
  //}
  }

  callDrawProjectLotsByPriceBarChart() {
    // for(let value of this.projOppsStageList) { 
      // for (var i = 0; i <= this.projOppsStageList.length; i++) {
     this.callDrawProjectLotsByPriceStatsChart( 
       "b", {     
         chartLabel: "Management Data"
       },
       "div.chart4"
     );
   }
 
   callDrawProjectLotsByPriceStatsChart(value, labels, className) {
     console.log('this.lotsPriceDataOptions' + this.lotsPriceDataOptions);
     console.log('this.lotsPriceOptions' + this.lotsPriceOptions);
     const config = {
       type: "horizontalBar",
       data: {
         datasets: [{
           data: this.lotsPriceDataOptions,
           backgroundColor: [
            "rgb(0,188,212)"
           ],
         }],
         labels: this.lotsPriceOptions
       },
       options: {
        responsive: true,
        legend: {
          display: false
        },
         animation: {
           animateScale: true,
           animateRotate: true
         },
         title: {
           display: true,
           text: "Statistics for " + ' ' + this.projectName
         }
       }
     };
   
     this.insertChartToDOM(className, config);
   //}
   }



  insertChartToDOM(className, config) {
    const canvas = document.createElement("canvas");
    const chartNode = this.template.querySelector(className);
    // clear the old chart from the DOM
    chartNode.innerHTML = "";
    chartNode.appendChild(canvas);
    const ctx = canvas.getContext("2d");
    this.chart = new window.Chart(ctx, config);
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