public with sharing class CreateNewAccount {
    @AuraEnabled
    
    public static Id CreateNewAccount(String aName) {
        Account acc = new Account(Name=aName);
        insert acc;
        return acc.Id;
    }
}