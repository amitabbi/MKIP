public with sharing class GetUEEstablishSupplyData {
        @AuraEnabled(cacheable=True)
        public static UE_Retailers__mdt searchRetailer(String qRECNum) {
    
            return [
                SELECT REC_Name__c,REC_Phone__c, REC_Email__c
                FROM UE_Retailers__mdt WHERE REC_Number__c = :qRECNum
            ]; 
    
        }
}