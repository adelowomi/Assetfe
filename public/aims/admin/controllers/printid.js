function printidCtrl($scope, $http) {
    TweakSkin();
    $scope.NewAccount = {};
    $scope.filename = "";
    $scope.GoHome = function () {
        window.location.href = "#/homepage";
    }

    $scope.CreateAnother = function () {
        window.location.href = "#/adduser";
    }

    $scope.PrintId = function () {
        $.support.cors = true; //CountryName
      
        var datatosend = {
            RFIDTagId: $scope.AvailableIDCards[0].Id, IsPrinted: true
        };

        var searchUrl = $scope.serviceURL + "/RFIDTagsByRFIDTagIdPrinted";
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
            
            $scope.FreshUser.ComputedId = localStorage.getItem('FreshUserId');
            var ds = {
                PortalId: $scope.user.PortalId, AssignedToStaffId: $scope.FreshUser.ComputedId, RFIDTagId: $scope.AvailableIDCards[0].Id,
                IsReturnable: true, IsCurrentUser: false, DateIssued: $scope.CurrentDate(), ApprovedStaffId: $scope.user.Id,
                CreatedBy: $scope.user.Id
            };
            $.support.cors = true;
            var searchUrl = $scope.serviceURL + "/StaffRequisitesAdd"
            $.ajax({ url: searchUrl, type: "POST", dataType: "json", crossDomain: true, ifModified: true, cache: true, data: JSON.stringify(ds),
                contentType: "application/json; charset=utf-8", beforeSend: function () { return true;}
            }).done(function (results) {
                $scope.FreshUser = JSON.parse(localStorage.getItem('FreshUser'));
                var searchUrl = $scope.serviceURL + "/RFIDTagsByRFIDList";
                var ds = { PortalId: $scope.user.PortalId, RFID: $scope.FreshUser.StaffCode };
                $.support.cors = true;
                $.ajax({
                    url: searchUrl, type: "POST", dataType: "json", crossDomain: true, ifModified: true, cache: true, data: JSON.stringify(ds),
                    contentType: "application/json; charset=utf-8", beforeSend: function () { return true; }
                }).done(function (results) {
                 

                    $scope.FreshUser = JSON.parse(localStorage.getItem('FreshUser'));
                    var ID_Print = results.d;
                    ID_Print = ID_Print[0];
                    console.log('ID Card to print');
                    console.log(results);
                    var idtemplate = '../reports/idcard.php?cn=' + $scope.encode($scope.CurrentCompany.CompanyName) + '&ca=' + $scope.encode($scope.CurrentCompany.CompanyAddress) + //
                        '&ce=' + $scope.encode($scope.CurrentCompany.CompanyEmail) + '&cp=' + $scope.encode($scope.CurrentCompany.MobileNo) + //
                        '&cl=' + $scope.encode('../admin/uploads/' + $scope.CurrentCompany.CompanyLogoUrl + '.JPG') + '&bv=' + $scope.encode(ID_Print.RFID) + //
                        '&bi=' + $scope.encode($scope.pictureHostMain + "/"+ ID_Print.BarcodeUrl) + '&p=' + $scope.encode('../admin/uploads/' + $scope.FreshUser.PhotoURL + '.JPG') +//
                        '&s=' + $scope.encode($scope.FreshUser.surname) + '&o=' + $scope.encode($scope.FreshUser.othernames) + //
                        '&h=' + $scope.encode('../admin/uploads/' + $scope.FreshUser.UserSignURL + '.JPG') + '&a=' + $scope.encode('../admin/uploads/' + $scope.CurrentCompany.AuthorizedSignUrl + '.JPG');
                    window.open(idtemplate);
                    
               
                }
                ).fail(function (jpXHR, textStatus, thrownError) {
                    console.log("--------------------"); console.log(textStatus); console.log(jpXHR);
                    console.log(thrownError); console.log("--------------------");
                }
                );

            }
            ).fail(function (jpXHR, textStatus, thrownError) { console.log("--------------------"); console.log(textStatus); console.log(jpXHR);
                console.log(thrownError);  console.log("--------------------");   }
            );

           
            
        }
        ).fail(function (jpXHR, textStatus, thrownError) {
            console.log("--------------------");
            console.log(textStatus);
            console.log(jpXHR);
            console.log(thrownError);
            console.log("--------------------");
        }
        );

    }

    //$scope.user = JSON.parse(localStorage.getItem('user'));
    //$scope.user = $scope.user[0];
    //localStorage.setItem('userid', $scope.user.id);
    //$scope.userid = localStorage.getItem('userid');
    //$("#profilepic, .profilepics").attr("src", "userimages/" + localStorage.getItem('userid') + ".jpg");

    /* Formatting function for row details - modify as you need */
    $scope.format = function (d) {
        // `d` is the original data object for the row
        var members = JSON.parse(d.Members);
        var membertable = "<table class='childmembers2'><thead><tr><td>Members in this Batch</td></tr></thead><tbody>";
        for (var i = 0; i < members.length; i++) {
            membertable += "<tr><td>" + members[i].Surname + ' ' + members[i].OtherNames + "</td></tr>";
        }

        membertable += "</tbody></table>";

        return '<div class="childcontainer"><table class="childmembers" cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">' +
			'<tr>' +
				'<td>Transport Company:</td>' +
				'<td>' + d.CompanyName + '</td>' +
			'</tr>' +
			'<tr>' +
				'<td>Trip Type:</td>' +
				'<td>' + d.TripType + '</td>' +
			'</tr>' +
			'<tr>' +
				'<td>Fare per passenger:</td>' +
				'<td>' + d.AmountPerHead + '</td>' +
			'</tr>' +
			'<tr>' +
				'<td>Passengers in Batch:</td>' +
				'<td>' + d.NoOfPersons + '</td>' +
			'</tr>' +
			'<tr>' +
				'<td>Total Payment Due:</td>' +
				'<td>' + '0' + '</td>' +
			'</tr>' +
			'<tr>' +
				'<td>Convenience Charge:</td>' +
				'<td>' + d.ConvinienceCharge + '</td>' +
			'</tr>' +
			'<tr>' +
				'<td>Requested SMS:</td>' +
				'<td>' + d.SendSMS + '</td>' +
			'</tr>' +
			'<tr>' +
				'<td>Extra info:</td>' +
				'<td>...</td>' +
			'</tr>' +
		'</table>' + membertable + '<br style="clear: both;" /></div>';
    }


    //--- Document ready things
    $(document).ready(function () {
        $('.chosen-select').trigger('chosen:updated');
        d = new Date();
        $scope.filename = localStorage.getItem('userid') + d.getTime();

        $(".dropzones").dropzone({
            url: $scope.pictureHost + "/upload.php", headers: { "filename": $scope.filename, "who": 1 }, //who = 1 means user = 2 means relative
            addedfile: function (file) {
                setTimeout(function () {
                    d2 = new Date();
                    $("#profilepic").attr("src", $scope.pictureHost + "/Users/" + $scope.filename + ".jpg?" + d2.getTime());
                }, 3000);
            }
        });
    });

    ///------------------------------------
    $scope.fixData = function () {
        var table = $('#example').DataTable({
            data: $scope.bookings,
            columns: [
				{
				    "class": 'details-control',
				    "orderable": false,
				    "data": null,
				    "defaultContent": ''
				},
				{ "data": "FromTerminal" },
				{ "data": "ToTerminal" },
				{ "data": "TravelDateStr" },
				{ "data": "AmountPerHead" }
            ],
            order: [[1, 'asc']]
        });


        // Add event listener for opening and closing details
        $('#example tbody').on('click', 'td.details-control', function () {
            var tr = $(this).parents('tr');
            var row = table.row(tr);

            if (row.child.isShown()) {
                // This row is already open - close it
                row.child.hide();
                tr.removeClass('shown');
            }
            else {
                // Open this row
                row.child($scope.format(row.data())).show();
                tr.addClass('shown');
            }
        });
    }

    /// ---------------------------------------------------

    $scope.refreshTable = function (tid) {
        return;
        $.support.cors = true; //CountryName
        var datatosend = { userid: localStorage.getItem('userid') };

        var searchUrl = $scope.serviceURL2 + "/BookingsGetbyUser"
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

            $scope.bookings = {};
            $scope.bookings = JSON.parse(results.d);

            for (var i = 0; i < $scope.bookings.length; i++) {
                $scope.bookings[i].TravelDate = new Date(parseInt($scope.bookings[i].TravelDate.substr(6)));
                $scope.bookings[i].TravelDateStr = $scope.bookings[i].TravelDate.toString("d-MMM-yyyy");
                $scope.bookings[i].AmountPerHead = "NGN " + $scope.bookings[i].AmountPerHead.toFixed(2);
            }
            $scope.fixData();
            console.log(results);
            if ($scope.bookings.length <= 0) $scope.bookings = null;
            $scope.$apply();
        }
        ).fail(function (jpXHR, textStatus, thrownError) {
            console.log("--------------------");
            console.log(textStatus);
            console.log(jpXHR);
            console.log(thrownError);
            console.log("--------------------");
        }
        );
    }

    // ------------------
    $scope.formatCurrency = function () {
        var DecimalSeparator = Number("1.2").toLocaleString().substr(1, 1);
        var AmountWithCommas = Amount.toLocaleString();
        var arParts = String(AmountWithCommas).split(DecimalSeparator);
        var intPart = arParts[0];
        var decPart = (arParts.length > 1 ? arParts[1] : '');
        decPart = (decPart + '00').substr(0, 2);

        return '=N= ' + intPart + DecimalSeparator + decPart;
    }
    //-----------------------------------------------------






}