public with sharing class ApplicationRelatedFields {

    @AuraEnabled(cacheable = True)
    public static Map < String, Object > GetApplicationRelatedFields(String recordId) {

        List < applicationRelatedFieldsMapping__mdt > relAppDataList = new List < applicationRelatedFieldsMapping__mdt > ([SELECT FieldApiName__c, Object_Name__c, FieldLabel__c FROM applicationRelatedFieldsMapping__mdt WHERE isActive__c = true]);
        Map < String, String > appFieldsLabels = new Map < String, String > ();
        String commaSepratedAppFields = '';
        Boolean hasAp = false;
        Map < String, Object > finallMap = new Map < String, Object > ();

        for (applicationRelatedFieldsMapping__mdt m: relAppDataList) {
            if (m.Object_Name__c == 'Application__c') {
                appFieldsLabels.put(m.FieldLabel__c, m.FieldApiName__c);
                hasAp = true;

                if (commaSepratedAppFields == null || commaSepratedAppFields == '') {
                    commaSepratedAppFields = m.FieldApiName__c;

                } else {
                    commaSepratedAppFields = commaSepratedAppFields + ', ' + m.FieldApiName__c;
                }


            }



        }


        List < sObject > applList = new List < sObject > ();

        String sObjectAppString = 'Application__c';
        if (hasAp = true) {
            String queryAppString = 'SELECT ' + commaSepratedAppFields + ' FROM ' + sObjectAppString + ' WHERE Id =:recordId ' + ' LIMIT 1 ';
            applList = Database.query(queryAppString);

        }




        Map < String, Object > fieldsToValue = new Map < String, Object > ();
        for (sObject record: applList) {
            fieldsToValue = record.getPopulatedFieldsAsMap(); //get field value map for each record
        }


        system.debug('appFieldsLabels' + appFieldsLabels); // 2 labels
        system.debug('fieldsToValue' + fieldsToValue); // 4 values



        for (String flabel: appFieldsLabels.keySet()) {
            finallMap.put(flabel, fieldsToValue.get(appFieldsLabels.get(flabel)));
        }



        system.debug('finallMap' + finallMap);

        return finallMap;


    }



}