import { LightningElement,api,wire,track } from 'lwc';
import { loadScript, loadStyle } from 'lightning/platformResourceLoader';
import FullCalendarJS from '@salesforce/resourceUrl/FullCalendar';
import { NavigationMixin } from 'lightning/navigation';
import fetchAllEvents from "@salesforce/apex/GetXPropTabData.fetchAllEvents";
import getAssignedAgents from "@salesforce/apex/GetXPropTabData.getAssignedAgents";
import {
    ShowToastEvent
} from "lightning/platformShowToastEvent";
import USER_ID from '@salesforce/user/Id';

export default class XpropAppointmentView extends NavigationMixin(LightningElement) {

    @api lotId;
    @api lotName;
    @track agents = [];
    isLoading;

    fullCalendarJsInitialised = false;
  @track allEvents = [];
  @track selectedEvent = undefined;
  calendar;

  @wire(getAssignedAgents,{lotId: '$lotId'})
  wiredAgents({data,error}){
      if(data){
          console.log("Lot Id in Sales tab is:" + this.lotId);
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

  showAgentCalHandler(event){
      event.preventDefault();
      const agentRecId = event.currentTarget.id;
    var agentId = agentRecId.substring(0,18);
    //this.template.querySelector("div.fullcalendar").remove();
      this.getAllEvents(agentId);

  }


  /**
   * @description Standard lifecyle method 'renderedCallback'
   *              Ensures that the page loads and renders the 
   *              container before doing anything else
   */
  renderedCallback() {

    // Performs this operation only on first render
    if (this.fullCalendarJsInitialised) {
      return;
    }
    this.fullCalendarJsInitialised = true;

    // Executes all loadScript and loadStyle promises
    // and only resolves them once all promises are done
    Promise.all([
        // First step: load FullCalendar core 
        loadStyle(this, FullCalendarJS + '/packages/core/main.css'),
        loadScript(this, FullCalendarJS + '/packages/core/main.js'),
      ])
        .then(() => {
            // Second step: Load the plugins in a new promise
            Promise.all([
              loadStyle(this, FullCalendarJS + '/packages/daygrid/main.css'),
              loadScript(this, FullCalendarJS + '/packages/daygrid/main.js'),
              loadStyle(this, FullCalendarJS + '/packages/timegrid/main.css'),
              loadScript(this, FullCalendarJS + '/packages/timegrid/main.js'),
              loadScript(this, FullCalendarJS + '/packages/interaction/main.js')
        //loadStyle(this, FullCalendarJS + '/fullcalendar.print.min.css')
    ])
    .then(() => {
      // Initialise the calendar configuration
      this.getAllEvents();
     // var Calendar = FullCalendar.Calendar;
      //this.initialiseFullCalendarJs();
    })
})
    .catch(error => {
      // eslint-disable-next-line no-console
      console.error({
        message: 'Error occured on FullCalendarJS',
        error
      });
    })
  }

  /**
   * @description Initialise the calendar configuration
   *              This is where we configure the available options for the calendar.
   *              This is also where we load the Events data.
   */
  initialiseFullCalendarJs() {


    const ele = this.template.querySelector('div.fullcalendar');



      
    this.calendar = new FullCalendar.Calendar(ele, {
        plugins: ['interaction', 'dayGrid', 'timeGrid',],
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        editable : true,
        droppable: false, // this allows things to be dropped onto the calendar
        timeZone: 'UTC',
        selectable: true,
        weekends: false,
        events: this.allEvents,
        eventMouseover: function(event) {
            event.preventDefault();
          },
        eventMouseEnter: function(event) {
            event.preventDefault();
          }
          
       
    });

    
    this.calendar.render();



  }

  getAllEvents(agentId){
    this.isLoading = true;
 

      fetchAllEvents
      ({
        agentId: agentId
    })
 


      .then(result => {
        this.allEvents = result.map(item => {
          return {
            id : item.Id,
            editable : true,
            title : item.Subject,
            start : item.ActivityDate,
            end : item.EndDateTime,
            description : item.Description,
            allDay : false,
            extendedProps : {
              whoId : item.WhoId,
              whatId : item.WhatId
            }
            //backgroundColor: "rgb(" + Math.floor(Math.random() * 256) + "," + Math.floor(Math.random() * 256) + "," + Math.floor(Math.random() * 256) + ")",
            //borderColor: "rgb(" + Math.floor(Math.random() * 256) + "," + Math.floor(Math.random() * 256) + "," + Math.floor(Math.random() * 256) + ")"
          };
        });
        
        // Initialise the calendar configuration
        //this.calendar.render();
        this.initialiseFullCalendarJs();

        this.isLoading = false;
      })
      .catch(error => {
        window.console.log(' Error Occured ', error)
        this.isLoading = false;
      })
      .finally(()=>{
        //this.initialiseFullCalendarJs();
      })
  }

  closeModal(){
    this.selectedEvent = undefined;
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