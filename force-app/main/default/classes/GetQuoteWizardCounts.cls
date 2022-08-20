public with sharing class GetQuoteWizardCounts {
    @AuraEnabled(cacheable=True)
    public static Integer getTasksCount(String ownId) {

        return [
                SELECT count()
                FROM Task WHERE OwnerId = :ownId AND Status != 'Completed'
            ];


    }

    @AuraEnabled(cacheable=True)
    public static Integer getLeadsCount(String ownId) {

        return [
                SELECT count()
                FROM Lead WHERE OwnerId = :ownId AND Status != 'Closed - Converted'
            ];


    }

    @AuraEnabled(cacheable=True)
    public static Integer getCasesCount(String ownId) {

        return [
                SELECT count()
                FROM Case WHERE OwnerId = :ownId AND Status != 'Closed' AND Priority = 'High'

                //SELECT Name, (SELECT Id, AccountId FROM Cases) FROM Account WHERE Id IN (SELECT AccountId FROM Case)
            ];


    }

    @AuraEnabled(cacheable=True)
    public static Integer getOpportunitiesCount(String ownId) {

        return [
                SELECT count()
                FROM Opportunity WHERE OwnerId = :ownId AND StageName != 'Closed Won' AND StageName != 'Closed Lost'
            ];


    }
}