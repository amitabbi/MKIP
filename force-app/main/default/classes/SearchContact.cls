global with sharing class SearchContact {
    @AuraEnabled
    public static Contact SearchContact(String searchKey) {

        return [
            SELECT Id, Phone, Email
            FROM Contact
            WHERE Email = :searchKey
            LIMIT 1
        ];

    }
}