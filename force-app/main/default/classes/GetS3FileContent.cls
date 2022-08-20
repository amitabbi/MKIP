public class GetS3FileContent{
    @AuraEnabled(cacheable=True)
    public static String getS3FileContent(String filename) {
        Blob bodyBlob = null;

        filename = 'VaccinationCert.pdf';
        HttpRequest request = new HttpRequest();
        request.setEndpoint('callout:NC_AWS_S3/dev/awssfappbucket/' + filename);
        request.setMethod('GET');
        request.setHeader('Content-Type','application/octet-stream');
        Http http = new Http();
        HTTPResponse response = http.send(request);
        if(response.getStatusCode() == 200) {
        System.debug(response.getBody());
        //System.debug(response.getStatus());
        }
        //bodyBlob = EncodingUtil.Base64Encode(blob.valueof(response.getBody()));
        //String name = '{B]@i%s*w:?,-a$j#e)e(t! S^a.m}a]l[';
        //String respbody = response.getBody().replaceAll('[^a-zA-Z0-9\\s+]', '');     
        //String base64Content = ( String ) JSON.deserialize(respbody, String.class);
        //bodyBlob = Encodingutil.base64Decode(base64Content);
        //System.debug('bodyBlob' + bodyBlob);
        
        //bodyBlob = response.getBodyAsBlob();
        //return bodyBlob;
        String imageURL = 'https://id0rhkia1d.execute-api.ap-southeast-2.amazonaws.com/dev/awssfappbucket/' + filename;
        return imageURL;
    }

}