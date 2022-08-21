global with sharing class OCRHTTPUtility {

        //constants for response
        public static final String CONTENT_TYPE = 'Content-Type';
        public static final String APP_JSON = 'application/json';
        public static final String LOG_REQUEST = 'Request - ';
        public static final String LOG_RESPONSE = 'Response - ';
    
 
    /** 
    * @description Generic method to create a CoreLogic web service request
    * @param httpMethod - GET/POST/DELETE, etc.
    * @param endpoint - The endpoint
    * @param accept - the accept parameter
    * @param requestBody - Object representing JSON request body, if any
    * @return HttpRequest object ready to send
    */
    private static HttpRequest createHTTPRequest(String httpMethod, String endpoint, Object requestBody, String parentRecordId) {
        HttpRequest req=new HttpRequest();
        req.setMethod(httpMethod);
        req.setEndpoint(endpoint); // set named credential here before endpoint
        req.setHeader(CONTENT_TYPE,APP_JSON);
        //req.setHeader('Accept', accept);
        // Set payload if provided
        if (requestBody != null)
        {
            String reqPayload = JSON.serialize(requestBody, true);
            System.debug('reqPayload: ' + reqPayload);
            req.setBody(reqPayload);
        }
        return req;
    }
//Object requestBody = [{"attributes":{"name":"mighty moose"},}]; 
//Object requestBody = [Select Id from Account limit 1];
//String parentRecordId = '5000o00003VgAGAAA3';
//HTTPUtility.invokeCallOut('POST', 'https://th-apex-http-callout.herokuapp.com/animals', 'accept', requestBody, parentRecordId);

    public static void invokeCallOut(String httpMethod, String endpoint, Object requestBody, String parentRecordId) {

        // Create request
        HttpRequest request = createHTTPRequest(httpMethod, endpoint, requestBody, parentRecordId);
        HttpResponse response;
        try{
        //HttpResponse response;
        response = (new Http()).send(request);
        System.debug('Response body: ' + response.getBody());

        }
        catch(System.CalloutException e) {  
            System.debug('Callout error: '+ e); 
        }

        // dml here 
        handleResponse(request, response, parentRecordId);
        //return response.getBody();
        
    }

    public static void handleResponse(HttpRequest request, HttpResponse response, Id parentRecordId)
	{
		
        
        if (response.getStatusCode() >= 200 && response.getStatusCode() <=299){
   
            OCR_Log__c ocr = new OCR_Log__c();
            String objName = parentRecordId.getSObjectType().getDescribe().getName();
            System.debug('objName is: ' + objName);
            //if (objName == 'Case')
            ocr.Case__c = parentRecordId;
            //if (objName == 'Opportunity')
            //ocr.Opportunity__c = parentRecordId;
            ocr.RequestBody__c = request.getBody();
            ocr.Response_Body__c = response.getBody();
            insert ocr;
        }else{
            // log an entry in the integration error log
        }
	}




    //sets the success response
    public static void setSuccessResponse(Integer statusCode, Object responseBody){
        //Response wrapper
        SuccessResponseWrapper wrapper = new SuccessResponseWrapper();
        wrapper.isSuccess = true;
        wrapper.data = responseBody;
        setRestResponse(statusCode, wrapper);
    }

    //sets the error response
    public static void setErrorResponse(Integer statusCode, String errorMessage){
        //Response wrapper
        ErrorResponseWrapper wrapper = new ErrorResponseWrapper();
        wrapper.isSuccess = false;
        wrapper.error = errorMessage;
        setRestResponse(statusCode, wrapper);
    }

    //sets the rest context response
    private static void setRestResponse(Integer statusCode, Object responseBody){
        RestResponse response = RestContext.response;
        System.debug(LoggingLevel.DEBUG, '** responseBody **'+ responseBody);
        response.statusCode = statusCode;
        response.responseBody = Blob.valueOf(JSON.serialize(responseBody));
        System.debug(LoggingLevel.DEBUG, '** RestResponse Body **'+ responseBody);
        response.addHeader(CONTENT_TYPE, APP_JSON);
    }


    //response wrapper class
    private class SuccessResponseWrapper {
        Boolean isSuccess {get; set;}
        Object data {get; set;}
    }

    //response wrapper class
    private class ErrorResponseWrapper {
        Boolean isSuccess {get; set;}
        String error {get; set;}
    }


}