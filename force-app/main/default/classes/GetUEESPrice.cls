public class GetUEESPrice {

    


    public class FlowInputs {
        @InvocableVariable(required=true)
        public String size;
        @InvocableVariable(required=true)
        public String AppPref;
    }


    @InvocableMethod
    public static List<UE_Establish_Supply_Pricing_Matrix__mdt> getESPrice(FlowInputs[] pars) {
        String appsize = pars[0].size;
        String appref = pars[0].AppPref;
        return [
            SELECT Price__c
            FROM UE_Establish_Supply_Pricing_Matrix__mdt WHERE Size__c <= :appsize AND Appointment_Preference__c = :appref
        ]; 


    }
  }