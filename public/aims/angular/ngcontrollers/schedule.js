function scheduleCtrl ($scope, $http)
{
	$scope.travellers = {};
	$scope.travellerArray = [];
	$scope.routeResults = {};
	$scope.tripType = "0";
	$scope.searchParams = {};
	$scope.getStateCities();
	$scope.booking = {};
	$scope.booking.RouteId = [];
	$scope.booking.surname = [];
	$scope.booking.othernames = [];
	$scope.booking.NoOfPersons= 1;
	$scope.booking.TotalAmountDue = 0;
	$scope.selectedroute = {};
	$scope.travelModes = {};
	$scope.booking.SendSMS = true;
	$scope.booking.TermsAgreed = false;
	$scope.booking.TripType = "1";
	$scope.booking.transportCompanyId = 1;
	$scope.booking.MobileNo = "";
	$scope.booking.EmailAddress = "";
	$scope.booking.InternationalPassportNo = "000";
	$scope.currentView = 1;
	$scope.successData = {};
	
	if($.session.get('loggedon') == "1")
	{
		var b = {Surname: $scope.user.SurName, Othernames: $scope.user.OtherNames, Mobile: $scope.user.Mobile};
		$scope.travellerArray.push(b);
		$scope.travellers = $scope.travellerArray;
		$scope.booking.surname[0] = $scope.user.SurName;
		$scope.booking.othernames[0] = $scope.user.OtherNames;
		setTimeout(function(){
		$scope.$apply();}, 3000);
	}
	
	
	
	
    	$('input').iCheck({checkboxClass: 'icheckbox_square-blue',
              radioClass: 'iradio_square-blue',
              increaseArea: '20%'});
			  jQuery('.datecontrol').datetimepicker({timepicker: false, format: 'd/m/Y'});
			  
	
	$.getScript( "plugin/chosen/chosen.jquery.min.js", function( data, textStatus, jqxhr ) {
		  console.log( "Chosen Load was performed." );
		  
		  $.getScript( "plugin/chosen/docsupport/prism.js", function( data, textStatus, jqxhr ) {
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
				}
			});
	}); //chosen/docsupport/prism.js
	
	$scope.refreshAccordion = function()
	{
		$('.datasection>.accordiontrigger').click(function(e) {
            var state = $(this).attr('state');
			var owner = $(this).attr('owner');
			if(state == 'opened')
			{
				$('#'+owner).css('max-height', '50px');
				$('#'+owner).css('overflow-y', 'hidden');
				//overflow:
				$(this).attr('state','closed');
				$(this).css('background-image', 'url(images/plus.png)');
			}
			else
			{
				$('#'+owner).css('max-height', '1500px');
				$('#'+owner).css('overflow-y', 'scroll');
				$(this).attr('state','opened');
				$(this).css('background-image', 'url(images/minus.png)');				
			}
			$(this).fadeOut(200,function(){$(this).fadeIn(200);});
        });
	}
	
