public with sharing class ContactController {
    @AuraEnabled(cacheable=true)
    public static List<Contact> getContacts(){
        //List<Contact> cons = [SELECT FirstName,LastName,Email FROM Contact Order By FirstName];
        //return cons;
        throw new AuraHandledException('Forced error');
    }
}