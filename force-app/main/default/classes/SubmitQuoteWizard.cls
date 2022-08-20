public with sharing class SubmitQuoteWizard {
    
@AuraEnabled
public static String submitorder(String conId, String custFName, String custLName, String custEmail,
                                String custMob, String priFName, String priLName, String priEmail,
                                String priMob){


                                    Account newAcc = new Account();
                                    Opportunity newOpp = new Opportunity();
if (conId.length() == 0){
    
    newAcc.Name = custFName + ' ' + custLName;
    insert newAcc;

    Contact newCon = new Contact();
    newCon.AccountId = newAcc.Id;
    newCon.FirstName = custFName;
    newCon.LastName = custLName;
    newCon.Email = custEmail;
    newCon.MobilePhone = custMob;
    insert newCon;


if (priFName.length() > 0){
    Contact newAdditionalCon = new Contact();
    newAdditionalCon.AccountId = newAcc.Id;
    newAdditionalCon.FirstName = priFName;
    newAdditionalCon.LastName = priLName;
    newAdditionalCon.Email = priEmail;
    newAdditionalCon.MobilePhone = priMob;
    insert newAdditionalCon;
}
    
    newOpp.AccountId = newAcc.Id;
    newOpp.Name = newAcc.Name + ' ' + 'Opp';
    newOpp.StageName = 'Proposal/Price Quote';
    newOpp.CloseDate = Date.today();
    insert newOpp;

}
else if (conId.length() > 0){
    Contact exitConAccId = [SELECT AccountId, FirstName, LastName FROM Contact WHERE Id = :conId];

    if (priFName.length() > 0){
    Contact newAdditionalCon = new Contact();
    newAdditionalCon.AccountId = exitConAccId.AccountId;
    newAdditionalCon.FirstName = priFName;
    newAdditionalCon.LastName = priLName;
    newAdditionalCon.Email = priEmail;
    newAdditionalCon.MobilePhone = priMob;
    insert newAdditionalCon;
    }

    newOpp.AccountId = exitConAccId.AccountId;
    newOpp.Name = exitConAccId.FirstName + ' ' +  exitConAccId.LastName + ' ' + 'Opp';
    newOpp.StageName = 'Proposal/Price Quote';
    newOpp.CloseDate = Date.today();
    insert newOpp;

}



   

return newOpp.Id;

}


}