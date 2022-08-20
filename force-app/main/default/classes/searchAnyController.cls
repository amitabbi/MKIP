public with sharing class searchAnyController {
    public searchAnyController() {

   


    }
    @AuraEnabled
 
         public static List<Contact> getContactList() {
        return [SELECT Id, FirstName, LastName, Title, Phone, Email FROM Contact LIMIT 10];
    }
}