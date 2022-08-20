public with sharing class GetPropComboValues {
    @AuraEnabled(cacheable=true)
    public static List<XProp_Project__c> getProjects() {
        return [SELECT Id, Name FROM XProp_Project__c];
    }

    @AuraEnabled(cacheable=true)
    public static List<XProp_Building__c> getBuildings(String projId) {
        return [SELECT Id, Name FROM XProp_Building__c WHERE Project__c = :projId];
    }

    @AuraEnabled(cacheable=true)
    public static List<XProp_Lot__c> getLots(String buildId) {
        return [SELECT Id, Name FROM XProp_Lot__c WHERE Building__c = :buildId];
    }
}