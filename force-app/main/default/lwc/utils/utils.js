import { ShowToastEvent } from 'lightning/platformShowToastEvent';


function showToast(context,title, message, variant) {
    const evt = new ShowToastEvent({
        title: title,
        message: message,
        variant: variant,
    });
    context.dispatchEvent(evt);
}
export { showToast }