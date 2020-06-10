function AppCtrl ($scope, $http)
{
    //$scope.serviceURL = "../webservices/ip1.asmx";
    $scope.serviceURL = "http://localhost:3361/webservices/ip1.asmx";
	$scope.serviceURL2 = "http://184.107.228.154/travelliteExtras/travellite.asmx";
	$scope.tran = {};
	$scope.searchlist = {};
	$scope.tranupdates = {};
	$scope.regions = {};
	$scope.users = {};
	$scope.selecteduser = {};
	$scope.selectedclient = {};
	$scope.statement ={};
	$scope.smsbalance = 0;
	$scope.pageheading = "";
	$scope.states = {};
	$scope.statescities = {};
	$scope.selectedcountry = {};
	
	$scope.user = {};
	$scope.user.id = "-1";
	$scope.user.email = "-";
	$scope.user.phone = "-";
	
	if($.session.get('loggedon') == '1')
	{
		$scope.user = JSON.parse($.session.get('user'));
		$.session.set('userid', $scope.user.id);
		$scope.user.id = $.session.get('userid');
		$scope.user.email = $scope.user.Email;
		$scope.user.phone = $scope.user.Mobile;
	}
	
	closeMenu();
	$scope.disableformbutton = function()
	{
		
		$('#mainsubmit').addClass('working')
			.attr('disabled', 'true').val('WAIT ...');
	}
	$scope.enableformbutton = function()
	{
		$('#mainsubmit').removeClass('working').removeAttr('disabled').val('SUBMIT');
	}
	
	$scope.scollEmpower = function()
	{
		$('#empower1').jSlots({time:10000, loops:3});
			$('#empower2').jSlots({time:10000, loops:3, isDebug:false});
	}
	


//---------------------
	$scope.fixRights = function()
	{
		setTimeout(function(){
			for(var i = 0; i< $scope.selecteduser.rights.length; i++)
			{
				if($scope.selecteduser.rights[i].checked == 'checked')
				{
					$('input[menuid='+$scope.selecteduser.rights[i].menuid+']').attr("checked", "1");
				}
			}
			
			$('input.rights').change(function(){
			$menuid = $(this).attr('menuid');
			$permit = 0;
			if($(this).prop("checked"))
			{
				$permit = 1;
			}
			transact($menuid, $permit);
			});
	
			
		}, 1000);

	}
	
	//---------------
	$scope.getStateCities = function(callback)
	{
		//
		$.support.cors = true;
       var searchUrl = $scope.serviceURL2 + "/StateCities"
	  // $scope.selectedcountry.id = 166; //remove later
	  // var datatosend = {NationalityId: $scope.selectedcountry.id};
       $.ajax({
           url : searchUrl, type: "POST",
           dataType : "json",
           crossDomain:true,
           ifModified: true,
           cache:true, 
		   data: {},
           contentType: "application/json; charset=utf-8",
           beforeSend: function () {
               return true;
           }
       }).done(function(results){
				console.log(results);
				$scope.statescities = {};
				$scope.statescities = JSON.parse(results.d);
				
				$scope.$apply();
				$scope.updateChosenList();
				if(callback != undefined) callback();
           }
       ).fail(function(jpXHR, textStatus, thrownError){
               console.log("--------------------");
               console.log(textStatus);
               console.log(jpXHR);
               console.log(thrownError);
               console.log("--------------------");
           }
       );
	}
//------------

	$scope.getStates = function(callback)
	{
		
		$.support.cors = true;
       var searchUrl = $scope.serviceURL + "/StateOfOriginList"
	   $scope.selectedcountry.id = 166; //remove later
	   var datatosend = {NationalityId: $scope.selectedcountry.id};
       $.ajax({
           url : searchUrl, type: "POST",
           dataType : "json",
           crossDomain:true,
           ifModified: true,
           cache:true, 
		   data: $scope.selectedcountry.id,
           contentType: "application/json; charset=utf-8",
           beforeSend: function () {
               return true;
           }
       }).done(function(results){
				console.log(results);
				$scope.states = {};
				$scope.states = results.d;
				
				$scope.$apply();
				if(callback != undefined) callback();
           }
       ).fail(function(jpXHR, textStatus, thrownError){
               console.log("--------------------");
               console.log(textStatus);
               console.log(jpXHR);
               console.log(thrownError);
               console.log("--------------------");
           }
       );
		
		//166
	}

//-----------------


//--------------------------------------------
	
	$scope.updateChosenList = function()
	{
		$('.chosen-select').trigger('chosen:updated');
		$scope.$apply();
	}
	///----------------------------------------------


	





	

}