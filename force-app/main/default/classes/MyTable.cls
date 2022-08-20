public class MyTable {
        @AuraEnabled

    public static List<Account> fetchTableData() {

        Id usern = UserInfo.getUserId();
      // Get the 5 oldest accounts
      List<Account> accounts = [SELECT Name, Phone FROM Account ORDER BY CreatedDate LIMIT 5];
     //simpleName.add(accounts);
      // loop through them and update the Description field
      System.debug('My Response is' + accounts);
      return accounts;
      
    }
    }