public with sharing class GetAccountPaginateData {
    @AuraEnabled(cacheable=True)
    public static List<Account> GetAccPagData(Integer v_Offset) {
        List<Account> ls;
        
        //if (v_Offset >=0){   
        //return [
            return [SELECT Id, Name, AccountNumber FROM Account ORDER BY Name limit 20 OFFSET :v_Offset];
       // ];
        //}else{
        //    return ls;
        //}
        

    }

    /*
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

    @AuraEnabled
    public static Integer TotalRecords(){
        return [Select count() from Enquiry__c WHERE Enquiry_Type__c = 'Escalated'];
    }
    */
}