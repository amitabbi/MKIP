import { LightningElement,wire ,api} from 'lwc';
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import getScVariations from '@salesforce/apex/GetXPropTabData.getScVariations';
import getScVariationLineItems from '@salesforce/apex/GetXPropTabData.getScVariationLineItems';
import {
    NavigationMixin
} from "lightning/navigation";
const varactions = [
    { label: "Edit", name: "edit" }
  ];

const voliactions = [
    { label: "Edit", name: "edit" }
  ];


export default class XpropVariations extends NavigationMixin(LightningElement) {

    showFileUpload;
    scVariations = [];
    scVariationLineItems = [];
    @api lotId;
    @api lotName;
    columns;
    volicolumns;
    showScVars = false;
    showScVOLI;

  


    @wire(getScVariations, {
        lotId: '$lotId'
    })
    wiredScVars({
        data,
        error
    }) {
        if (data) {
            console.log("Lot Id in Opportunities tab is:" + this.lotId);


            this.columns = [
            { label: "Name", fieldName: "Name" },
            {
                type: 'button',
                initialWidth: 200,
                typeAttributes: {
            iconName: 'action:preview',
            label: 'View Line Items', 
            name: 'viewLineItemRecords', 
            title: 'viewLineItemRecordsTitle', 
            disabled: false, 
            value: 'test'
            },
            },
            {
              type: "action",
              typeAttributes: { rowActions: varactions }
            }
          
          ];

         

            this.showScVars = true;
            this.scVariations = data;
            //console.log('SC Variations Content is: ' + JSON.stringify(this.scVariations));
            //console.log('SC Variations Length is: ' + JSON.stringify(this.scVariations.length));
            

        } else if (error) {
            this.showToast('ERROR', error.body.message, 'error');
        }else{
            this.showScVars = false;
        }
    }


    /*get showScVars() {
        if (this.scVariations.length > 0) {
            return true;
        }
        return false;
    }*/

    handleRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;
        console.log("Row Id is:" + row.Id);
        switch (actionName) {
            case "edit":
                this.navigateToEditPage(row);
                break;
            case 'viewLineItemRecords':
                this.showVariationLineItems(row);
                break;
            default:
        }
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

    showVariationLineItems(row){
    console.log("Row Id is" + row.Id);
        getScVariationLineItems({
            variationId: row.Id
        })
        .then(data1 => {
            this.volicolumns = [
                { label: "Subject", fieldName: "Subject__c" },
                {
                    type: "action",
                    typeAttributes: { rowActions: voliactions }
                  }

            ];
            this.showScVOLI = true;
            this.scVariationLineItems = data1;
           
            console.log("Variation Line Items Result is :" + JSON.stringify(this.scVariationLineItems));
  
        })
        .catch(error => {
            this.error = error;
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