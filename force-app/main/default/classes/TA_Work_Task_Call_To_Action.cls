public with sharing class TA_Work_Task_Call_To_Action implements TriggerAction.BeforeUpdate {
    @TestVisible
    private static final String STATUS_STARTED = 'Started';
    private static final String STATUS_NEW = 'New';
    private static final String STATUS_READY = 'Ready';
    private static final String TYPE_MANUAL = 'Manual';
    private static final String TYPE_AUTO = 'Auto';
    private static final String TASK_SUBJECT = 'Create SPID';
    private static final String ACTION_QUEUE = 'Assign to Queue';
    private static final String ACTION_CREATE_SPID = 'C2A Create SPID';
    Group g = [select Id FROM Group WHERE Name = 'New Connections Ready Queue' AND Type = 'Queue'];

    public void beforeUpdate(List<Work_Task__c> newList, List<Work_Task__c> oldList) {

        if(newList.size() == 1) {
            Work_Task__c newWT = newList[0];
            Work_Task__c oldWT = (Work_Task__c)Trigger.oldMap.get(newWT.Id);

            if(newWT.Type__c == TYPE_MANUAL){
                
                if(newWT.Work_Task_Status__c == STATUS_READY && oldWT.Work_Task_Status__c != STATUS_READY) {
                    if(newWT.Action__c == ACTION_QUEUE){
                        newWT.OwnerId = g.id;
                    }
                }
            }
            else {

                if(newWT.Work_Task_Status__c == STATUS_STARTED && oldWT.Work_Task_Status__c != STATUS_STARTED) {

                    if(newWT.Action__c == ACTION_CREATE_SPID){
                        Task task = createNewCallToActionTask(newWT);
                        insert task;
                    }
                }
            }
        }
        else
        {
            System.debug('TA_Work_Task_call_To_Action: ERROR: Handle Later: Bulk operations on Work_Task__c are not support');
        }
    }

    private Task createNewCallToActionTask(Work_Task__c workTask) {
        Task newTask = new Task();
        newTask.OwnerId = g.id;
        newTask.Subject = TASK_SUBJECT;
        newTask.WhatId = workTask.id;
        newTask.Status = STATUS_NEW;
        newTask.Work_Task__c = workTask.id;
        return newTask;
    }
}