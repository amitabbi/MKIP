public with sharing class GetQuoteWizardMenuRecords {
    @AuraEnabled(cacheable=True)
    public static List<Task> getTasks(String ownId) {

        return [
                SELECT Id, Status, Subject, ActivityDate
                FROM Task WHERE OwnerId = :ownId AND Status != 'Completed'
            ];


    }

    @AuraEnabled(cacheable=True)
    public static List<Task> getTypeAheadTasks(String ownId, String searchKey) {
        String key = '%' + searchKey + '%';
        return [
                SELECT Id, Status, Subject, ActivityDate
                FROM Task WHERE Subject LIKE :key AND OwnerId = :ownId AND Status != 'Completed'
                LIMIT 5
            ];


    }



    @AuraEnabled(cacheable=True)
    public static List<Lead> getLeads(String ownId) {

        return [
                SELECT Id, Name, MobilePhone, Company, LeadSource, Status
                FROM Lead WHERE OwnerId = :ownId AND Status != 'Closed - Converted'
            ];


    }

    @AuraEnabled(cacheable=True)
    public static List<Lead> getTypeAheadLeads(String ownId, String searchKey) {
        String key = '%' + searchKey + '%';
        return [
                SELECT Id, Name, MobilePhone, Company, LeadSource, Status
                FROM Lead WHERE Name LIKE :key AND OwnerId = :ownId AND Status != 'Closed - Converted'
                LIMIT 5
            ];


    }

    @AuraEnabled(cacheable=True)
    public static List<Case> getCases(String ownId) {

        return [
                SELECT Id, Status, Subject, Priority, Case_Days_Open__c
                FROM Case WHERE OwnerId = :ownId AND Status != 'Closed' AND Priority = 'High'

                //SELECT Name, (SELECT Id, AccountId FROM Cases) FROM Account WHERE Id IN (SELECT AccountId FROM Case)
            ];
    }


@AuraEnabled(cacheable=True)
public static List<Case> getTypeAheadCases(String ownId, String searchKey) {
    String key = '%' + searchKey + '%';
    return [
            SELECT Id, Status, Subject, Priority, Case_Days_Open__c
            FROM Case WHERE Subject LIKE :key AND OwnerId = :ownId AND Status != 'Closed' AND Priority = 'High'
            LIMIT 5

            //SELECT Name, (SELECT Id, AccountId FROM Cases) FROM Account WHERE Id IN (SELECT AccountId FROM Case)
        ];
}
}