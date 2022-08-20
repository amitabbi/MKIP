global with sharing class RequestOCRCheck {
    

    @AuraEnabled
    global static void OCRCallout() {

    Http http = new Http();
    HttpRequest request = new HttpRequest();
    request.setEndpoint('https://th-apex-http-callout.herokuapp.com/animals');
    request.setMethod('POST');
    request.setHeader('Content-Type', 'application/json;charset=UTF-8');
    // Set the body as a JSON object
    request.setBody('{"name":"mighty moose"}');
    HttpResponse response = http.send(request);
    // Parse the JSON response
    if(response.getStatusCode() != 201) {
        System.debug('The status code returned was not expected: ' + response.getStatusCode() + ' ' + response.getStatus());
    } else {
        OCR_Log__c ocr = new OCR_Log__c();
        ocr.Case__c = '5000o00003VgAGAAA3';
        ocr.RequestBody__c = request.getBody();
        ocr.Response_Body__c = response.getBody();
        insert ocr;
        
        System.debug(response.getBody());
    }
}

}