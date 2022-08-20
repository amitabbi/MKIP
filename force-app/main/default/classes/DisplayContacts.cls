public with sharing class DisplayContacts {
    @AuraEnabled(cacheable=True)
    public static List<Contact> DisplayContacts() {

        return [
            SELECT Id, Account.Name, FirstName, LastName, Phone, Email
            FROM Contact
        ]; 

    }
}