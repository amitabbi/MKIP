import {
    LightningElement,
    api,
    track,
    wire
} from 'lwc';
import getAgentsBySelectedProject from "@salesforce/apex/GetXPropTabData.getAgentsBySelectedProject";
import fetchTimeSlots from "@salesforce/apex/GetXPropTabData.fetchTimeSlots";
import createBookAppEvent from "@salesforce/apex/GetXPropTabData.createBookAppEvent";
import {
    ShowToastEvent
} from "lightning/platformShowToastEvent";
import Thumbnail_IMG__c from '@salesforce/schema/Property__c.Thumbnail_IMG__c';
import moment from '@salesforce/resourceUrl/moment';
import { loadScript } from 'lightning/platformResourceLoader';
import {
    NavigationMixin
} from "lightning/navigation";
import ThirdSic from '@salesforce/schema/DandBCompany.ThirdSic';

export default class XpropBookAppointment extends NavigationMixin(LightningElement) {

    @track filterdTimeSlots = [];
    @api selectedProjectId;
    @api leadId;
    projectagents;
    showAvail = false;
    showAgentCards = false;
    activeAccord = "A";
    selectedAgentId;
    dateOptions = [{}];
    selectedDate;
    selectedTimeSlot;
    showTimeSlotConfirm = false;
    showAvailTimeSlots = false;
    isLoading;
    showConfirm = false;
    isWeekend = false;
    eSubject;
    eStartDateTime;
    eEndDateTime;
    eDescription;
    eStartDate;
    selectedTimeSlotTimeVal;
    isDateInPast = false;
    isNotWeekend = false;


    @track timeOptions;

    @track timeOptionsPre = [];
    @track timeFinalOptions = [];
    selectedDate;

    @wire(getAgentsBySelectedProject, {
        projectId: '$selectedProjectId'
    })
    wiredProjectAgents({
        data,
        error
    }) {
        if (data) {
            this.projectagents = data;
        } else if (error) {
            this.showToast('ERROR', error.body.message, 'error');
        }
    }

    showAvailClickHandler(event) {
        this.isLoading = true;
        event.preventDefault();
        const selectedAgent = event.target.id;
        this.selectedAgentId = selectedAgent.substring(0, 18);
        console.log("selectedAgentId" + this.selectedAgentId);
        this.activeAccord = "B";

        this.showAvailTimeSlots = false;
        this.showTimeSlotConfirm = false;

        //this.showDates();
        this.showAvail = true;
        this.isLoading = false;
    }

    renderedCallback(){
        Promise.all([
            loadScript(this, moment + '/moment.js')
        ]).then(() => {
            //Hey this works!
            //moment() prints out stuff here in the render callback!
            //debugger;
        })
        .catch(error => {
            //debugger;
        });
    }

    showDates() {
        this.showAvail = true;





        this.dateOptions = [{
            value: '',
            label: 'Select a date'
        }];

        var d = new Date();
        var month = d.getMonth() + 1;
        var year = d.getFullYear();
        var day = d.getDate();
        for (var i = 1; i < 7; i++) {
            const dates = {};
            console.log(day);
            if (d.getDay() + 1 != 6 || d.getDay() + 1 != 0) {
                dates.label = day + i + '/' + `${month}` + '/' + `${year}`;
                dates.value = day + i + '/' + `${month}` + '/' + `${year}`;


                this.dateOptions.push(dates);
            }
        }
    }

