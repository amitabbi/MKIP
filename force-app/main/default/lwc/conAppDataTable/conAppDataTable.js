import { LightningElement, wire, api } from "lwc";
import conCases from "@salesforce/apex/GetConRelatedData.getConCaseData";
import conEnqs from "@salesforce/apex/GetConRelatedData.getConEnqData";
import TotalCaseRecords from "@salesforce/apex/GetConRelatedData.TotalCaseRecords";
import TotalEnquiryRecords from "@salesforce/apex/GetConRelatedData.TotalEnquiryRecords";
import getNext from "@salesforce/apex/GetConRelatedData.getNext";
import getPrevious from "@salesforce/apex/GetConRelatedData.getPrevious";
import {
  subscribe,
  unsubscribe,
  APPLICATION_SCOPE,
  MessageContext
} from "lightning/messageService";
import MYMESSAGE from "@salesforce/messageChannel/MyMessageChannel__c";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { NavigationMixin } from "lightning/navigation";

const actions = [
  { label: "View", name: "view" },
  { label: "Edit", name: "edit" }
];

export default class ConAppDataTable extends NavigationMixin(LightningElement) {
  @wire(MessageContext) messageContext;

  subscription = null;
  selectedObj;
  conRecId;
  conFName;
  conLName;
  resetClicked;
  conDetailsButtonClicked;
  conRes = [];
  columns = [];
  flgObjCb = true;
  record = {};
  v_Offset = 0;
  v_TotalCaseRecords;
  v_TotalEnquiryRecords;
  page_size = 4;

  get objOptions() {
    return [
      { label: "Case", value: "Case" },
      { label: "Enquiry", value: "Enquiry__c" }
    ];
  }

  handleObjectChange(event) {
    this.selectedObj = event.detail.value;
    console.log(this.selectedObj);
    this.v_Offset = 0;
    if (this.selectedObj === "Case") {
      conCases({
        conId: this.conRecId,
        v_Offset: this.v_Offset,
        v_pagesize: this.page_size
      })
        .then((result) => {
          console.log("ConectId Inside Case is: " + this.conRecId);
          console.log("Result is: " + result);
          console.log("Result length is: " + Object.keys(result).length);
          if (Object.keys(result).length === 0) {
            console.log("Inside Length 0");
            this.selectedObj = ''; // if records are not found then hide the data table. Let user select an option from the combo box
            return this.showToast("Search Result", "No cases found", "warn");
          }

          this.columns = [
            { label: "Case Number", fieldName: "CaseNumber" },
            { label: "Priority", fieldName: "Priority" },
            { label: "Days Open", fieldName: "Case_Days_Open__c" },
            {
              label: "Status",
              fieldName: "Status",
              type: "text",
              cellAttributes: { class: { fieldName: "caseCSSClass" } }
            },
            { label: "CreatedDate", fieldName: "CreatedDate" },
            {
              type: "action",
              typeAttributes: { rowActions: actions }
            }
          ];

          TotalCaseRecords({ conId: this.conRecId }).then((result1) => {
            this.v_TotalCaseRecords = result1;
          });

          result.forEach((ele) => {
            ele.caseCSSClass =
              ele.Case_Days_Open__c > 1 ? "slds-box slds-theme_error" : "";
          });
          //slds-text-color_error
          this.conRes = result;
          console.log("After formatting label column" + JSON.stringify(result));

          //this.isLoading = false;
        })
        .catch((error) => {
          this.error = error.body.message;
          console.log("Error is: " + this.error);
          //this.isLoading = false;
        });
    }

    if (this.selectedObj === "Enquiry__c") {
      conEnqs({
        conId: this.conRecId,
        v_Offset: this.v_Offset,
        v_pagesize: this.page_size
      })
        .then((result) => {
          console.log("Result is: " + result);
          console.log("Result length is: " + Object.keys(result).length);
          if (Object.keys(result).length === 0) {
            console.log("Inside Length 0");
            this.selectedObj = ''; // if records are not found then hide the data table. Let user select an option from the combo box
            //this.template.querySelector('[name="objectselection"]').value = 'Case';
            return this.showToast(
              "Search Result",
              "No enquiries found",
              "warn"
            );
          }

          this.columns = [
            { label: "Name", fieldName: "name" },
            { label: "Days Open", fieldName: "Days_Open__c" },
            //{ label: "Enquiry Type", fieldName: "Enquiry_Type__c" },
            {
              label: "Enquiry Type",
              fieldName: "Enquiry_Type__c",
              type: "text",
              cellAttributes: { class: { fieldName: "dietCSSClass" } }
            },
            { label: "Created Date", fieldName: "CreatedDate" },
            {
              type: "action",
              typeAttributes: { rowActions: actions }
            }
          ];

          TotalEnquiryRecords({ conId: this.conRecId }).then((result) => {
            this.v_TotalEnquiryRecords = result;
          });

          result.forEach((ele) => {
            ele.dietCSSClass =
              ele.Days_Open__c > 1 && ele.Enquiry_Type__c !== "Cancelled"
                ? "slds-box slds-theme_error"
                : "";
          });
          //slds-text-color_error
          this.conRes = result;
          console.log("After formatting label column" + JSON.stringify(result));

          //this.isLoading = false;
        })
        .catch((error) => {
          this.error = error.body.message;
          console.log("Error is: " + this.error);
          //this.isLoading = false;
        });
    }
  }

