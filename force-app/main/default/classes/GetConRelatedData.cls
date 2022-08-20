public with sharing class GetConRelatedData {
    @AuraEnabled
    public static List<Case> getConCaseData(String conId, Integer v_Offset, Integer v_pagesize) {
        return [
            SELECT Id, Subject, Priority,Status,Case_Days_Open__c,CreatedDate
            FROM Case WHERE ContactId = :conId limit :v_pagesize OFFSET :v_Offset
        ]; 
    }

    @AuraEnabled
    public static List<Enquiry__c> getConEnqData(String conId, Integer v_Offset, Integer v_pagesize) {
        return [
            SELECT Id, Name, Days_Open__c,Enquiry_Type__c, CreatedDate
            FROM Enquiry__c WHERE Contact__c = :conId limit :v_pagesize OFFSET :v_Offset
        ]; 
    }

    @AuraEnabled
    public static Integer TotalCaseRecords(String conId){
        return [Select count() from Case WHERE ContactId = :conId];
    }

    @AuraEnabled
    public static Integer TotalEnquiryRecords(String conId){
        return [Select count() from Enquiry__c WHERE Contact__c = :conId];
    }

    @AuraEnabled(cacheable=true)
    public static Integer getNext(Integer v_Offset, Integer v_pagesize){
        v_Offset += v_pagesize;
        return v_Offset;
    }

    @AuraEnabled(cacheable=true)
    public static Integer getPrevious(Integer v_Offset, Integer v_pagesize){
        v_Offset -= v_pagesize;
        return v_Offset;
    }
}