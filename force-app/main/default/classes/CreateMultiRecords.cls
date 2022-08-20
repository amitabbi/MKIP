global with sharing class CreateMultiRecords {
    @AuraEnabled
    global static void CreateMultiRecords(String FName, String LName, String ProductType) {
        String result='';
        try {

        Account acc = new Account(Name=FName+' '+LName);
        insert acc;
        Contact con = new Contact(AccountId=acc.Id,FirstName=FName, LastName=LName);
        insert con;
        //AAProduct__c prod = new AAProduct__c(Product_Type__c=ProductType);
        //insert prod;
        
        }
        catch(DmlException e){
            System.debug('An unexpected error has occurred: ' + e.getMessage());
        }
        //return result;



    }
}