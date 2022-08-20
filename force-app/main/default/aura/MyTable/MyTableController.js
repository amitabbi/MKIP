({
    init: function (cmp, event, helper) {

        var actions = [
            { label: 'Show details', name: 'show_details' },
            { label: 'Delete', name: 'delete' }
        ]

        cmp.set('v.columns', [
            {label: 'Account name', fieldName: 'Name', type: 'text'},
            {label: 'Phone', fieldName: 'Phone', type: 'text'},
            { type: 'action', typeAttributes: { rowActions: actions } },
            
        ]);


        var action = cmp.get("c.fetchTableData");
        action.setParams({  });
        // the server-side action returns
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                console.log("My Response is " + response.getReturnValue())
                cmp.set('v.data', response.getReturnValue());
 
                // You would typically fire a event here to trigger
                // client-side notification that the server-side
                // action is complete
            }
            
        });
        $A.enqueueAction(action);


   


      
    },
    handleRowAction: function (cmp, event, helper) {
        var action = event.getParam('action');
        var row = event.getParam('row');

        switch (action.name) {
            case 'show_details':
                //alert('Showing Details: ' + JSON.stringify(row));
                
                var rows = cmp.get('v.data');
                var rowIndex = rows.indexOf(row);

                var navEvt = $A.get("e.force:navigateToSObject");
    navEvt.setParams({
      "recordId": row.Id

    });
    navEvt.fire();
                break;
            case 'delete':
                //helper.removeBook(cmp, row);
                break;
        }

     
    }
})