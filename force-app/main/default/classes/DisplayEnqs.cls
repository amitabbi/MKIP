public with sharing class DisplayEnqs {
    @AuraEnabled(cacheable=True)
    
    public static List<Enquiry__c> DisplayEnqs() {

        return [
            SELECT Id, Name, Days_Open__c,Enquiry_Type__c,Escalated_Enquiry_Image__c
            FROM Enquiry__c WHERE Enquiry_Type__c = 'Escalated'
        ]; 

    }

    
}