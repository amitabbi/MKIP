public with sharing class GetQuoteWizardTestimonials {
    @AuraEnabled(cacheable=True)
    public static List<Testimonial__c> getNextTestimonial(String ownId, Integer v_Offset, Integer v_pagesize) {

        return [
                SELECT Id, Case__c, Opportunity__c, Rating__c, Feedback__c, Viewed__c
                FROM Testimonial__c WHERE OwnerId = :ownId AND Viewed__c != true AND CreatedDate = LAST_N_DAYS:1
                limit :v_pagesize OFFSET :v_Offset
            ];


    }

    @AuraEnabled
    public static Integer TotalTestimonialRecords(String ownId){
        return [Select count() from Testimonial__c WHERE OwnerId = :ownId AND Viewed__c != true  AND CreatedDate = LAST_N_DAYS:3];
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