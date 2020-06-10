function trendhistoryCtrl ($scope, $http)
{
	$scope.bookings = {};
	
	
		
		/* Formatting function for row details - modify as you need */
	$scope.format =  function( d ) {
		// `d` is the original data object for the row
		
	    $.session.set('nowcompanyname', d.Name);
	    $.session.set('nowdescription', d.Description);
		
		return '<div class="childcontainer"><table class="childmembers" cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">'+
			'<tr>'+
				'<td style="width: 200px"> <button class="btn btn-info onlyright intablebtn showreport" type="button" aid="'+ d.id +'" ><i class="fa fa-save"></i> Show Detail Analysis</button></td>' +
				'<td><button class="btn btn-info onlyright intablebtn" type="button" ng-click=""><i class="fa fa-save"></i> Edit and Reanalyze</button></td>' +
			'</tr>'+
		
		'</table><br style="clear: both;" /></div>';
	}

	$scope.bindReportEvent = function () {

	    $('button.intablebtn.showreport').click(function () {

	        var analysisId = $(this).attr('aid');
	        $scope.showReport(analysisId);


	    });
	}

$(document).ready(function() {
	setTimeout(function(){
		$scope.refreshTable();
		},1000);
} );
	
	///------------------------------------
	$scope.fixData = function()
	{
			var table = $('#example').DataTable( {
			data: $scope.trends, 
			columns: [
				{
					"class":          'details-control',
					"orderable":      false,
					"data":           null,
					"defaultContent": ''
				},
				{ "data": "Name" },
				{ "data": "Description" },
				{ "data": "DateStr" },
				
			],
			order: [[1, 'asc']]
			} );
			
			
			// Add event listener for opening and closing details
			$('#example tbody').on('click', 'td.details-control', function () {
				var tr = $(this).parents('tr');
				var row = table.row( tr );
		
				if ( row.child.isShown() ) {
					// This row is already open - close it
					row.child.hide();
					tr.removeClass('shown');
				}
				else {
					// Open this row
					row.child( $scope.format(row.data()) ).show();
					tr.addClass('shown');
					$scope.bindReportEvent();
				}
			} );	
	}
	
		/// ---------------------------------------------------
	
	$scope.refreshTable = function (tid) {
		$.support.cors = true; //CountryName
		var datatosend = {userid: $scope.userid};
	
       var searchUrl = $scope.serviceURL + "/TrendHistory"
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
				
				$scope.trends = {};
				$scope.trends = JSON.parse(results.d);
				for (var i = 0; i < $scope.trends.length; i++)
				{
				    $scope.trends[i].DateCreated = new Date(parseInt($scope.trends[i].DateCreated.substr(6)));
				    $scope.trends[i].DateStr = $scope.trends[i].DateCreated.toString("d-MMM-yyyy");
				}
				$scope.fixData();
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
	
	// ------------------
	$scope.formatCurrency = function()
	{
		var DecimalSeparator = Number("1.2").toLocaleString().substr(1,1);
		var AmountWithCommas = Amount.toLocaleString();
		var arParts = String(AmountWithCommas).split(DecimalSeparator);
		var intPart = arParts[0];
		var decPart = (arParts.length > 1 ? arParts[1] : '');
		decPart = (decPart + '00').substr(0,2);
		
		return '=N= ' + intPart + DecimalSeparator + decPart;
	}
	//-----------------------------------------------------
	
	
	$scope.newMode = {};
	$scope.newState ={};
	$scope.selectedCountry = {};
	$scope.travelModes = {};
		
	$scope.tran = {};
	
	
		
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
	
	
	
	
	
	//-----------------------------------------------------
	

		$scope.showReport = function (aid) {
		    $.support.cors = true; 
		    var datatosend = { analysisid: aid };

		    var searchUrl = $scope.serviceURL + "/getAnalysisResult"
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

		        $.session.set('trendresult', results.d);
		        window.location.href = "#/trendreport";
		        console.log(results);
		    }
            ).fail(function (jpXHR, textStatus, thrownError) {
                alert('An error occurred, please try again later.');
                console.log("--------------------");
                console.log(textStatus);
                console.log(jpXHR);
                console.log(thrownError);
                console.log("--------------------");
            }
            );
		}

	
	

}