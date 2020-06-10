function bookingCtrl ($scope, $http)
{
	$scope.bookings = {};
	
	
		
		/* Formatting function for row details - modify as you need */
	$scope.format =  function( d ) {
		// `d` is the original data object for the row
		var members = JSON.parse(d.Members);
		var membertable = "<table class='childmembers2'><thead><tr><td>Members in this Batch</td></tr></thead><tbody>";
		for(var i = 0; i < members.length; i++)
		{
			membertable += "<tr><td>"+ members[i].Surname + ' ' +  members[i].OtherNames + "</td></tr>";
		}
		
		membertable += "</tbody></table>";
		
		return '<div class="childcontainer"><table class="childmembers" cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">'+
			'<tr>'+
				'<td>Transport Company:</td>'+
				'<td>'+d.CompanyName+'</td>'+
			'</tr>'+
			'<tr>'+
				'<td>Trip Type:</td>'+
				'<td>'+d.TripType+'</td>'+
			'</tr>'+
			'<tr>'+
				'<td>Fare per passenger:</td>'+
				'<td>'+d.AmountPerHead+'</td>'+
			'</tr>'+
			'<tr>'+
				'<td>Passengers in Batch:</td>'+
				'<td>'+d.NoOfPersons+'</td>'+
			'</tr>'+
			'<tr>'+
				'<td>Total Payment Due:</td>'+
				'<td>'+'0'+'</td>'+
			'</tr>'+
			'<tr>'+
				'<td>Convenience Charge:</td>'+
				'<td>'+d.ConvinienceCharge+'</td>'+
			'</tr>'+
			'<tr>'+
				'<td>Requested SMS:</td>'+
				'<td>'+d.SendSMS+'</td>'+
			'</tr>'+
			'<tr>'+
				'<td>Extra info:</td>'+
				'<td>...</td>'+
			'</tr>'+
		'</table>'+membertable+'<br style="clear: both;" /></div>';
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
			data: $scope.bookings, 
			columns: [
				{
					"class":          'details-control',
					"orderable":      false,
					"data":           null,
					"defaultContent": ''
				},
				{ "data": "ClientName" },
				{ "data": "FromTerminal" },
				{ "data": "ToTerminal" },
				{ "data": "NoOfPersons" },
				{ "data": "TravelDateStr" },
				{ "data": "AmountPerHead" }
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
				}
			} );	
	}
	
		/// ---------------------------------------------------
	
	$scope.refreshTable = function (tid) {
		$.support.cors = true; //CountryName
		var datatosend = {};
	
       var searchUrl = $scope.serviceURL2 + "/BookingsGet"
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
				
				$scope.bookings = {};
				$scope.bookings = JSON.parse(results.d);
				for(var i = 0; i < $scope.bookings.length; i++)
				{
					$scope.bookings[i].TravelDate = new Date(parseInt($scope.bookings[i].TravelDate.substr(6)));
					$scope.bookings[i].TravelDateStr = $scope.bookings[i].TravelDate.toString("d-MMM-yyyy");
					$scope.bookings[i].AmountPerHead = "NGN " +  $scope.bookings[i].AmountPerHead.toFixed(2);
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
	

	
	
	

}