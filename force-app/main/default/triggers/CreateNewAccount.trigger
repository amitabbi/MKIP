trigger CreateNewAccount on AccountUpdate__e (after insert) {
Integer sInteger;

List<Account> accList = new List<Account>();

for(AccountUpdate__e a : Trigger.New) {
        Account newAcc = new Account();
        sInteger = Integer.valueOf(a.Num_Employees__c);
        newAcc.NumberOfEmployees = sInteger;
        newAcc.Name = 'I am Platform Event Again Okay';
        accList.add(newAcc);
    } 
insert accList;

}