public class InvocableUserProvisioning
{
    @InvocableMethod
    public static void AutoProvisionCustomerCommunityPlusUser()
    {


Account acc = new Account();
acc.Name = 'Partner User Test';
insert acc;

Contact con = new Contact();
con.AccountId = acc.Id;
con.FirstName = 'Partner';
con.LastName = 'User Test';
insert con;



User u = new user();
u.FirstName = 'Partner';
u.LastName = 'User Test';
u.Email = 'amitabbi@hotmail.com';
u.Alias = 'Tcode15';
u.Username = 'testpartneruser12345@test.com';
u.ContactId = con.Id;
u.CommunityNickname = 'test145';
u.LocaleSidKey = 'en_US';
u.TimeZoneSidKey = 'GMT';
u.profileId = '00e0o0000023NAr';
u.LanguageLocaleKey = 'en_US';
u.EmailEncodingKey = 'UTF-8';
insert u;
   }
}