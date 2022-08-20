@RestResource(urlMapping='/KompFCMDT/*')
global with sharing class KompServ {

    @AuraEnabled(Cacheable=true)
  


    @HttpGet
    global static void getServiceByType() {
        String resBody = ''; 
        RestRequest request = RestContext.request;
        // grab the caseId from the end of the URL
        String serviceType = request.requestURI.substring(
          request.requestURI.lastIndexOf('/')+1);
        List<Komp_Features__mdt> result =  [SELECT MasterLabel
                        FROM Komp_Features__mdt
                        WHERE Service__c = :serviceType];
       //return result;
        
        resBody = JSON.serialize(result);
        RestContext.response.addHeader('Content-Type', 'text/plain');        
        RestContext.response.responseBody = Blob.valueOf(resBody);
         
    }
    

}