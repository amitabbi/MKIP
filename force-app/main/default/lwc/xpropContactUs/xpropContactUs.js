import {
    LightningElement,
    track,
    wire,
    api
} from 'lwc';

export default class XpropContactUs extends LightningElement {

    zoomLevel = 15;
    @track mapMarkers = [];
    showSuccess = false;

    connectedCallback() {
        this.mapMarkers = [{
            location: {
                Latitude: '-37.814561',
                Longitude: '144.946579'
            }
        }];
    }

    handleSuccess(event) {
        console.log('onsuccess event recordEditForm', event.detail.id)
        this.showSuccess = true;

        const inputFields = this.template.querySelectorAll(
            'lightning-input-field'
        );
        if (inputFields) {
            inputFields.forEach(field => {
                field.reset();
            });
        }

    }
    handleSubmit(event) {
        console.log('onsubmit event recordEditForm' + event.detail.fields);
    }

    handleReset() {
        const inputFields = this.template.querySelectorAll(
            'lightning-input-field'
        );
        if (inputFields) {
            inputFields.forEach(field => {
                field.reset();
            });
        }
    }

}