    showAvailability() {

        this.isLoading = true;

        /*for (var z = 9; z < 17; z++) {
            const tm = [z];
            this.timeOptions.push(tm);
            
        }*/
        //this.showAvailTimeSlots = true;
        console.log("this.timeOptions" + this.timeOptions);
        console.log("Is timeOptions as array" + Array.isArray(this.timeOptions));



        //dates.value = element.Id;



        fetchTimeSlots({
                agentId: this.selectedAgentId,
                actDate: this.selectedDate
            })
            .then(result => {
                //this._wiredActivities = result;
                /*this.columns = [
                    {
                        label: "Owner",
                        fieldName: "OwnerId",
                        id: 'OwnerId'
                    },
                    {
                        label: "Start Time",
                        fieldName: "StartDateTime"
                    },
                    {
                        label: "Status",
                        fieldName: "ShowAs"
                    },
                    {
                        type: 'button',
                        initialWidth: 200,
                        label: 'Book',
                        typeAttributes: {
                            iconName: 'action:preview',
                            label: 'Book',
                            name: 'createBooking',
                            title: 'createBooking',
                            disabled: false,
                            value: 'test'
                        },
                    },
                    ];*/

                this.timeOptions = [{
                        Id: 9,
                        Slot: 'T22:00:00.000Z',
                        Name: '9:00 am',
                    },
                    {
                        Id: 10,
                        Slot: 'T23:00:00.000Z',
                        Name: '10:00 am',
                    },
                    {
                        Id: 11,
                        Slot: 'T00:00:00.000Z',
                        Name: '11:00 am',
                    },
                    {
                        Id: 12,
                        Slot: 'T01:00:00.000Z',
                        Name: '12:00 pm',
                    },
                    {
                        Id: 13,
                        Slot: 'T02:00:00.000Z',
                        Name: '13:00 pm',
                    },
                    {
                        Id: 14,
                        Slot: 'T03:00:00.000Z',
                        Name: '14:00 pm',
                    },
                    {
                        Id: 15,
                        Slot: 'T04:00:00.000Z',
                        Name: '15:00 pm',
                    },
                    {
                        Id: 16,
                        Slot: 'T05:00:00.000Z',
                        Name: '16:00 pm',
                    },
                ];






                this.filterdTimeSlots = result;

                console.log("this.filterdTimeSlots length" + this.filterdTimeSlots.length);
                if (this.filterdTimeSlots.length > 0) {
                    for (var k = 0; k < this.filterdTimeSlots.length; k++) {
                        //console.log("this.filterdTimeSlots" + this.filterdTimeSlots[k]);
                        this.timeOptionsPre.push(this.filterdTimeSlots[k]);


                    }
                    console.log("this.timeOptionsPre" + this.timeOptionsPre);
                    console.log("Is timeOptionsPre as array" + Array.isArray(this.timeOptionsPre));


                    for (var x = 0; x < this.timeOptionsPre.length; x++) {
                        this.timeOptions = this.timeOptions.filter(value => !this.timeOptionsPre.includes(value.Id));
                    }
                    console.log("this.timeFinalOptions after splice" + this.timeOptions);

                } else {
                    this.timeOptions = this.timeOptions;
                }

                this.disptachShowAvailabilityEvent();
                this.isLoading = false;
                /*for (var x = 0; x < this.timeOptionsPre.length; x++) { 
                    const index = this.timeOptions.indexOf(this.timeOptions[p]);
                    console.log("index is " + index);
                    if (index > -1) {
                        this.timeOptions.splice(index, 1);
                    }
                }*/

                //for (var x = 0; x < this.timeOptionsPre.length; x++) { 
                //for (var p = 0; p < this.timeOptionsPre.length; p++) { 

                //this.timeOptions.forEach(item,index =>{
                // console.log("element index is " + index);
                //})

                //if (index > -1) {
                //this.timeOptions.splice(index, 1);
                //}
                //}
                //}









                /*var filteredArray = this.timeOptions.filter(function(item) {
                    return item !== this.timeOptionsPre[p]
                })
            
                  console.log("filteredArray" + filteredArray);
            }*/


                //var filteredArray = this.timeOptions.filter(item => !this.timeOptionsPre.includes(item))



                //for (var k = 0; k < this.filterdTimeSlots.length; k++) { 
                //console.log(this.filterdTimeSlots[k]);
                //this.timeOptions.remove(this.filterdTimeSlots[k]);
                //this.timeOptions.push(timeOptionsPre);
                //}





                //for (var k = 0; k < this.filterdTimeSlots.length; k++) { 
                //this.timeOptionsPre.remove(k);

                //}






                //console.log("Additional Contacts Result is :" + JSON.stringify(this.filterdTimeSlots));

            })
            .catch(error => {
                this.error = error;
            });




        //this.timeOptions.push(timeOptionsPre);
        // }

        // var filteredArray  = this.timeOptions.filter(item => !this.filterdTimeSlots.includes(item))

        /* for (var k = 0; k < this.filterdTimeSlots.length; k++) { 
              var filteredArray = this.timeOptions.filter(post => {
                  return !this.filterdTimeSlots[k].includes(post)
                })
                console.log(filteredArray);
              }*/



    }


