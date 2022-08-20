public class EnquiryController {

    /*******************************************************************
    Purpose     : get the PickList values from the Object's picklist field
    Parameters  : Object API Name,File API Name
    Returns     : list of String containg picklist values
    ********************************************************************/
    @AuraEnabled
    public static map<String,String> getPicklistValues(String objectName,String picklistFieldName) {
        map<String,String> picklistMap = new map<String,String>();
        
            for(Schema.PicklistEntry p :Schema.getGlobalDescribe().get(objectname).getDescribe().fields.getMap().get(picklistFieldName).getDescribe().getPicklistValues())
        {
                picklistMap.put(p.getlabel(),p.getvalue());
        }
       
        return picklistMap;
    } 

    /* query current user information */
    @AuraEnabled 
    public static user fetchUser(){ 
      User oUser = [select id,ProfileId
                 FROM User Where id =: userInfo.getUserId()];
        return oUser;
    }

        /* query current user information */
    @AuraEnabled 
    public static String GetCases(String CStatus){ 

        try{
        List<Case> casebystatuslist = [select Subject from Case WHERE Status=:CStatus ORDER BY CreatedDate DESC];
        return JSON.serialize(casebystatuslist);
        }catch(exception e){ return null; }

    }

}