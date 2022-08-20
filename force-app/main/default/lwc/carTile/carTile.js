import { LightningElement,api,wire } from 'lwc';
import { fireEvent } from 'c/pubsub';
import { CurrentPageReference } from 'lightning/navigation';

export default class CarTile extends LightningElement {

    @api car;
    @api carSelectedId;

    @wire(CurrentPageReference) pageRef;

    handleCarSelect(event){
        event.preventDefault();

        const carId = this.car.Id;
        // Creates the event with the data.
        const selectedEvent = new CustomEvent("carselect", {
        detail: carId,
        bubbles: true
        
      });
      
      // Dispatches the event.
      this.dispatchEvent(selectedEvent);
      fireEvent(this.pageRef, 'carselect', this.car);

    }

    get isCarSelected(){
        if (this.car.Id === this.carSelectedId){
            return "tile selected";
        }
        return "tile";
    }

}