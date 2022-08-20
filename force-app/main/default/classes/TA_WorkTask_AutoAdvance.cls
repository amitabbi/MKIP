public with sharing class TA_WorkTask_AutoAdvance implements TriggerAction.AfterUpdate {
    
    @TestVisible
    private static final String STATUS_STARTED = 'Started';
    private static final String STATUS_NOT_STARTED = 'Not Started';
    private static final String STATUS_READY = 'Ready';
    private static final String STATUS_COMPLETED = 'Completed';
    private static final String TYPE_MANUAL = 'Manual';
    
        
    public void afterUpdate(List<Work_Task__c> newList, List<Work_Task__c> oldList) {
		
        if(newList.size() == 1)
        {
            Work_Task__c newWT = newList[0];
            Work_Task__c oldWT = (Work_Task__c)Trigger.oldMap.get(newWT.Id);
            if(newWT.Work_Task_Status__c == STATUS_COMPLETED && oldWT.Work_Task_Status__c != STATUS_COMPLETED)
            {
                if(newWT.Sequence__c.isNumeric())
                {
                    Integer currSeq = Integer.valueOf(newWT.Sequence__c);
                    //Now find the next WorkTask/(s) to mark ready
                    Integer nextSeq = currSeq + 1;
                    String nextSeqStr = String.valueOf(nextSeq);
                    
                    List<Work_Task__c> listWT = [SELECT Id, Work_Task_Status__c, Type__c 
                                                 	FROM Work_Task__c
                                                	WHERE Sequence__c =: nextSeqStr
                                                     AND Work_Order__c =: newWT.Work_Order__c];
                    
					List<Id> lstIds = new List<Id>();
                    for(Work_Task__c item: listWT)
                    {	
                        lstIds.add(item.id);
                    }	
                    updateWorkTasks(lstIds);

                    //update listWT;
                }
                else
                {
                    System.debug('ERROR: Handle Later: Only numeric sequences are handled so far');
                }                
            }
        }
        else
        {
            System.debug('ERROR: Handle Later: Bulk operations on Work_Task__c are not supported.');
        }        
    }   
    
//    @future
    public static void updateWorkTasks(List<Id> lstWTIds)
    {
         List<Work_Task__c> listWT = [SELECT Id, Work_Task_Status__c, Type__c 
                                      FROM Work_Task__c
                                      WHERE Id =: lstWTIds];
        
        for(Work_Task__c item: listWT)
        {	
            if(item.Type__c == TYPE_MANUAL) {
                item.Work_Task_Status__c = STATUS_READY;
            }
            else {
                item.Work_Task_Status__c = STATUS_STARTED;
            }
        }
        
        update listWT;
    }
}