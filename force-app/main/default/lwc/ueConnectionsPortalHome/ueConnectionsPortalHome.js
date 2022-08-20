import { LightningElement } from 'lwc';

export default class UeConnectionsPortalHome extends LightningElement {

    newConURL;

    confirmClickHandler(event){
        //event.preventDefault();
        this.newConURL = 'https://amitabbikip-dev-ed.lightning.force.com/flow/UE_EstablishSupply';
    }


}