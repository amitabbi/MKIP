public with sharing class ModifyContact {
    @AuraEnabled
    public static void ModifyContact(Id ConId,String CPhone) {
      system.debug(ConId + ' ' + CPhone);
      Contact p = [SELECT Phone from Contact WHERE Id = :ConId];
      p.Phone = CPhone;
      update p;


    }
}