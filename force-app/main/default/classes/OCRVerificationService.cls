/**
 * @File Name       :       OCRVerificationService.cls
 * @Description     :       Inbound Service to recieve verification check results from OCR Labs
 * @Author          :       AA
 */

@RestResource(urlMapping='/lgidv')
global with sharing class OCRVerificationService { 
    // Change below
    @httpPost
    global static void doPostMethod(String Name, Integer AnnualRevenue){
    //Account acc= new Account(Name =name,AnnualRevenue = annualrevenue);
    //insert acc;
    //return acc;
    }

}