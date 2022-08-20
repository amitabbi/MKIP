import { LightningElement, api,track } from 'lwc';
export default class GetAccountListWithFlow extends LightningElement {
@api records = [];
@api fieldColumns = [
{ label: 'Name', fieldName: 'Name' },
{ label: 'Title', fieldName: 'Title'},
{ label: 'Department', fieldName: 'Department' }
];
}