function placesCtrl ($scope, $http)
{
	
	$scope.newCountry = {};
	$scope.newState ={};
	$scope.selectedCountry = {};
		
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
	
	
	
	//--------------------------------------------
	

	  
	$scope.addCountry = function () {
		$.support.cors = true; //CountryName
       var searchUrl = $scope.serviceURL + "/NationalityAdd"
       $.ajax({
           url : searchUrl, type: "POST",
           dataType : "json",
           crossDomain:true,
           ifModified: true,
           cache:true, 
		   data: "{CountryName: '"+ $scope.newCountry.CountryName+ "'}",
           contentType: "application/json; charset=utf-8",
           beforeSend: function () {
               return true;
           }
       }).done(function(results){
				console.log(results);
				$scope.getCountries();
				$scope.newCountry = {};
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
	$scope.getCountries();},2000);
	//---------------------------------------------------
	$scope.updateCountryList = function()
	{
		$('.chosen-select').trigger('chosen:updated');
		$scope.$apply();
	}
	///----------------------------------------------
	
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
    });

}