    handleDateChange(event) {
        this.selectedTimeSlot = '';


        const selectedDate = event.target.value;
        this.eStartDate = selectedDate;

        var givenDate = new Date(selectedDate);
        var currentDay = givenDate.getDay();

     

        // check if date falls on a weekend
        var dateIsInWeekend = (currentDay === 6) || (currentDay === 0);
        if (dateIsInWeekend == true) {
            console.log("The given date " + givenDate + " is a Weekend");
            this.showAvailTimeSlots = false;
            this.isDateInPast = false;
            this.isWeekend = true;
            this.isNotWeekend = false;
        } else {
            console.log("The given date " + givenDate + "is a not a Weekend");
            this.showAvailTimeSlots = true;
            this.isNotWeekend = true;
            this.isWeekend = false;
            this.isDateInPast = false;
        }

           // check if date falls in the past
           var today = new Date();
           if (givenDate < today){
               this.showAvailTimeSlots = false;
               this.isWeekend = false;
               this.isNotWeekend = false;
               this.isDateInPast = true;
           }

        



        const selectedYear = selectedDate.substring(0, 4);
        const selectedMonth = selectedDate.substring(5, 7);
        const selectedDay = selectedDate.substring(8, 10);
        this.selectedDate = selectedDay + '/' + selectedMonth + '/' + selectedYear;
        console.log("this.selectedDate" + this.selectedDate);
        this.showAvailability();

        //if(myDate.getDay() == 6 || myDate.getDay() == 0) alert('Weekend!');




    }

    handleToggleSection(event) {
        this.activeAccord = event.detail.openSections;
    }

    timeSlotClickHandler(event) {
        event.preventDefault();

        if (this.isWeekend === false || this.isDateInPast === false){
            this.showTimeSlotConfirm = true;
        }
        const selectedTimeSlotVal = event.target.name;
        
        this.selectedTimeSlot = selectedTimeSlotVal.substring(0, 8);
        console.log("this.selectedTimeSlot" + this.selectedTimeSlot);
        const selectedTimeSlotTime = event.target.id;
        this.selectedTimeSlotTimeVal = selectedTimeSlotTime.substring(0, 14);
    }

    confirmClickHandler(event) {
        event.preventDefault();
        this.createEvent();
    }

    createEvent(){

        if (this.isWeekend === true || this.isDateInPast === true){
            return;
        }
        this.isLoading = true;
        this.eSubject = 'Web appointment';
        this.eStartDateTime = this.eStartDate + this.selectedTimeSlotTimeVal;
        console.log("this.eStartDateTime" + this.eStartDateTime);
        console.log(" this.leadId" +  this.leadId);

        createBookAppEvent({

            eSubject: this.eSubject,
            eStartDateTime: this.eStartDateTime,
            eDuration: 60,
            selectedLeadId: this.leadId

        })
        .then(result => {
            this.isLoading = false;
            this.disptachConfirmAppEvent();
            this.showConfirm = true;
            

        })
        .catch(error => {
            this.showToast('ERROR', error.body.message, 'error');
            this.isLoading = false;
        });
        


    }

    backConfirmPageClickHandler(){
        event.preventDefault();
        this.navigateToPropertyProfilesPage();
    }

    disptachConfirmAppEvent(){
        const selectedEvent = new CustomEvent("captureconfirmappbutton", {
            detail: {
                confirmAppButtonClicked: 'true'
            },
            bubbles: true
            
          });
        // Dispatches the event.
        this.dispatchEvent(selectedEvent);
    
        }


    backClickHandler(event) {
        event.preventDefault();
        this.isLoading = true;
        const selectedEvent = new CustomEvent("capturebackbutton", {
            detail: {
                backButtonClicked: 'true'
            },
            bubbles: true

        });

        // Dispatches the event.
        this.dispatchEvent(selectedEvent);
        this.isLoading = false;

    }

    disptachShowAvailabilityEvent() {
        const selectedEvent = new CustomEvent("captureshowavailbutton", {
            detail: {
                showAvailButtonClicked: 'true'
            },
            bubbles: true

        });

        // Dispatches the event.
        this.dispatchEvent(selectedEvent);
    }

    navigateToPropertyProfilesPage() {
        this[NavigationMixin.Navigate]({
            type: 'standard__navItemPage',
            attributes: {
                apiName: 'Property_Development_Management_Info'
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