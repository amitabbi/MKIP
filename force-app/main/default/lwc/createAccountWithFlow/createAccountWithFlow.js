import { LightningElement,api,track } from 'lwc';
import createnewaccount from '@salesforce/apex/CreateNewAccount.CreateNewAccount';
import { FlowAttributeChangeEvent, FlowNavigationNextEvent } from 'lightning/flowSupport';
export default class CreateAccountWithFlow extends LightningElement {
    @track recId;
    @api newAccRecId;
    aName;

    handleTextChange(event){

        if (event.target.name === 'aName'){
        this.aName = event.target.value;
        }

    }

    handleClick(event){
        createnewaccount({aName: this.aName})
        .then(result => {
            this.recId = result;
            console.log('result: ', result);
            console.log("Success");
            //this.newAccRecId.push(result);
            // notify the flow of the new todo list
            console.log('output: ', this.newAccRecId);
            const attributeChangeEvent = new FlowAttributeChangeEvent('newAccRecId', result);
            this.dispatchEvent(attributeChangeEvent);
            
        })
        


        const navigateNextEvent = new FlowNavigationNextEvent();
        this.dispatchEvent(navigateNextEvent);
    }
}