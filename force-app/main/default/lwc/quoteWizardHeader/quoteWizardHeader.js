import { LightningElement,api } from 'lwc';
import HeaderImage from '@salesforce/resourceUrl/HeaderImage';

export default class QuoteWizardHeader extends LightningElement {

    @api
    get headerURL() {
      return HeaderImage;
    }


}