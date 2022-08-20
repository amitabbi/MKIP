public with sharing class CallToActionTimelineCtrl {
            
    @AuraEnabled(cacheable=true)
    public static list<Task> getCallToActions(string workOrderId){
        List<Task> lst = new List<Task>([SELECT Id, Subject, WhatId, Description, Priority, OwnerId 
                                            FROM Task 
                                            WHERE WhatId =: workOrderId ]);
        return lst;
    }
}