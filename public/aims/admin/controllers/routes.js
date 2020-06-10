function routeCtrl ($scope, $http)
{
	$scope.newRoute = {};
	$scope.newRoute.NoOfSeatsReserved = 1;
	
	$scope.bindToggleview = function() {
		$('a.carrier-heading').click(function(e) {
			var $cid = $(this).attr('cid');
			
			var $detailobj = $('li[cid='+$cid.toString()+']');
            var state = $detailobj.attr('state');
			if(state == 'opened')
			{
				$detailobj.css('max-height', '43px');
				$detailobj.attr('state','closed');
				//$('.companylistitems').css('background-color', '#ffffff');
			}
			else
			{
				//$('.companylistitems').css('background-color', '#ffffff');
				$detailobj.css('max-height', '500px');
				$detailobj.attr('state','opened');
				//$('li[cid='+cid.toString()+']').css('background-color', '#ededed');
			}
			$(this).fadeOut(200,function(){$(this).fadeIn(200);});
            
        });
			
        }
		
		////------------------------------------------------
		
		$.getScript( "../plugin/chosen/chosen.jquery.min.js", function( data, textStatus, jqxhr ) {
		  console.log( "Chosen Load was performed." );
		  
		  $.getScript( "../plugin/chosen/docsupport/prism.js", function( data, textStatus, jqxhr ) {
		  console.log( "Prism Load was performed." );
			  var config = {
					'.chosen-select': { display_selected_options: false },
					'.chosen-select-deselect': { allow_single_deselect: true },
					'.chosen-select-no-single': { disable_search_threshold: 10 },
					'.chosen-select-no-results': { no_results_text: 'Oops, nothing found!' },
					'.chosen-select-width': { width: "95%" }
				}
				for (var selector in config) {
					$(selector).chosen(config[selector]);
				}//$('.my_select_box').trigger('chosen:updated');
			});
	}); 
	/// ---------------------------------------------------
	
		$scope.deleteRoute = function (tid) {
		$.support.cors = true; //CountryName
	
       var searchUrl = $scope.serviceURL + "/TerminalsByIdDelete"
       $.ajax({
           url : searchUrl, type: "POST",
           dataType : "json",
           crossDomain:true,
           ifModified: true,
           cache:true, 
		   data: "{Id: '"+ tid.toString() +"'}",
           contentType: "application/json; charset=utf-8",
           beforeSend: function () {
               return true;
           }
       }).done(function(results){
	  		   	$scope.selectedCompany.Id = $('#selectCompanyforTerminal').val();
		   		$scope.getTerminalsbyTransportCompany();
				console.log(results);
				$scope.$apply();
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
	
	//-----------------------------------------------------
	

	  
	$scope.addRoute = function () {
		$.support.cors = true; //CountryName
		
		$scope.newRoute.TransportCompanyId = $('#selectCompany').val();
		$scope.newRoute.TravelModeId = $('#selectMode').val();
		$scope.newRoute.FromTerminalId = $('#selFromTerminal').val();
		$scope.newRoute.ToTerminalId = $('#selToTerminal').val();
		
		var d1 = new Date();
		d1 = Date.parseExact($scope.newRoute.departure.date,'d/M/yyyy');
		var d1_hour = $scope.newRoute.departure.time.toString().substring(0,2);
		var d1_minute = $scope.newRoute.departure.time.toString().substring(3,5);
		var d1_meridian = $scope.newRoute.departure.time.toString().substring(6,8);
		if(d1_meridian.toLowerCase() == 'pm') 
		{
			d1_hour = parseInt(d1_hour, 10) + 12;
		}
		d1.setHours(d1_hour, d1_minute);
		$scope.newRoute.DepartureDate =  d1;
		//$scope.newRoute.DepartureTime = $scope.newRoute.departure.time;
		$scope.newRoute.DepartureTime = d1_hour+ ':' + d1_minute;
		
		
		
		var d2 = new Date();
		d2 = Date.parseExact($scope.newRoute.arrival.date,'d/M/yyyy');
		var d2_hour = $scope.newRoute.arrival.time.toString().substring(0,2);
		var d2_minute = $scope.newRoute.arrival.time.toString().substring(3,5);
		var d2_meridian = $scope.newRoute.arrival.time.toString().substring(6,8);
		if(d2_meridian.toLowerCase() == 'pm') 
		{
			d2_hour = parseInt(d2_hour, 10) + 12;
		}
		d2.setHours(d2_hour, d2_minute);
		$scope.newRoute.ArrivalDate = d2;
		
		$scope.newRoute.CarrierId = $('#selCarrier').val();
		
		var datatosend = {TransportCompanyId:  $scope.newRoute.TransportCompanyId, TravelModeId: $scope.newRoute.TravelModeId, FromTerminalId: $scope.newRoute.FromTerminalId //
		   , ToTerminalId: $scope.newRoute.ToTerminalId, DepartureDate: $scope.newRoute.DepartureDate //
		   , DepartureTime: $scope.newRoute.DepartureTime, ArrivalDate: $scope.newRoute.ArrivalDate //
		   , CarrierId: $scope.newRoute.CarrierId, NoOfSeatsReserved: $scope.newRoute.NoOfSeatsReserved, RouteFare: $scope.newRoute.RouteFare, Stops: $scope.newRoute.Stops, //
		   CreatedBy: $.session.get('userid')};
		
		
       var searchUrl = $scope.serviceURL + "/RoutesAdd"
       $.ajax({
           url : searchUrl, type: "POST",
           dataType : "json",
           crossDomain:true,
           ifModified: true,
           cache:true, 
		   data: JSON.stringify(datatosend),
           contentType: "application/json; charset=utf-8",
           beforeSend: function () {
               return true;
           }
       }).done(function(results){
				console.log(results);
				$scope.newRoute = {};
				$scope.$apply();
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
	setTimeout(function(){
	$scope.getCountries(); $scope.getStates(); $scope.getCompanies();},1000);
	//---------------------------------------------------
	$scope.updateCountryList = function()
	{
		$('.chosen-select').trigger('chosen:updated');
		$scope.$apply();
	}
	///----------------------------------------------
	
	
	$(document).ready(function(e) {
		$.getScript( "js/numericonly.js", function( data, textStatus, jqxhr ) {});
		
		$('input').iCheck({checkboxClass: 'icheckbox_square-blue',
              radioClass: 'iradio_square-blue',
              increaseArea: '20%'});
		jQuery('.datecontrol').datetimepicker({timepicker: false, format: 'd/m/Y'});	  
		$('.timecontrol').timepicker();
		
			  
        $('#txtCompanySearch').keyup(function(e) {
			 var $searchText = $(this).val().toLowerCase();
            $('.coyname').each(function(index, element) {
                var $thisCoy = $(this).text().toLowerCase();
				var $cid = $(this).attr('cid');
				
				if ($thisCoy.indexOf($searchText) == -1) {
                	$('li[cid='+ $cid+']').fadeOut();
				}
				else {
					$('li[cid='+ $cid+']').fadeIn();
				}
            });
        });
		
		
		
		$('#selectCompany').change(function(e) {
            $scope.selectedCompany.Id = $(this).val();
			//var flow = require ('../plugin/flow');
			
			Deferred.next(function () {
				
			}).next(function () {
				$scope.getCarriers($scope.getTerminalsbyTransportCompany);
				
				}).next(function(){
						//$scope.getTerminalsbyTransportCompany();
				
					}).next(function () {
					
					setTimeout(function(){
						//$scope.$apply();
						$scope.updateChosenList();
						$scope.bindToggleview();
					},2000);
				});
	
			
        });
		
		$('#selectCompanyforRoutes').change(function(e) {
            $scope.selectedCompany.Id = $(this).val();
			
			$scope.getRoutes();
			var callbacks = [$scope.bindToggleview];
			setTimeout(function(){
//				$scope.bindToggleview();
				$('a.delete-terminal>i.cancelitem').click(function(e) {
					var $tid = $(this).attr('tid');
					//$scope.deleteTerminal($tid);
				});
			}, 500);
        });
		
		
    });

}