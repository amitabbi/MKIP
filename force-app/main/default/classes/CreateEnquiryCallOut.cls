global with sharing class CreateEnquiryCallOut {
    
    @AuraEnabled
   
    global static void CreateEnquiryCallOut(String enqName) {

        Http http = new Http();
HttpRequest request = new HttpRequest();
request.setEndpoint('https://amitabbikip-dev-ed.lightning.force.com/services/data/v48.0/sobjects/Enquiry__c');
request.setMethod('POST');
request.setHeader('Content-Type', 'application/json;charset=UTF-8');
// Set the body as a JSON object
request.setBody('{"Name":enqName}');
HttpResponse response = http.send(request);

//return response;
    }
}