/// ---------------------------------------------------	
	$scope.searchRoutes = function(){
		$.support.cors = true; //CountryName
		$scope.tripType = $('input[name=triptype]').val();
		if($scope.tripType == "1")
		{
			$scope.searchParams.fromStateId = parseInt($('#onewayfrom').val(), 10);
			$scope.searchParams.toStateId = parseInt($('#onewayto').val(), 10);
		}
		else if($scope.tripType == "2")
		{
			$scope.searchParams.fromStateId = $('#roundtripfrom').val();
			$scope.searchParams.toStateId = $('#roundtripto').val();
		}
		
		var d1 = new Date();
		d1 = Date.parseExact($scope.searchParams.departuredate,'d/M/yyyy');
		$scope.booking.TravelDate = d1;
		var datatosend = {FromStateId: $scope.searchParams.fromStateId, ToStateId: $scope.searchParams.toStateId, DepartureDate: d1};
	//var datatosend = {};
       var searchUrl = $scope.serviceURL2 + "/RoutesSearch"
	  //var searchUrl = "http://localhost:1336/RoutesSearch";
       $.ajax({
           url : searchUrl, type: "POST",
           dataType : "json",
           crossDomain: true,
           ifModified: true,
           cache:true, 
		   data: JSON.stringify(datatosend),
           contentType: "application/json; charset=utf-8",
           beforeSend: function () {
               return true;
           }
       }).done(function(results){
	  		   	$scope.routeResults = {};
				$scope.routeResults = results.d;
				if($scope.routeResults != null)
				{
					for(var i = 0; i < $scope.routeResults.length; i++)
					{
						$scope.routeResults[i].Routes2 = JSON.parse($scope.routeResults[i].Routes);
						for (var j = 0; j < $scope.routeResults[i].Routes2.length; j++)
						{
							$scope.routeResults[i].Routes2[j].DepartureDate2 = new Date(parseInt($scope.routeResults[i].Routes2[j].DepartureDate.substr(6))); 
						}
						//();
						console.log($scope.routeResults[i].Routes2);
					}
				}
				//console.log(results);
				$scope.$apply();
				$scope.refreshAccordion();
				$("html, body").animate({ scrollTop: 300 }, "slow");
				//bind book now click event
				$('button.bookingtrigger').click(function(e) {
					$refid = $(this).attr('ref');
					$scope.advance(2,$refid);
					//
					$fare = $(this).attr('fare');
					$scope.booking.AmountPerHead = $fare;
					
					$triptype = $('input[name=triptype]').val();
					$scope.booking.TripType = $triptype;
					$scope.booking.TripTypeLabel = $('label.triptypelabels[for=' + $triptype +']').text();
					//
					$travelmode = $('input[name=travelmode]').val();
					$scope.booking.TripMode = $travelmode;
					$scope.booking.TripModeLabel = $('label.tripmodelabels[for='+ $travelmode +']').text();
					
					$scope.booking.transportCompanyId = $(this).attr('tcid');
					//fetch embedded data
					$scope.selectedroute.TransportCompanyName = $(this).attr('tcname');
					$scope.selectedroute.TransportCompanyAcronym = $(this).attr('tcaccr');
					$scope.selectedroute.TransportCompanyId = $(this).attr('tcid');
					$scope.selectedroute.Fare = $(this).attr('fare');
					$scope.selectedroute.CarrierName = $(this).attr('cname');
					$scope.selectedroute.CarrierDescription = $(this).attr('cdescr');
					$scope.selectedroute.FromCity = $(this).attr('cfrom');
					$scope.selectedroute.ToCity = $(this).attr('cto');
					$scope.selectedroute.DepartureDate = $(this).attr('cdate');

					
				});
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
	 
   
//------------------------------------	
	$(document).ready(function() {

		$('input[name=triptype]').on('ifChecked', function(event){
 		var $t = $(this).attr('ref');
			$('.triptypeviews').fadeOut(function(){$('#'+ $t).fadeIn();});
			
		});
		
		$('body').attr('unselectable','on')
     .css({'-moz-user-select':'-moz-none',
           '-moz-user-select':'none',
           '-o-user-select':'none',
           '-khtml-user-select':'none', /* you could also put this in a class */
           '-webkit-user-select':'none',/* and add the CSS class here instead */
           '-ms-user-select':'none',
           'user-select':'none'
     }).bind('selectstart', function(){ return false; });
		
        
	
		$('#aftertravellers').click(function(e) {
				$scope.advance(3);
        });


		$(".numericonly").keydown(function (e) {
			// Allow: backspace, delete, tab, escape, enter and .
			if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
				 // Allow: Ctrl+A
				(e.keyCode == 65 && e.ctrlKey === true) || 
				 // Allow: home, end, left, right
				(e.keyCode >= 35 && e.keyCode <= 39)) {
					 // let it happen, don't do anything
					 return;
			}
			// Ensure that it is a number and stop the keypress
			if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
				e.preventDefault();
			}
			
		});
		
		$('.numericonly').blur(function(e) {
            if( $(this).val().trim() == "0" || $(this).val().trim() == "" || parseInt($(this).val().trim(), 10) <= 0)
			{
				$(this).val(1);
			}
        });
		
		$('#travellers').blur(function(e) {
            $scope.verifyTravellerControls(false);
			
        });
		
		
		$('#plus').click(function(e) {
            var $travellers = $('#travellers').val();
			$('#travellers').val(parseInt($travellers, 10) + 1);
			$scope.computeFares(parseInt($travellers, 10) + 1);
			$('#plus').fadeOut(200,function(){$('#plus').fadeIn(200);});
			$scope.addTraveller();
			
        });
		
		$('#minus').click(function(e) {
            var $travellers = $('#travellers').val();
			if(parseInt($travellers, 10) > 1)
			{
				$('#travellers').val(parseInt($travellers, 10) - 1);
				$scope.computeFares(parseInt($travellers, 10) - 1);
			}
			$(this).fadeOut(200,function(){$(this).fadeIn(200);});
			$scope.removeTraveller();
			
        });		
		
		$scope.refreshAccordion();	
		
		//-------------typeahead ----------------------
		
		 
		/*var states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California',
		  'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii',
		  'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
		  'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
		  'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
		  'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota',
		  'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island',
		  'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
		  'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
		];
		 
		var subjects = ['PHP', 'MySQL', 'SQL', 'PostgreSQL', 'HTML', 'CSS', 'HTML5', 'CSS3', 'JSON'];   
		$('.typeahead').typeahead({source: states}) */
		
		
		
		

		
		
	});
	
	$scope.computeFares = function(n)
	{
		
		$scope.booking.NoOfPersons = parseInt(n,10);
		$scope.booking.TotalAmountDue = $scope.booking.NoOfPersons * parseFloat($scope.booking.AmountPerHead).toFixed(2);
		console.log($scope.booking.TotalAmountDue);
		
	}

	$scope.advance = function(nextview, routeId){
		if(routeId != undefined)
		{
			$scope.booking.RouteId[0] = routeId;
		}
		
		$scope.currentView = nextview;
		
		$('.clssection').fadeOut(500, function(){
				$('#step'+nextview.toString()).fadeIn();
				$("html, body").animate({ scrollTop: 0 }, "slow");
			});
		
		}
		
	$scope.addTraveller = function(){
		$scope.incrementTraveller();
		$scope.$apply();
		}
	$scope.removeTraveller = function(){
			$scope.verifyTravellerControls(false);
		}
		
	$scope.incrementTraveller = function()	{
		var b = {Surname: '', Othernames: '', Mobile: ''};
		$scope.travellerArray.push(b);
		$scope.travellers = $scope.travellerArray;
	}

	if($.session.get('loggedon') != "1")
	{
		$scope.incrementTraveller();
	}
	$scope.computeFares();

	$scope.verifyTravellerControls = function(a){
		$scope.travellers = {};
		$scope.travellerArray.length = 0;
		var nTravellers = $('#travellers').val();

		for(var i = 1; i<= parseInt(nTravellers, 10); i++)
		{
			$scope.incrementTraveller();
		}
		$scope.computeFares(nTravellers);
		if(a != undefined)
		{
			if(!a) $scope.$apply();
		}
		//$scope.$apply();
	}
	
	/// ---------------------------------------------------
	
	$scope.getTravelModes = function () {
		$.support.cors = true;
       	var searchUrl = $scope.serviceURL2 + "/TravelModesGet"
       	$.ajax({
           url : searchUrl, type: "POST",
           dataType : "json",
           crossDomain:true,
           ifModified: true,
           cache:true, 
		   data: "{}",
           contentType: "application/json; charset=utf-8",
           beforeSend: function () {
               return true;
           }
       }).done(function(results){
				console.log(results);
				$scope.travelModes={};
				$scope.travelModes = JSON.parse(results.d);
				$scope.$apply();
				$('input[name=travelmode]').iCheck({checkboxClass: 'icheckbox_square-blue',
              radioClass: 'iradio_square-blue',
              increaseArea: '20%'});
				//$scope.bindDelete();
				//$scope.updateChosenList();
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
	$scope.getTravelModes();}, 500);
	
	///----------------------------------------------
	
	$scope.completeBooking = function(){
		$scope.booking.SendSMS = $('#chksms').prop('checked');
		$scope.booking.TermsAgreed = $('#chkterms').prop('checked');
		
		if(!$scope.booking.TermsAgreed)
		{
			alert('You need to agree to terms before you can continue');
			return;
		}
		
		$scope.booking.EmailAddress = $scope.user.email;
		$scope.booking.MobileNo = $scope.user.phone;
		
		
		$.support.cors = true;
		var searchUrl = $scope.serviceURL + "/BookingPassengerAdd"
		var datatosend = {transportCompanyId: $scope.booking.transportCompanyId, RouteId: $scope.booking.RouteId, 
			Surname: $scope.booking.surname, OtherNames: $scope.booking.othernames, MobileNo: $scope.user.phone,
			EmailAddress: $scope.user.email, InternationalPassportNo: '0000', CountryId: 166, 
			TripType: $scope.booking.TripType, TravelDate: $scope.booking.TravelDate, NoOfPersons: $scope.booking.NoOfPersons,
			AmountPerHead: $scope.selectedroute.Fare, ConvinienceCharge: 100.00, SendSMS: $scope.booking.SendSMS,
			TermsAgreed: $scope.booking.TermsAgreed, CreatedBy: $scope.user.id};
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
				if(results.d != null)
				{
					$.session.set('booking', null);
					$scope.currentView = 1;


					$scope.successData = results.d[0];
					$scope.successData.FromCity = $scope.selectedroute.FromCity;
					$scope.successData.ToCity = $scope.selectedroute.ToCity;
					$scope.successData.TripType = $scope.booking.TripTypeLabel;
					$scope.successData.TravelMode = $scope.booking.TripModeLabel;
					$scope.successData.DepartureDate = $scope.selectedroute.DepartureDate;
					$scope.successData.TravelCompany = $scope.selectedroute.TransportCompanyName;

					$scope.booking = {};
					$scope.selectedroute = {};
					$scope.advance(4);
				}
				else
				{
					alert('There was an error while processing your request. Please try again later.');
				}
				
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
	
	//----------------------------------------
	
	$scope.finishPayment = function()
	{
		
		$.support.cors = true;
       	var searchUrl = "reports/rptBookonHold_Bank.php"
		var fullname = $scope.successData.Surname + ' ' + $scope.successData.OtherNames
		var expiryDate = $scope.getDateFromJSON($scope.successData.expiryDate);
		expiryDate = expiryDate.toString('d-MMM-yyyy') + ' ' + expiryDate.toString('HH:mm');
		var TotalAmount = ($scope.successData.AmountPerHead * $scope.successData.NoOfPersons) + $scope.successData.ConvinienceCharge;
		var bookingDate = $scope.getDateFromJSON($scope.successData.DateCreated);
		bookingDate = bookingDate.toString('d-MMM-yyyy');
		
		var d = {ReferenceCode: $scope.successData.transactionCode.toUpperCase(), Amount: TotalAmount, ExpiryDate: expiryDate, 
			Name: fullname, Email: $scope.successData.EmailAddress, Phone: $scope.successData.MobileNo, BookingDate: bookingDate, 
			DepartureTerminal: $scope.successData.FromCity, ArrivalTerminal: $scope.successData.ToCity, TripType: $scope.successData.TripType,
			TravelMode: $scope.successData.TravelMode, Travellers: $scope.successData.NoOfPersons, DepartureDateTime: $scope.successData.DepartureDate,
			Company: $scope.successData.TravelCompany};
			
			$http({
        method  : 'POST',
        url     : searchUrl,
        data    : $.param(d),  // pass in data as strings
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
    	})
        .success(function(data) {
          console.log(data);
				if(data == 1)
				{
					window.location.href = "reports/" + d.ReferenceCode+".pdf";
					//$scope.advance(4);
				}
				else
				{
					alert('There was an error while processing your request. Please try again later.');
				}
      
        }).error(function(){
			alert('Server error! Please restart and retry.');
			
			});
			
		
	}
	// --------------------------
	
	$scope.getDateFromJSON = function(JSONText)
	{
		return new Date(parseInt(JSONText.substr(6))); 
	}
	
	//--------------
	
	/* RESET FORM TO PREVIOUS STATE*/
	if(($.session.get('booking') != undefined) && ($.session.get('booking') != "[object Object]") && ($.session.get('booking') != "null"))
	{
		$scope.booking = JSON.parse($.session.get('booking'));
		$scope.selectedroute = JSON.parse($.session.get('selectedroute'));
		$scope.currentView = $.session.get('currentview');
		if($scope.booking.NoOfPersons != null && $scope.booking.NoOfPersons != "")
		{
			$('#travellers').val($scope.booking.NoOfPersons);
		}
		else
		{
			$('#travellers').val(1);
		}
		$scope.verifyTravellerControls(true);
		$scope.advance($scope.currentView);
		setTimeout(function(){
		$scope.$apply();}, 2000);
	}
	//--------------
	
	setInterval(function(){
		$.session.set('booking', JSON.stringify($scope.booking));
		$.session.set('selectedroute', JSON.stringify($scope.selectedroute));
		$.session.set('currentview', $scope.currentView.toString());
		}, 1000);

}