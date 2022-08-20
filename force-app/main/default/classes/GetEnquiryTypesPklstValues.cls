public with sharing class GetEnquiryTypesPklstValues {
    @AuraEnabled(cacheable=True)
    public static List<Enquiry__c> GetEnquiryTypesPklstValues() {
        return [SELECT Name, Id FROM Enquiry__c WITH SECURITY_ENFORCED ORDER BY Name];
    }
}