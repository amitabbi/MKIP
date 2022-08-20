public with sharing class GetContactsFromSearch {
        @AuraEnabled(cacheable=True)
        public static List<Contact> getCons(String FName, String LName, String Mob) {
    
            return [
                SELECT Id, FirstName, LastName, Phone, Email
                FROM Contact WHERE FirstName = :FName AND  LastName = :LName
            ]; 
    
        }

        @AuraEnabled(cacheable=True)
        public static Contact getConFromLookUp(String conId) {
    
            return [
                SELECT Id, FirstName, LastName, MobilePhone, Email
                FROM Contact WHERE Id = :conId
            ]; 
    
        }


        @AuraEnabled(cacheable=True)
        public static List<Contact> getAllCons(String conId) {

            List<Contact> existAcc = [SELECT AccountId FROM Contact WHERE Id = : conId LIMIT 1];
    
            return [
                SELECT Id, FirstName, LastName, MobilePhone, Email
                FROM Contact WHERE AccountId = :existAcc[0].AccountId
            ]; 
    
        }
    
}