  subscribeToMessageChannel() {
    if (this.subscription) {
      return;
    }
    this.subscription = subscribe(
      this.messageContext,
      MYMESSAGE,
      (message) => {
        this.handleMessage(message);
      },
      { scope: APPLICATION_SCOPE }
    );
  }

  handleMessage(message) {
    this.conRecId = message.recordId;
    this.conFName = message.conFName;
    this.conLName = message.conLName;
    this.resetClicked = message.resetClicked;
    this.conDetailsButtonClicked = message.conDetailsButtonClicked;
    console.log("receivedMessage is: " + this.conRecId);
    console.log("receivedMessage is: " + this.conFName);
    console.log("receivedMessage is: " + this.conLName);
    console.log("receivedMessage is: " + this.resetClicked);
    console.log("receivedMessage is: " + this.conDetailsButtonClicked);
    if (this.resetClicked) {
      this.selectedObj = null;
      return (this.flgObjCb = true);
    }
    this.flgObjCb = false;

    if (this.conDetailsButtonClicked) {
      this.selectedObj = null;
    }
  }

  unsubscribeToMessageChannel() {
    unsubscribe(this.subscription);
    this.subscription = null;
  }

  // Standard lifecycle hooks used to subscribe and unsubsubscribe to the message channel
  connectedCallback() {
    this.subscribeToMessageChannel();
  }

  disconnectedCallback() {
    this.unsubscribeToMessageChannel();
  }

