function trendCtrl ($scope, $http)
{

    $scope.current_asset = []; $scope.current_liabilities = []; $scope.inventory = [];
    $scope.fixed_asset = []; $scope.preferred_stock_div = [];
    $scope.preferred_stock = []; $scope.profit_before_tax = []; $scope.profit_before_int_nd_tax = []; 
    $scope.profit_after_tax = [];  $scope.equity = [];
    $scope.long_term_loans = []; $scope.gross_profit = []; $scope.sales = [];
    $scope.netcashflow = []; $scope.debtors = []; $scope.capitalexpenditures = [];
    
    $scope.analysisdescription = "";
    $scope.dynamicdata = {};
  /*  $scope.dynamicdata = {
        current_asset: [],
        current_liabilities: [],
        inventory: [],
    $scope.dynamicdata.fixed_asset = $scope.fixed_asset;
    $scope.dynamicdata.preferred_stock_div = $scope.preferred_stock_div;
    $scope.dynamicdata.preferred_stock = $scope.preferred_stock;
    $scope.dynamicdata.profit_before_tax = $scope.profit_before_tax;
    $scope.dynamicdata.profit_before_int_nd_tax = $scope.profit_before_int_nd_tax;
    $scope.dynamicdata.profit_after_tax = $scope.profit_after_tax;
    $scope.dynamicdata.equity = $scope.equity;
    $scope.dynamicdata.long_term_loans = $scope.long_term_loans;
    $scope.dynamicdata.gross_profit = $scope.gross_profit;
    $scope.dynamicdata.sales = $scope.sales;
    };
	*/

    $scope.span = [1 , 2, 3];
	$scope.newTerminal = {};
	$scope.newState ={};
	$scope.selectedCountry = {};
		
	$scope.tran = {};

	$scope.validateall = function () {
	    if ($scope.validatedata($scope.current_asset) == 0) return 0;
	    if ($scope.validatedata($scope.current_liabilities) == 0) return 0;
	    if ($scope.validatedata($scope.inventory) == 0) return 0;
	    if ($scope.validatedata($scope.fixed_asset) == 0) return 0;
	    if ($scope.validatedata($scope.preferred_stock_div) == 0) return 0;
	    if ($scope.validatedata($scope.preferred_stock) == 0) return 0;
	    if ($scope.validatedata($scope.profit_before_tax) == 0) return;
	   // if ($scope.validatedata($scope.profit_before_int_nd_tax) == 0) return 0;
	    if ($scope.validatedata($scope.profit_after_tax) == 0) return 0;
	    if ($scope.validatedata($scope.equity) == 0) return 0;
	    if ($scope.validatedata($scope.long_term_loans) == 0) return 0;
	    if ($scope.validatedata($scope.gross_profit) == 0) return 0;
	    if ($scope.validatedata($scope.sales) == 0) return 0;
	   
	    return 1;

	}

	$scope.validatedata = function (mydata) {

	    for (i = 0; i < $scope.span.length; i++) {
	        if (mydata[i] == "" || mydata.length <= 0 || mydata == undefined || mydata == null) {

	            alert('Some data is left unfilled. Please enter zero if you wish to leave the data blank!');
	            return 0;
	        }
	        else if (mydata[i] == 0 || mydata[i] == "0") {
	            mydata[i] = 1;
	        }

	    }
        return 1
	}


	$scope.startanalysis = function () {

	    if ($scope.validateall() == 0) return;

	    $scope.dynamicdata.current_asset = $scope.current_asset;
	    $scope.dynamicdata.current_liabilities = $scope.current_liabilities;
	    $scope.dynamicdata.inventory = $scope.inventory;
	    $scope.dynamicdata.fixed_asset = $scope.fixed_asset;
	    $scope.dynamicdata.preferred_stock_div = $scope.preferred_stock_div;
	    $scope.dynamicdata.preferred_stock = $scope.preferred_stock;
	    $scope.dynamicdata.profit_before_tax = $scope.profit_before_tax;
	    //$scope.dynamicdata.profit_before_int_nd_tax = $scope.profit_before_int_nd_tax;
	    $scope.dynamicdata.profit_after_tax = $scope.profit_after_tax;
	    $scope.dynamicdata.equity = $scope.equity;
	    $scope.dynamicdata.long_term_loans = $scope.long_term_loans;
	    $scope.dynamicdata.gross_profit = $scope.gross_profit;
	    $scope.dynamicdata.sales = $scope.sales;
	    $scope.dynamicdata.netcashflow = $scope.netcashflow;
	    $scope.dynamicdata.capitalexpenditures = $scope.capitalexpenditures;
	    $scope.dynamicdata.debtors = $scope.debtors;



	    $.support.cors = true; //CountryName
	    var datatosend = {
	        userid: $scope.userid, companyId: $scope.companyId, description: $scope.analysisdescription,
	        period: $scope.span.length, data: $scope.dynamicdata
	    };

	
	    var searchUrl = $scope.serviceURL + "/TrendAnalysis"
	    $.ajax({
	        url: searchUrl, type: "POST",
	        dataType: "json",
	        crossDomain: true,
	        ifModified: true,
	        cache: true,
	        data: JSON.stringify(datatosend),
	        contentType: "application/json; charset=utf-8",
	        beforeSend: function () {
	            return true;
	        }
	    }).done(function (results) {
	        console.log(results);
	      
	    }
        ).fail(function (jpXHR, textStatus, thrownError) {
            alert('An error occurred, please try again after some time.');
            console.log("--------------------");
            console.log(textStatus);
            console.log(jpXHR);
            console.log(thrownError);
            console.log("--------------------");
        }
        );
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
	
	
	
	//-----------------------------------------------------
	

	  
	
	setTimeout(function(){$scope.getCompanies();},1000);
	//---------------------------------------------------
	$scope.updateCountryList = function()
	{
		$('.chosen-select').trigger('chosen:updated');
		$scope.$apply();
	}
	///----------------------------------------------
	
	$scope.proceed = function () {
	    $scope.companyId = parseInt($('#selectCompany').val(), 10);

	    if ($scope.companyId <= 0) {
	        alert('You need to select a company before you can continue.');
	    }
	    else {
	        $('#financialdetails').slideDown();
	    }


	}
	
	$(document).ready(function (e) {

	    $('#selectspan').change(function (e) {
	        $scope.span = [];
	        var newspan = parseInt($(this).val(), 10);
	        for (i = 1; i <= newspan; i++) {
	            $scope.span[i - 1] = i;
	        }
	        
	        $scope.$apply();
	    });

       
	    $('#financialdetails').slideUp();
	    $.getScript("js/numericonly.js", function (data, textStatus, jqxhr) { });
		
		
    });

}