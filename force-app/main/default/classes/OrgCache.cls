public with sharing class OrgCache {
    
    //@AuraEnabled(cacheable = True)
    public static Set < String > retrieveFromOrgCache() {
        //Map < String, Object > finaalMap = new Map < String, Object > ();
        Set < String > finaalSet = new Set < String > ();
        Cache.OrgPartition orgPart = Cache.Org.getPartition('local.GlobalCache');
        //if (Cache.Org.contains('local.GlobalCache.key')) {
           // System.debug('Cache contains data');
            // get the data from the cache
       // } // else query and put data
        //else{
       // List < locationMapping__mdt > locDataList = new List < locationMapping__mdt > ([SELECT Van__c, MasterLabel, PostCode__c FROM locationMapping__mdt]);
        List < loanMapping__mdt > loanDataList = new List < loanMapping__mdt > ([SELECT Loan_Name__c, Loan_Type__c FROM loanMapping__mdt WHERE isActive__c = true]);
        
        for (loanMapping__mdt loan:loanDataList){
            //woFields.put(wo.Suburb__c, wo.Van__c);
        //}


        //for (String wof:woFields.keySet()){
           // orgPart.put(wo.Suburb__c, wof);
            //orgPart.put(wo.Van__c, woFields.get(wof));
            orgPart.put(loan.Loan_Type__c, loan.Loan_Name__c, 300);
            //orgPart.put(wo.Van__c, wo.Van__c);
            //firstSet.add(wof);
            //secondSet.add(woFields.get(wof));
            //orgPart.put(wof, woFields.get(wof),300);
            //finaalMap.put(wof, woFields.get(wof));
           // }

        }
        //system.debug('Finaal Map is' + finaalMap);
        //system.debug('orgPart is' + orgPart.getKeys());

        

        
        for (String finalCacheKey:orgPart.getKeys()){
            //finaalMap.put(finalCacheKey, orgPart.get(finalCacheKey));
            finaalSet.add(orgPart.get(finalCacheKey).toString());
            //finalSet.add(orgPart.get(finalCacheKey));
            
     
            }
            system.debug('Finaal Set is' + finaalSet);
            

            return finaalSet;
    }

   

        
        //GlobalCache

    
}