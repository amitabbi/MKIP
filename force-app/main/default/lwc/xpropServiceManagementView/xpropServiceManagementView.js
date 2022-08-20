import {
    LightningElement,
    api,
    wire
} from 'lwc';
import getLotCases from '@salesforce/apex/GetXPropTabData.getLotCases';
import {
    ShowToastEvent
} from "lightning/platformShowToastEvent";
import {
    NavigationMixin
} from "lightning/navigation";
import {
    refreshApex
} from '@salesforce/apex';

export default class XpropServiceManagementView extends NavigationMixin(LightningElement) {

    @api lotId;
    @api lotName;
    lotCases = [];
    _wiredRecord;



    @wire(getLotCases, {
        lotId: '$lotId'
    })
    wiredLotCases(result) {
        this._wiredRecord = result;
        if (result.data) {

            this.columns = [{
                    label: "CaseNumber",
                    fieldName: "CaseNumber"
                },
                {
                    label: "Subject",
                    fieldName: "Subject"
                },
                {
                    label: "Status",
                    fieldName: "Status"
                },
                {
                    label: "Priority",
                    fieldName: "Priority"
                },
                {
                    type: 'button',
                    initialWidth: 200,
                    label: 'Edit Case',
                    typeAttributes: {
                        iconName: 'action:preview',
                        label: 'Edit Case',
                        name: 'editCaseRecord',
                        title: 'editCaseRecord',
                        disabled: false,
                        value: 'test'
                    },
                },
                {
                    type: 'button',
                    initialWidth: 200,
                    label: 'View Full Case',
                    typeAttributes: {
                        iconName: 'action:preview',
                        label: 'Navigate to Case',
                        name: 'viewFullCaseRecord',
                        title: 'viewFullCaseRecord',
                        disabled: false,
                        value: 'test'
                    },
                },

            ];

            this.lotCases = result.data;

        }
        //else if(error){
        else if (result.error) {
            this.showToast('ERROR', result.error.body.message, 'error');
        }
    }

    get showLotCases() {
        if (this.lotCases.length > 0 && this.lotId.length > 0) {
            return true;
        }
        return false;
    }

    refreshHandler() {
        return refreshApex(this._wiredRecord);
    }

    handleRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;
        console.log("Row Id is:" + row.Id);
        switch (actionName) {
            case "editCaseRecord":
                this.navigateToEditPage(row);
                break;
            case 'viewFullCaseRecord':
                this.navigateToCasePage(row);
                break;
            default:
        }
    }

    navigateToCasePage(row) {
        console.log(row);
        this[NavigationMixin.GenerateUrl]({
            type: 'standard__webPage',
            attributes: {
                url: 'https://amitabbikip-dev-ed.lightning.force.com/lightning/r/Case/' + row.Id + '/view'
            }
        }).then(generatedUrl => {
            window.open(generatedUrl);
        });

    }

    navigateToEditPage(row) {
        console.log(row);
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