global class OrgCacheBatchScheduled implements Schedulable

{

     global void execute(SchedulableContext sc)

     {

        OrgCacheBatch b = new OrgCacheBatch(); // Your batch class

       database.executeBatch(b);

     }

}