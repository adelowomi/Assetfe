function travelmodesCtrl ($scope, $http)
{
	
	$scope.newMode = {};
	$scope.newState ={};
	$scope.selectedCountry = {};
	$scope.travelModes = {};
		
	$scope.tran = {};
	
	$scope.toggleview = function(cid) {
			var $detailobj = $('div[cid='+cid.toString()+']');
            var state = $detailobj.attr('state');
			if(state == 'opened')
			{
				$detailobj.css('max-height', '0px');
				$detailobj.attr('state','closed');
				$('.companylistitems').css('background-color', '#ffffff');
			}
			else
			{
				$('.companylistitems').css('background-color', '#ffffff');
				$detailobj.css('max-height', '500px');
				$detailobj.attr('state','opened');
				$('li[cid='+cid.toString()+']').css('background-color', '#ededed');
			}
			$(this).fadeOut(200,function(){$(this).fadeIn(200);});
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
	
	$scope.deleteTravelMode = function (tid) {
		$.support.cors = true; //CountryName
		var datatosend = {TravelModeId: tid};
	
       var searchUrl = $scope.serviceURL2 + "/TravelModeDelete"
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
				if(results.d == 1)
				{
					$scope.getTravelModes();
					$scope.bindDelete();
				}
				console.log(results);
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
	

	  
	$scope.addTravelMode = function () {
		$.support.cors = true; //CountryName
		
		$scope.newMode.TransportCompanyId = 1
		var datatosend = {TransportCompanyId: $scope.newMode.TransportCompanyId, TravelMode: $scope.newMode.TravelMode, CreatedBy: $.session.get('userid')};
		
       var searchUrl = $scope.serviceURL + "/TravelModeAdd"
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
				$scope.newMode = {};
				$scope.getTravelModes();
				$scope.bindDelete();
				//$scope.$apply();
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
	$scope.getTravelModes(); $scope.bindDelete();}, 1000);
	//---------------------------------------------------
	$scope.updateCountryList = function()
	{
		$('.chosen-select').trigger('chosen:updated');
		$scope.$apply();
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
				$scope.bindDelete();
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
	
	
	///----------------------------------------------
	
	$scope.bindDelete = function()
	{
		$('.delete-travelmode').click(function(e) {
            var $tid = $(this).attr('tid');
			$scope.deleteTravelMode($tid);
        });
	}
	
	$(document).ready(function(e) {
		
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
			$scope.getTerminalsbyTransportCompany();
			setTimeout(function(){
			$('a.delete-terminal>i.cancelitem').click(function(e) {
				var $tid = $(this).attr('tid');
				$scope.deleteTerminal($tid);
        	});
			}, 500);
        });
		
		
    });

}