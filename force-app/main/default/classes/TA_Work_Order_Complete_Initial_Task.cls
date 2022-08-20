public with sharing class TA_Work_Order_Complete_Initial_Task implements TriggerAction.AfterUpdate {
    @TestVisible
    private static final String STATUS_COMPLETED = 'Completed';

    public void afterUpdate(List<WorkOrder> newList, List<WorkOrder> oldList) {

        List<Work_Task__c> updatedWorkTaskList = new List<Work_Task__c>();
        List<String> workOrderIDs = new List<String>();

        for (WorkOrder workOrder : newList) {
            if (workOrder.Run_Work_Task__c) {
            workOrderIDs.add(workOrder.id);
            }
        }
        
        for (WorkOrder workOrder : [SELECT Id, (SELECT Id, Name FROM Work_Tasks__r WHERE Work_Task_Status__c = 'Started' AND Sequence__c = '1' LIMIT 1) 
        FROM WorkOrder WHERE Id IN :workOrderIDs]) {

            for (Work_Task__c workTask : workOrder.Work_Tasks__r) {
                workTask.Work_Task_Status__c = STATUS_COMPLETED;
                updatedWorkTaskList.add(workTask);
            }
        }
        
        if(updatedWorkTaskList.size() > 0) {
            update updatedWorkTaskList;
        }
    }
}