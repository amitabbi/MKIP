public with sharing class CourseCatalogWrapper {
    @AuraEnabled
    public List<Application_Type__c> applicationTypeList{get;set;}
    @AuraEnabled
    public List<Application_Sub_Type__c> applicationSubTypeList{get;set;}

}