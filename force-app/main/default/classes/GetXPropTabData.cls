public with sharing class GetXPropTabData {

    public list<string> label{get;set;}  
    public list<integer> data{get;set;} 

    @AuraEnabled(cacheable=true)
    public static List<XProp_ContactLot__c> getAssignedAgents(String lotId) {
        //return [SELECT Contact__c, Contact__r.Agent_Picture__c FROM XProp_ContactLot__c WHERE Lot__c = : lotId];

        String query = 'SELECT '
        + 'Contact__c, Contact__r.Agent_Picture__c, Contact__r.Name, Agent_User__c '
        + 'FROM XProp_ContactLot__c';
if (String.isNotBlank(lotId)) {
query += ' WHERE Lot__c = :lotId';
}
query += ' WITH SECURITY_ENFORCED ';
return Database.query(query);


    }

    @AuraEnabled(cacheable=true)
    public static List<Contact> getAllAgents(String lotId) {


        return [SELECT Id,Agent_Picture__c, Name, Owner.Name, OwnerId FROM Contact WHERE Agent_Picture__c != null];


    }



    @AuraEnabled(cacheable=true)
    public static List<Lead> getAgentLeads(String agentId, String lotId) {
        return [SELECT Name,LeadSource,Status,Rating FROM Lead WHERE OwnerId = : agentId AND LeadLot__c = :lotId];
    }

    @AuraEnabled(cacheable=true)
    public static List<Opportunity> getAgentOpportunities(String agentId, String lotId) {
        return [SELECT Name,CloseDate,StageName FROM Opportunity WHERE OwnerId = : agentId AND OpportunityLot__c = :lotId];
    }

    @AuraEnabled(cacheable=true)
    public static List<Opportunity> getLotOpportunities(String lotId) {
        
        //String dateFormatString = 'dd/MM/yyyy';

        return [SELECT Name,CloseDate,StageName FROM Opportunity WHERE OpportunityLot__c = :lotId];

        /*List<Opportunity> oppsList = [SELECT Name,CloseDate,StageName FROM Opportunity WHERE OpportunityLot__c = :lotId];
        List<Opportunity> finalOppList = new List<Opportunity>();
        for(Opportunity opp: oppsList){
            System.debug(opp.CloseDate);
            Date d = opp.CloseDate;
            String formattedDate = opp.CloseDate.format();
            System.debug(formattedDate);
            opp.CloseDate = date.parse(formattedDate);
            System.debug(opp.CloseDate);
            finalOppList.add(opp);
            System.debug('Final Opp List is:' + finalOppList);

        }
        return finalOppList;*/
    }

    @AuraEnabled
    public static List<Task> getOpportunityTasks(String selectedOppId, String ownId) {
        return [SELECT Status,Subject,ActivityDate,Description FROM Task WHERE WhatId = :selectedOppId AND OwnerId = :ownId AND Status != 'Completed'];
    }

    @AuraEnabled
    public static List<Event> getOpportunityEvents(String selectedOppId, String ownId) {
        Datetime dtm = Datetime.now();
        return [SELECT StartDateTime,EndDateTime,Subject,ActivityDateTime,Description FROM Event WHERE WhatId = :selectedOppId AND OwnerId = :ownId AND EndDateTime > :dtm];
    }

    @AuraEnabled
    public static void createTask(String tSubject, Date tActivityDate, String tStatus, String tPriority, String tDescription, String selectedOppId) {
        Task tsk = new Task(Subject=tSubject, ActivityDate=tActivityDate, Status=tStatus, Priority=tPriority, Description=tDescription, WhatId=selectedOppId);
        insert tsk;
    }

    @AuraEnabled
    public static void createEvent(String eSubject, Datetime eStartDateTime, Datetime eEndDateTime, String eDescription, String selectedOppId) {
        Event eve = new Event(Subject=eSubject, StartDateTime=eStartDateTime, EndDateTime=eEndDateTime, Description=eDescription, WhatId=selectedOppId);
        insert eve;
    }

    @AuraEnabled(cacheable=true)
    public static List<ServiceContract> getLotServiceContracts(String lotId) {
        return [SELECT ContractNumber,CreatedDate,GrandTotal,Service_Contract_Status__c,StartDate,EndDate FROM ServiceContract WHERE SCLot__c = :lotId AND Service_Contract_Status__c != 'Completed'];
    }

    @AuraEnabled(cacheable=true)
    public static List<XProp_Variation__c> getScVariations(String lotId) {
        List<XProp_Variation__c> scVar;
        List<ServiceContract> sc = [SELECT Id, ContractNumber,CreatedDate,GrandTotal,Service_Contract_Status__c,StartDate,EndDate FROM ServiceContract WHERE SCLot__c = :lotId AND Service_Contract_Status__c != 'Completed' AND Status = 'Active' LIMIT 1];
        if (sc.size() > 0){
        scVar = [SELECT Name FROM XProp_Variation__c WHERE Service_Contract__c = :sc[0].Id];
       
        //return [SELECT Name FROM XProp_Variation__c WHERE Service_Contract__c = :sc[0].Id];
        }
        return scVar;
        //else{
        //return scVar = null;
        //}
        //return [SELECT Name,Service_Contract__r.,EndDate FROM XProp_Variation__c WHERE SCLot__c = :lotId AND Service_Contract_Status__c != 'Completed'];
    }

    @AuraEnabled(cacheable=true)
    public static List<XProp_Variation_Line_Item__c> getScVariationLineItems(String variationId) {
       return [SELECT Subject__c FROM XProp_Variation_Line_Item__c WHERE Variation__c = :variationId];
    }

    @AuraEnabled(cacheable=true)
    public static XProp_AgentCommission__c getLotAgentCommission(String lotId) {
        return [SELECT First_Payment__c,Second_Payment__c,Third_Payment__c FROM XProp_AgentCommission__c WHERE Lot__c = :lotId AND Eligable__c = true];
    }

    @AuraEnabled
    public static void updateLotAgentCommission(String lotId, Boolean firstPay, Boolean secondPay, Boolean thirdPay) {
        XProp_AgentCommission__c agentLotCommission = [SELECT First_Payment__c,Second_Payment__c,Third_Payment__c FROM XProp_AgentCommission__c WHERE Lot__c = :lotId AND Eligable__c = true];
        if (agentLotCommission != null){
        if (firstPay == true){
            agentLotCommission.First_Payment__c = firstPay;
        }
        if (secondPay == true){
            agentLotCommission.Second_Payment__c = secondPay;
            }
            if (thirdPay == true){
                agentLotCommission.Third_Payment__c = thirdPay;
                }
            }
        update agentLotCommission;
    }

    @AuraEnabled(cacheable=true)
    public static List<XProp_Feedback__c> getLotFeedback(String lotId) {
        return [SELECT Type__c,Comments__c,Feedback_Rating__c FROM XProp_Feedback__c WHERE Feedback_Lot__c = :lotId];
    }

    @AuraEnabled(cacheable=true)
    public static List<AggregateResult> getLeadCount(String lotId) {
        return [SELECT count(Id) FROM Lead WHERE LeadLot__c = :lotId];
    }

    @AuraEnabled(cacheable=true)
    public static List<AggregateResult> getLotStats(String lotId) {
        //return [SELECT count(Id) FROM Lead WHERE LeadLot__c = :lotId];

        List<AggregateResult> leadCount = [SELECT count(Id) lCount FROM Lead WHERE LeadLot__c = :lotId];
        List<AggregateResult> opportunityCount = [SELECT count(Id) oppCount FROM Opportunity WHERE OpportunityLot__c = :lotId];
        List<AggregateResult> agr = new List<AggregateResult>();
        if (leadCount != null){
            agr.add(leadCount[0]);
        }
        if (opportunityCount != null){
            agr.add(opportunityCount[0]);
        }
        return agr;

    }

    @AuraEnabled(cacheable=true)
    public static List<AggregateResult> getProjectStats(String projectId) {

        List<AggregateResult> projectCount = [SELECT count(Id) buildCount FROM XProp_Building__c WHERE Project__c = :projectId];
        List<AggregateResult> prj = new List<AggregateResult>();
        if (projectCount != null){
            prj.add(projectCount[0]);
        }
        return prj;

    }

    @AuraEnabled(cacheable=true)
    public static List<AggregateResult> getProjectLots(String projectId) {
        List<AggregateResult> lotCount = new List<AggregateResult>();
        List<XProp_Building__c> buildingIds = [SELECT Id FROM XProp_Building__c WHERE Project__c = :projectId];
        if (buildingIds != null){
            lotCount = [SELECT count(Id) lotCount FROM XProp_Lot__c WHERE Building__c IN :buildingIds];
        }
        List<AggregateResult> prjLots = new List<AggregateResult>();
        if (lotCount != null){
            prjLots.add(lotCount[0]);
        }
        return prjLots;

    }

    @AuraEnabled(cacheable=true)
    public static List<AggregateResult> getProjectOppsByStage(String projectId) {
        List<string> label = new list<string>();  
        List<integer> data = new list<integer>();
        List<AggregateResult> oppsCount = new List<AggregateResult>();
        List<AggregateResult> ar = new List<AggregateResult>();
        List<XProp_Building__c> buildingIds = [SELECT Id FROM XProp_Building__c WHERE Project__c = :projectId];
        List<XProp_Lot__c> lotIds = [SELECT Id FROM XProp_Lot__c WHERE Building__c IN :buildingIds];
        if (lotIds != null){
            oppsCount = [SELECT count(Id) value, StageName label FROM Opportunity WHERE OpportunityLot__c IN :lotIds GROUP BY StageName];
        }
        List<AggregateResult> prjOppsStage = new List<AggregateResult>();
        if (oppsCount != null){
            prjOppsStage.addAll(oppsCount);
        }



        return prjOppsStage;

    }

    @AuraEnabled(cacheable=true)
    public static List<XProp_Lot__c> getProjectLotsByPrice(String projectId) {

        List<XProp_Lot__c> lotOptions = new List<XProp_Lot__c>();
        List<XProp_Building__c> buildingIds = [SELECT Id FROM XProp_Building__c WHERE Project__c = :projectId];
        if (buildingIds != null){
            lotOptions = [SELECT Name, Price__c FROM XProp_Lot__c WHERE Building__c IN :buildingIds];
        }
      
        return lotOptions;

    }


    @AuraEnabled(cacheable=true)
    public static List<Case> getLotCases(String lotId) {
        return [SELECT CaseNumber,Status,Subject,Priority FROM Case WHERE CaseLot__c = :lotId];
    }

    @AuraEnabled
    public static List<Event> fetchAllEvents(String agentId){
        List<Event> eventList = new List<Event>();
        eventList = [Select Id, Subject, WhatId, WhoId, 
                    Description, EndDate, EndDateTime, OwnerId,
                    ActivityDate, ActivityDateTime From Event WHERE OwnerId = : agentId LIMIT 100];
        return eventList;
    }

    /******  Below Queries for the Web Enquiries View  ********/
    @AuraEnabled(cacheable=true)
    public static List<Lead> getAgentWebLeads(String agentId, Integer v_Offset, Integer v_pagesize) {
        return [SELECT Name,LeadSource,Description,Status,Project__r.Name,Email,MobilePhone FROM Lead WHERE OwnerId = : agentId AND Project__c != null limit :v_pagesize OFFSET :v_Offset];

    }

    @AuraEnabled
    public static Integer TotalAgentWebLeads(String agentId){
        return [Select count() from Lead WHERE OwnerId = :agentId AND Project__c != null];
    }

    @AuraEnabled(cacheable=true)
    public static Integer getNext(Integer v_Offset, Integer v_pagesize){
        v_Offset += v_pagesize;
        return v_Offset;
    }

    @AuraEnabled(cacheable=true)
    public static Integer getPrevious(Integer v_Offset, Integer v_pagesize){
        v_Offset -= v_pagesize;
        return v_Offset;
    }

    /******  Above Queries for the Web Enquiries View  ********/

    @AuraEnabled
    public static List<XProp_ContactLot__c> getAgentAssignmentsForModal(String agentId) {
        return [SELECT Name,Lot__r.Name,Lot__r.Lot_Sold__c,Lot__r.Building_Name__c,Lot__r.Project_Name__c FROM XProp_ContactLot__c WHERE Agent_User__c = : agentId];
    }

    @AuraEnabled(cacheable=true)
    public static Boolean getAgentAssignedFlag(String agentId,String lotId) {
        Boolean isAlreadyAssigned;
        List<XProp_ContactLot__c> checkAssignment = [SELECT Name FROM XProp_ContactLot__c WHERE Agent_User__c = : agentId AND Lot__c = : lotId];
        return isAlreadyAssigned = checkAssignment.size() >0 ? true : false;
    }

    @AuraEnabled(cacheable=True)
    public static List<Contact> getTypeAheadAgents(String searchKey) {
        String key = '%' + searchKey + '%';
        return [
                SELECT Id,Agent_Picture__c, Name, Owner.Name, OwnerId
                FROM Contact WHERE Name LIKE :key AND Agent_Picture__c != null
                LIMIT 5
            ];
    }

    @AuraEnabled(cacheable=true)
    public static List<Contact> getAllUnassignedAgents(String lotId) {
        List<XProp_ContactLot__c> assignedConIds = [SELECT Contact__c, OwnerId FROM XProp_ContactLot__c WHERE Lot__c = : lotId];
        List<String> conIds = new List<String>();

        if (assignedConIds.size()>0){
        for(XProp_ContactLot__c conList: assignedConIds){
        conIds.add(conList.Contact__c);
        }
    }


        return [SELECT Id,Agent_Picture__c, Name, Owner.Name, OwnerId FROM Contact WHERE Agent_Picture__c != null AND Id NOT IN :conIds];
  


    }

    @AuraEnabled
    public static void assignAgents(List<String> agentOwnerIds, String lotId, List<String> agentConIds) {

        List<XProp_ContactLot__c> agents = new List<XProp_ContactLot__c>();
        for(integer i=0; i< agentConIds.size(); i++){ //iterate using an integer
            XProp_ContactLot__c agentLot = new XProp_ContactLot__c();
            agentLot.Agent_User__c = agentOwnerIds[i];
            agentLot.Lot__c = lotId;
            agentLot.Contact__c = agentConIds[i];
            agents.add(agentLot);
        }
        insert agents; 
    }

    @AuraEnabled(cacheable=true)
    public static List<XProp_Project__c> getProjects() {
        return [SELECT Id,Project_Picture__c,Location__latitude__s,Location__longitude__s,Project_Details__c FROM XProp_Project__c WHERE Project_Picture_Frame__c != null];
    }


    @AuraEnabled(cacheable=true)
    public static List<Event> getAvalaibleTimeSlots(String OwnId) {

        // create a set of time slots
        // create a set of busy event startdatetime

        List<String> ShowAsValues = new List<String>{'Busy','Out of Office'};
        return [SELECT Id,StartDateTime,OwnerId FROM Event WHERE ShowAs IN :ShowAsValues AND OwnerId =: ownId];
    }

    @AuraEnabled(cacheable=true)
    public static XProp_Project__c getSelectedProject(String projectId) {
        return [SELECT Id,Project_Picture__c FROM XProp_Project__c WHERE Id = :projectId AND Project_Picture_Frame__c != null LIMIT 1];
    }

    @AuraEnabled(cacheable=true)
    public static List<XProp_ContactLot__c> getAgentsBySelectedProject(String projectId) {
        return [SELECT Name,Lot__r.Name,Lot__r.Lot_Sold__c,Lot__r.Building_Name__c,Lot__r.Project_Name__c,Contact__r.Agent_Picture__c, Contact__r.Name, Agent_User__c FROM XProp_ContactLot__c WHERE XProp_Project__c = : projectId];
    }

    @AuraEnabled
    public static List<Integer> fetchTimeSlots(String agentId, String actDate){
        List<Event> eventList = new List<Event>();
        List<Integer> ev = new List<Integer>();
        List<Integer> fullList = new List<Integer>();
        fullList.add(9);
        fullList.add(10);
        fullList.add(11);
        fullList.add(12);
        fullList.add(13);
        fullList.add(14);
        fullList.add(15);
        fullList.add(16);

        eventList = [Select Id, Subject, WhatId, WhoId, 
                    Description, EndDate, StartDateTime, EndDateTime, OwnerId,
                    ActivityDate, ActivityDateTime, ShowAs From Event WHERE OwnerId = : agentId AND ActivityDate = :Date.parse(actDate) LIMIT 100];
        
                    
        //return eventList;
        for (integer i=0; i<eventList.size(); i++){
            Integer evLis;
            evLis = eventList[i].StartDateTime.hour();
            ev.add(evLis);  
        }      
        system.debug(ev);


      

        return ev;
    }

    @AuraEnabled
    public static void createBookAppEvent(String eSubject, Datetime eStartDateTime, Integer eDuration, String selectedLeadId) {
        Event eve = new Event(Subject=eSubject, StartDateTime=eStartDateTime, DurationInMinutes=eDuration, WhoId=selectedLeadId);
        insert eve;
    }
    
}