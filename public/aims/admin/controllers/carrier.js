function carrierCtrl ($scope, $http)
{
	
	$scope.newCarrier = {};
	$scope.newState ={};
	$scope.selectedCountry = {};
		
	$scope.tran = {};
	
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
	
		$scope.deleteTerminal = function (tid) {
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
	

	  
	$scope.addCarrier = function () {
		$.support.cors = true; //CountryName
		
		$scope.newCarrier.TransportCompanyId = $('#selectCompany').val();
		var $ac = $('#chkAC').prop('checked');
		var datatosend = {TransportCompanyId:  $scope.newCarrier.TransportCompanyId, CarrierName: $scope.newCarrier.CarrierName, CarrierModel: $scope.newCarrier.CarrierModel //
		   , CarrierNoOfSeats: $scope.newCarrier.CarrierNoOfSeats, CarrierNoOfSeatsPaidFor: $scope.newCarrier.CarrierNoOfSeatsPaidFor //
		   , CarrierRegNo: $scope.newCarrier.CarrierRegNo, CarrierDescription: $scope.newCarrier.CarrierDescription //
		   , CarrierACWorking: $ac, CreatedBy: $.session.get('userid')};
		
		
       var searchUrl = $scope.serviceURL + "/CarrierAdd"
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
				$scope.newCarrier = {};
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
		
		$('input').iCheck({checkboxClass: 'icheckbox_square-blue',
              radioClass: 'iradio_square-blue',
              increaseArea: '20%'});
			  
		
			  
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
		
		$('#selectCompanyforTerminal').change(function(e) {
            $scope.selectedCompany.Id = $(this).val();
			$scope.getCarriers();
			setTimeout(function(){
				$scope.bindToggleview();
				$('a.delete-terminal>i.cancelitem').click(function(e) {
					var $tid = $(this).attr('tid');
					//$scope.deleteTerminal($tid);
				});
			}, 500);
        });
		
		
    });

}