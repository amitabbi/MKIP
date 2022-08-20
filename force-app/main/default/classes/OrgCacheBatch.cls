global class OrgCacheBatch implements Database.Batchable<sObject> {
    Cache.OrgPartition orgPart = Cache.Org.getPartition('local.GlobalCache');
    global Database.QueryLocator start(Database.BatchableContext BC) {
        // collect the batches of records or objects to be passed to execute
         
        String query = 'SELECT Loan_Name__c, Loan_Type__c FROM loanMapping__mdt WHERE isActive__c = true';
        //List < loanMapping__mdt > loanDataList = new List < loanMapping__mdt > ([SELECT Loan_Name__c, Loan_Type__c FROM loanMapping__mdt WHERE isActive__c = true]);
        return Database.getQueryLocator(query);
    }
     
    global void execute(Database.BatchableContext BC, List<loanMapping__mdt> loanDataList) {
        
        // process each batch of records default size is 200
        for(loanMapping__mdt loan : loanDataList) {        
            orgPart.put(loan.Loan_Type__c, loan.Loan_Name__c, 300);
        }
        
         
    }   
     
    global void finish(Database.BatchableContext BC) {
        // execute any post-processing operations like sending email
    }
}