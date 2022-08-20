public with sharing class CreateSimpleWizardRecords {
    @AuraEnabled
    
    public static void CreateSimpleWizardRecords(String aName,String fName, String lName, String enqName) {

        String result='';
        try {

        Account acc = new Account(Name=aName);
        insert acc;
        Contact con = new Contact(AccountId=acc.Id,FirstName=FName, LastName=LName);
        insert con;
        Enquiry__c enq = new Enquiry__c(Name=enqName);
        insert enq;
        
        }
        catch(DmlException e){
            System.debug('An unexpected error has occurred: ' + e.getMessage());
        }

    }
}