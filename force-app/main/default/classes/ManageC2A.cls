public with sharing class ManageC2A {
    @AuraEnabled(cacheable=True)
    public static List<Task> getOpenTasks(String wtId) {

        return [
            SELECT Id, Subject
            FROM Task WHERE WhatId = :wtId AND Status != 'Completed' AND Subject IN ('Create SPID', 'Request B2B Service Orders')
        ]; 

    }


    @AuraEnabled
    public static void updateTask(String tId, String tDescrip) {

        

        Task tsk = [SELECT Status FROM Task WHERE Id = :tId];
        tsk.Status = 'Completed';
        tsk.Description = tDescrip;
        Update tsk;

    }

    @AuraEnabled(cacheable=True)
    public static List<Task> getCompletedTasks(String wtId) {

        return [
            SELECT Id, Subject, Description
            FROM Task WHERE WhatId = :wtId AND Status = 'Completed' AND Subject = 'Create SPID'
        ]; 

    }


}