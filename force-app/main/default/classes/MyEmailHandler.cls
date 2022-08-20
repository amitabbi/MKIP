global class MyEmailHandler implements Messaging.InboundEmailHandler{

global Messaging.InboundEmailResult handleInboundEmail(Messaging.inboundEmail email,
                                                       Messaging.InboundEnvelope env){
                                                       
Messaging.InboundEmailResult result = new Messaging.InboundEmailResult();

   result.success = true;
                                                    
// Return the result for the Apex Email Service
   return result;
                                                       
                                                       }


}