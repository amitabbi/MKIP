({

	//Onload of the the tab
	doInit: function (component, event, helper) {


	},

	//Onload of the the tab
	doTabInit: function (c, e, h) {
		//c.set('v.showSpinner', true);
		// get name of the tab

		// case status
		var casestatusoptions = [];
		var finalResultCaseStatus = c.get('c.getPicklistValues');
		finalResultCaseStatus.setParams({
			objectName: 'Case',
			picklistFieldName: 'Status'
		});
		finalResultCaseStatus.setCallback(this, function (re) {
			if (re.getState() == "SUCCESS") {
				var caseStatus = re.getReturnValue();
				Object.keys(caseStatus).forEach(function (f) {
					casestatusoptions.push({
						value: caseStatus[f],
						label: f
					});
				});
				c.set('v.casestatusoptions', casestatusoptions);
			}
		});
		$A.enqueueAction(finalResultCaseStatus);


	},
	//Onload of the the tab
	searchCaseAction: function (component, event, helper) {
        
        var pageSize = component.get("v.pageSize");

		var getCaseAction = component.get('c.GetCases');
		getCaseAction.setParams({
				CStatus: component.find("CaseStatus").get("v.value")
            });
            getCaseAction.setCallback(this, function (res) {
                if (res.getState() === "SUCCESS") {
                    var caseList = JSON.parse(res.getReturnValue());
                    if (caseList != null) {
						component.set('v.caselist', caseList);

						component.set("v.totalRecords", component.get("v.caselist").length);
						component.set("v.startPage",0);
						component.set("v.endPage",pageSize-1);
						var pagList = [];
						for(var i=0; i< pageSize; i++)

						{

                            pagList.push(res.getReturnValue()[i]);

						}

						component.set('v.PaginationList', pagList);
                    }
                }
                //c.set('v.showSpinner', false);
            });
            $A.enqueueAction(getCaseAction);

			component.set("v.searchClicked", true);

	},
	next : function(component, event){
        var sObjectList = component.get("v.caselist");
        console.log('Next sObjectList==>'+sObjectList);
        var end = component.get("v.endPage");
        var start = component.get("v.startPage");
        var pageSize = component.get("v.pageSize");
        var Paginationlist = [];
        var counter = 0;
        for(var i=end+1; i<end+pageSize+1; i++)
            {
                if(sObjectList.length > i){
                    Paginationlist.push(sObjectList[i]);
                }
                counter ++ ;
            }
            start = start + counter;
            end = end + counter;
            component.set("v.startPage",start);
            component.set("v.endPage",end);
            console.log('Next Paginationlist==>'+Paginationlist);
            component.set('v.PaginationList', Paginationlist);
    },
    
    /*
     * Method will be called when use clicks on previous button and performs the 
     * calculation to show the previous set of records
     */
    previous : function(component, event){
        var sObjectList = component.get("v.caselist");
        console.log('Previous sObjectList==>'+sObjectList);
        var end = component.get("v.endPage");
        var start = component.get("v.startPage");
        var pageSize = component.get("v.pageSize");
        var Paginationlist = [];
        var counter = 0;
        for(var i= start-pageSize; i < start ; i++)
            {
                if(i > -1){
                    Paginationlist.push(sObjectList[i]);
                    counter ++;
                }else{
                    start++;
                }
            }
        start = start - counter;
        end = end - counter;
        component.set("v.startPage",start);
        component.set("v.endPage",end);
        console.log('Previous Paginationlist==>'+Paginationlist);
        component.set('v.PaginationList', Paginationlist);
    }
})