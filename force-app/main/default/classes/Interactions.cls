public with sharing class Interactions {

    @AuraEnabled (cacheable=true)
public static List<Contact> getContacts(){
    return [SELECT Id, Name, Email, Phone, Title FROM Contact LIMIT 10];
}

@AuraEnabled (cacheable=true)
public static List<Contact> getContactAddress(Id recId){
    return [SELECT MailingAddress FROM Contact WHERE Id =: recId];
}

}