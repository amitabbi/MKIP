import { LightningElement,wire,track,api } from 'lwc';

export default class XpropMasterPropertyProfile extends LightningElement {

    showAppBookPI = false;
    showAppBook = false;
    showPropertyProfiles = true;
    selectedProjectId;
    progVal;
    leadId;

    capturebackbutton(event){
        const backButton = event.detail.backButtonClicked;
        if (backButton === 'true'){
            this.showAppBook = false;
            this.showAppBookPI = false;
            this.showPropertyProfiles = true;
        }
        }

        capturebookappbutton(event){
            const bookAppButton = event.detail.bookAppButtonClicked;
            const selectedProjId = event.detail.selectedProjectId;
            this.selectedProjectId = selectedProjId.substring(0, 18);
            console.log("this.selectedProjectId " + this.selectedProjectId );
            if (bookAppButton === 'true'){
                this.showPropertyProfiles = false;
                this.showAppBookPI = true;
                this.progVal = 0;
            }
            }

            captureproceedbutton(event){

                const proceedButton = event.detail.proceedButtonClicked;
                this.leadId = event.detail.leadId;
                //this.leadId = leadIdVal.substring(0, 18);
                console.log("this.leadId " + this.leadId );
                if (proceedButton === 'true'){
                    this.showAppBookPI = false;
                    this.showAppBook = true;
                    this.progVal = 50;
                }

            }

            captureshowavailbutton(event){
                const showAvailButton = event.detail.showAvailButtonClicked;
                if (showAvailButton === 'true'){
                    this.progVal = 80;
                }
            }

            captureconfirmappbutton(event){
                const confirmAppButton = event.detail.confirmAppButtonClicked;
                if (confirmAppButton === 'true'){
                    this.progVal = 100;
                }
            }
}