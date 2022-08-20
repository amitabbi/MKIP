trigger trigXProp on XProp__e (after insert) {

List<Lead> leads = new List<Lead>();
    
    // Get user Id for case owner. Replace username value with a valid value.
    User adminUser = [SELECT Id FROM User WHERE Username='amitabbikip@hotmail.com'];
       
    // Iterate through each notification.
    for (XProp__e event : Trigger.New) {
        //if (event.Lead_Status__c == 'New') {
            Lead led = new Lead();
            led.FirstName = event.FirstName__c;
            led.LastName = event.Last_Name__c;
            led.Company = event.FirstName__c + ' ' + event.Last_Name__c;
            led.Status = 'Open - Not Contacted';
            led.Description = event.Message__c;
            led.Email = event.Email__c;
            led.MobilePhone = event.Mbile__c;
            XProp_Project__c projectName = [SELECT Id from XProp_Project__c WHERE Name = :event.Project_Name__c];
            led.Project__c = projectName.Id;
            // Set lead owner ID so it is not set to the Automated Process entity.
            led.OwnerId = adminUser.Id;
            leads.add(led);
        //}
    }

    
    // Insert all leads in the list.
    if (leads.size() > 0) {
        insert leads;
        
    }

}