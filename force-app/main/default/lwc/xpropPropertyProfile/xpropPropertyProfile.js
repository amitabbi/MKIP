import { LightningElement,wire,track,api } from 'lwc';
import getProjects from '@salesforce/apex/GetXPropTabData.getProjects';

import { ShowToastEvent } from "lightning/platformShowToastEvent";
import ThirdSic from '@salesforce/schema/DandBCompany.ThirdSic';

export default class XpropPropertyProfile extends LightningElement {

    @track projects = [];
    showAppBook = false;
    zoomLevel = 15;
    @track mapMarkers = [];
    showMap = false;
    showProfiles = true;
    isLoading;

    @wire(getProjects)
    wiredProjects({data,error}){
        if(data){
            this.isLoading = true;
            this.projects = data;
            console.log(JSON.stringify(this.projects));

            /*for (var i=0; i<this.projects.length; i++){
            const Latitude = this.projects[i].Location__Latitude__s;
            const Longitude = this.projects[i].Location__Longitude__s;
            console.log("Latitude" + Latitude);
            console.log("Longitude" + Longitude);
            this.mapMarkers = [{
                location: {
                    Latitude: Latitude,
                    Longitude: Longitude
                }
            }];
            }*/

            /*this.mapMarkers = data.map((project) => {
                return {
                    location: {
                        Latitude: project.Location__Latitude__s,
                        Longitude: project.Location__Longitude__s
                    }
                }
            });*/
            this.isLoading = false;
        }
        else if(error){
            this.showToast('ERROR', error.body.message, 'error');
        }
    }


    

    get projectsFound(){
        console.log("Length is:" + Object.keys(this.projects).length);
        if (Object.keys(this.projects).length > 0){
            //if (this.lotOpportunities && this.lotId.length > 0){
            //if (this.agents){
            return true;
        }
        return false;
    }

    bookAppClickHandler(event){
        event.preventDefault();
        this.isLoading = true;
        const selectedProjectId = event.target.id;

        const selectedEvent = new CustomEvent("capturebookappbutton", {
            detail: {
                bookAppButtonClicked: 'true',
                selectedProjectId: selectedProjectId
            },
            bubbles: true
            
          });
          
          // Dispatches the event.
          this.dispatchEvent(selectedEvent);
          this.isLoading = false;

    }

    mapClickHandler(event){
        event.preventDefault();
        this.isLoading = true;
        const LatitudeVal = event.target.id;
        const Latitude = LatitudeVal.slice(0, -4);
        const Longitude = event.target.name;
        console.log("Latitude" + Latitude);
        console.log("Longitude" + Longitude);
        this.mapMarkers = [{
            location: {
                Latitude: Latitude,
                Longitude: Longitude
            }
        }];
        this.showProfiles = false;
        this.showMap = true;
        this.isLoading = false;
    }

    mapBackClickHandler(event){
        event.preventDefault();
        this.isLoading = true;
        this.showMap = false;
        this.showProfiles = true;
        this.isLoading = false;
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