  showToast(title, message, variant) {
    const evt = new ShowToastEvent({
      title: title,
      message: message,
      variant: variant
    });
    this.dispatchEvent(evt);
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

  showRowDetails(row) {
    this.record = row;
  }

  handleNext(event) {
    console.log("Inside handleNext");
    console.log(this.v_Offset);
    if (this.selectedObj === "Enquiry__c") {
      getNext({ v_Offset: this.v_Offset, v_pagesize: this.page_size }).then(
        (data) => {
          if (this.v_Offset + 3 < this.v_TotalEnquiryRecords) {
            this.v_Offset = data;
            this.handleObjChange();
          }
        }
      );
    }

    if (this.selectedObj === "Case") {
      getNext({ v_Offset: this.v_Offset, v_pagesize: this.page_size }).then(
        (data) => {
          if (this.v_Offset + 3 < this.v_TotalCaseRecords) {
            this.v_Offset = data;
            this.handleObjChange();
          }
        }
      );
    }

    console.log("Inside getNext");
    console.log(this.v_Offset);
  }

  handlePrevious(event) {
    console.log("Inside handlePrevious");
    console.log(this.page_size);
    getPrevious({ v_Offset: this.v_Offset, v_pagesize: this.page_size }).then(
      (data) => {
        if (data >= 0) {
          this.v_Offset = data;
          this.handleObjChange();
        }
        console.log("Inside getPrevious");
        console.log(this.v_Offset);
      }
    );
  }

  // Required to repeat the logic to make server-side call when Next and Previous buttons are clicked
  handleObjChange() {
    if (this.selectedObj === "Case") {
      conCases({
        conId: this.conRecId,
        v_Offset: this.v_Offset,
        v_pagesize: this.page_size
      })
        .then((result) => {
          console.log("ConectId Inside Case is: " + this.conRecId);
          console.log("Result is: " + result);
          console.log("Result length is: " + Object.keys(result).length);
          if (Object.keys(result).length === 0) {
            console.log("Inside Length 0");
            return this.showToast("Search Result", "No cases found", "warn");
          }

          this.columns = [
            { label: "Case Number", fieldName: "CaseNumber" },
            { label: "Priority", fieldName: "Priority" },
            { label: "Days Open", fieldName: "Case_Days_Open__c" },
            {
              label: "Status",
              fieldName: "Status",
              type: "text",
              cellAttributes: { class: { fieldName: "caseCSSClass" } }
            },
            { label: "CreatedDate", fieldName: "CreatedDate" },
            {
              type: "action",
              typeAttributes: { rowActions: actions }
            }
          ];

          TotalCaseRecords({ conId: this.conRecId }).then((result) => {
            this.v_TotalCaseRecords = result;
          });

          result.forEach((ele) => {
            ele.caseCSSClass =
              ele.Case_Days_Open__c > 1 ? "slds-box slds-theme_error" : "";
          });
          //slds-text-color_error
          this.conRes = result;
          console.log("After formatting label column" + JSON.stringify(result));

          //this.isLoading = false;
        })
        .catch((error) => {
          this.error = error.body.message;
          console.log("Error is: " + this.error);
          //this.isLoading = false;
        });
    }

    if (this.selectedObj === "Enquiry__c") {
      conEnqs({
        conId: this.conRecId,
        v_Offset: this.v_Offset,
        v_pagesize: this.page_size
      })
        .then((result) => {
          console.log("Result is: " + result);
          console.log("Result length is: " + Object.keys(result).length);
          if (Object.keys(result).length === 0) {
            console.log("Inside Length 0");
            return this.showToast(
              "Search Result",
              "No enquiries found",
              "warn"
            );
          }

          this.columns = [
            { label: "Name", fieldName: "name" },
            { label: "Days Open", fieldName: "Days_Open__c" },
            //{ label: "Enquiry Type", fieldName: "Enquiry_Type__c" },
            {
              label: "Enquiry Type",
              fieldName: "Enquiry_Type__c",
              type: "text",
              cellAttributes: { class: { fieldName: "dietCSSClass" } }
            },
            { label: "Created Date", fieldName: "CreatedDate" },
            {
              type: "action",
              typeAttributes: { rowActions: actions }
            }
          ];

          TotalEnquiryRecords({ conId: this.conRecId }).then((result) => {
            this.v_TotalEnquiryRecords = result;
          });

          result.forEach((ele) => {
            ele.dietCSSClass =
              ele.Days_Open__c > 1 && ele.Enquiry_Type__c !== "Cancelled"
                ? "slds-box slds-theme_error"
                : "";
          });
          //slds-text-color_error
          this.conRes = result;
          console.log("After formatting label column" + JSON.stringify(result));

          //this.isLoading = false;
        })
        .catch((error) => {
          this.error = error.body.message;
          console.log("Error is: " + this.error);
          //this.isLoading = false;
        });
    }
  }
}