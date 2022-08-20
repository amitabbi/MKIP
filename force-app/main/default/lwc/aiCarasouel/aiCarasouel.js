import { LightningElement,api } from 'lwc';
import ERROR_ICON from '@salesforce/resourceUrl/ERROR_ICON';
import BUILD_SLIDE from '@salesforce/resourceUrl/BUILD_SLIDE';
import IMPL_SLIDE from '@salesforce/resourceUrl/IMPL_SLIDE';

export default class AiCarasouel extends LightningElement {

    @api alertMessage;

  @api
  get svgURL() {
    return ERROR_ICON;
  }

  @api
  get buildSlide() {
    return BUILD_SLIDE;
  }

  @api
  get implSlide() {
    return IMPL_SLIDE;
  }

}