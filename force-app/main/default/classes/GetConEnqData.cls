public with sharing class GetConEnqData {
    @AuraEnabled(cacheable=True)
    public static List<Enquiry__c> GetConEnqData(Integer v_Offset, Integer v_pagesize) {
        List<Enquiry__c> ls;
        
        if (v_Offset >=0){   
        return [
            SELECT Id, Name, Contact__c, Contact__r.Name, Days_Open__c,Enquiry_Type__c
            FROM Enquiry__c WHERE Enquiry_Type__c = 'Escalated' limit :v_pagesize OFFSET :v_Offset
        ];
        }else{
            return ls;
        }
        

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

    @AuraEnabled
    public static Integer TotalRecords(){
        return [Select count() from Enquiry__c WHERE Enquiry_Type__c = 'Escalated'];
    }
}