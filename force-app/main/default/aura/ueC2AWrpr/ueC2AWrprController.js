({
    handleRefreshThisCompo: function(component, event) {
        var shouldWeRefresh = event.getParam('isSuccess');
        if(shouldWeRefresh)
        {
            console.log('hiiiii');

            // Method 1
            //$A.get('e.force:refreshView').fire();
            
            // Method 2
            //alert('hi');
            
            //clear body of host component just in case
            // var hostComponent = component.find("c2aComp");
            // hostComponent.set("v.body", []);

            // debugger;

            // $A.createComponent(
            //     'c:ueC2A', {
            //     "recordId": component.get("v.recordId"),
            //     "onrefreshthiscompo":component.getReference("c.handleRefreshThisCompo"),
            //     "aura:id": "c2aComp"
            //     },
            //     function (newComponent, status, errorMessage) {
            //         Add the new button to the body array
            //         if (status === "SUCCESS") {
            //             var body = hostComponent.get("v.body");
            //             body.push(newComponent);
            //             hostComponent.set("v.body", body);
            //         } else if (status === "INCOMPLETE") {
            //             console.log("No response from server or client is offline.");
            //         } else if (status === "ERROR") {
            //             console.log("Error: " + errorMessage);
            //         }
            //     }
            // );

            //Method 3
            window.location.reload();
        }
    },
})