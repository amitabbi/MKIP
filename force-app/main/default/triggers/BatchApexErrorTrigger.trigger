trigger BatchApexErrorTrigger on BatchApexErrorEvent (after insert) {
/*
    
    List<BatchLeadConvertErrors__c> batchApexErrorList = new List<BatchLeadConvertErrors__c>();
     for(BatchApexErrorEvent a : Trigger.New) {
         BatchLeadConvertErrors__c t = new BatchLeadConvertErrors__c();
        t.AsyncApexJobId__c = a.AsyncApexJobId;
         t.Records__c = a.JobScope;
         t.StackTrace__c = a.StackTrace;
    batchApexErrorList.add(t);
          
    } 
    insert batchApexErrorList;
    
*/
}