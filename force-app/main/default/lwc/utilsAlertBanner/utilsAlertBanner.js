import { LightningElement, api } from "lwc";
import ERROR_ICON from '@salesforce/resourceUrl/ERROR_ICON';

export default class UtilsAlertBanner extends LightningElement {
  @api alertMessage;

  @api
  get svgURL() {
    return ERROR_ICON;
}
}