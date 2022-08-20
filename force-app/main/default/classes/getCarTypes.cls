public with sharing class getCarTypes {
    @AuraEnabled(cacheable=True)
  
    public static List<Car_Type__c> getCarTypes() {
        return [SELECT Id, Name FROM Car_Type__c];
    }
}