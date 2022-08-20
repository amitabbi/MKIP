public with sharing class CourseCatalog {

    @AuraEnabled(cacheable = True)
    public static CourseCatalogWrapper getApplicationSelections() {

        try{
            CourseCatalogWrapper ccWrapper = new CourseCatalogWrapper();
            ccWrapper.applicationTypeList = [SELECT Id, Name, Application_Type_URL__c FROM Application_Type__c];


            ccWrapper.applicationSubTypeList = [SELECT Id, Name, Active__c, Application_Type__r.Name, Application_Sub_Type_URL__c FROM Application_Sub_Type__c];



        
        return ccWrapper;

    }catch(Exception ex){
        throw ex;
    }

}
    

}