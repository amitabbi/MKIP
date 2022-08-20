trigger trigCOLT on COLT__e (after insert) {

// List to hold all cases to be created.
    List<Lead> leads = new List<Lead>();
    
    // Get user Id for case owner. Replace username value with a valid value.
    User adminUser = [SELECT Id FROM User WHERE Username='amitabbikip@hotmail.com'];
       
    // Iterate through each notification.
    for (COLT__e event : Trigger.New) {
        if (event.Lead_Status__c == 'New') {
            Lead led = new Lead();
            led.FirstName = event.Lead_First_Name__c;
            led.LastName = event.Lead_Last_Name__c;
            led.Company = event.Lead_Company__c;
            led.Status = event.Lead_Status__c;
            // Set case owner ID so it is not set to the Automated Process entity.
            led.OwnerId = adminUser.Id;
            leads.add(led);
        }
    }
    
    // Insert all cases in the list.
    if (leads.size() > 0) {
        insert leads;
    }

}