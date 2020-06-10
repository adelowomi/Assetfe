function assignCtrl($scope, $http) {
    $scope.newRoute = {};
    $scope.newRoute.NoOfSeatsReserved = 1;
    $scope.newstock = {};
    $scope.ItemCode = "";
    $scope.ItemFetched = {};
    $scope.CanAssign = false;
    $scope.Issued = false;

    $scope.bindToggleview = function () {
        $('a.carrier-heading').click(function (e) {
            var $cid = $(this).attr('cid');

            var $detailobj = $('li[cid=' + $cid.toString() + ']');
            var state = $detailobj.attr('state');
            if (state == 'opened') {
                $detailobj.css('max-height', '43px');
                $detailobj.attr('state', 'closed');
                //$('.companylistitems').css('background-color', '#ffffff');
            }
            else {
                //$('.companylistitems').css('background-color', '#ffffff');
                $detailobj.css('max-height', '500px');
                $detailobj.attr('state', 'opened');
                //$('li[cid='+cid.toString()+']').css('background-color', '#ededed');
            }
            $(this).fadeOut(200, function () { $(this).fadeIn(200); });

        });

    }

    ////------------------------------------------------

    $.getScript("../plugin/chosen/chosen.jquery.min.js", function (data, textStatus, jqxhr) {
        console.log("Chosen Load was performed.");

        $.getScript("../plugin/chosen/docsupport/prism.js", function (data, textStatus, jqxhr) {
            console.log("Prism Load was performed.");
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

    $scope.FetchItem = function () {
        $.support.cors = true; //CountryName
        var searchUrl = $scope.serviceURL + "/RFIDTagsByRFIDList";
        var ds = {PortalId: $scope.user.PortalId, RFID: $scope.ItemCode};
        $.ajax({
            url: searchUrl, type: "POST",
            dataType: "json",
            crossDomain: true,
            ifModified: true,
            cache: true,
            data: JSON.stringify(ds),
            contentType: "application/json; charset=utf-8",
            beforeSend: function () {
                return true;
            }
        }).done(function (results) {
            
            console.log(results.d);
            $scope.ItemFetched = results.d[0];
            if ($scope.ItemFetched == undefined) {
                alert('Invalid Item Code supplied'); return;
            }
            if ($scope.ItemFetched.StaffCode.trim() != "") {
                //$scope.ItemFetched = {};
                $scope.CanAssign = false;
                $scope.Issued = true;
            }
            else {
                $scope.Issued = false;
                $scope.CanAssign = true;
            }
            $scope.$apply();
        }
        ).fail(function (jpXHR, textStatus, thrownError) {
            alert('An error occurred. Please refresh your browser and retry.');
            console.log("--------------------");
            console.log(textStatus);
            console.log(jpXHR);
            console.log(thrownError);
            console.log("--------------------");
        }
        );
    }

    //-----------------------------------------------------

    /// ---------------------------------------------------

    $scope.getBoolean = function(onezero)
    {
        if (onezero == 1) {
            return true;
        }
        else {
            return false;
        }
    }

    $scope.AssignItem = function (tid) {
        if ($scope.CanAssign == false) return;

        var AssignedToStaffId = $('#selassignto').val();
        var RFIDTagId = $scope.ItemFetched.Id;
        if ($('#selreturnable').val() == "-") {
            alert('Please specify if item assigned is a returnable item.');
            return;
        }
        var IsReturnable = $scope.getBoolean($('#selreturnable').val());


        if ($('#selcurrentuser').val() == "-") {
            alert('Please specify if item assigned is currently being used by assignee.');
            return;
        }
        var IsCurrentUser = $scope.getBoolean($('#selcurrentuser').val());
        var DateIssued = null;
        try{
            DateIssued = $scope.computedate($scope.IssueDate, $scope.IssueTime);
        }
        catch (ex) {
            alert('Invalid item assigment date. Please review and retry.');
            return;
        }
        var ApprovedStaffId = $('#selApprovedStaffId').val();
        var ds = {
            PortalId: $scope.user.PortalId, AssignedToStaffId: AssignedToStaffId, RFIDTagId: RFIDTagId,
            IsReturnable: IsReturnable, IsCurrentUser: IsCurrentUser, DateIssued: DateIssued, ApprovedStaffId: ApprovedStaffId,
            CreatedBy: $scope.user.Id
        };

        $.support.cors = true; 
        
        var searchUrl = $scope.serviceURL + "/StaffRequisitesAdd"
        $.ajax({
            url: searchUrl, type: "POST",
            dataType: "json",
            crossDomain: true,
            ifModified: true,
            cache: true,
            data: JSON.stringify(ds),
            contentType: "application/json; charset=utf-8",
            beforeSend: function () {
                return true;
            }
        }).done(function (results) {
            $scope.ItemFetched = {};
            $scope.CanAssign = false;
            console.log(results);
            $scope.$apply();
            alert('Item successfully issued.');
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

    //-----------------------------------------------------


   

    $scope.proccessadd = function () {
        try {
            $scope.additems();
        }
        catch (exception) {
            alert('An error occurred. Ensure you have filled form properly and retry.');
        }
    }

    $scope.additems = function () {
        $.support.cors = true; //CountryName

        $scope.newstock.ItemId = $("#selItem").val();
        $scope.newstock.qty = $("#txtqty").val();
        //$scope.newstock.TagLocation 
        $scope.newstock.AlertTimeStart2 = $scope.gettime($scope.newstock.AlertTimeStart);
        $scope.newstock.AlertTimeStop2 = $scope.gettime($scope.newstock.AlertTimeStop);
        $scope.newstock.ServiceValidTillDate.net = $scope.computedate($scope.newstock.ServiceValidTillDate.date, $scope.newstock.ServiceValidTillDate.time);
        $scope.newstock.PurchasedByUserId = $('#selbuyer').val();
        $scope.newstock.ItemPurchaseDate = $scope.computedate($scope.newstock.purchasedate, "10:00 AM");
        $scope.newstock.SendSMS = false;
        if ($('#selSMS').val() == "1") {
            $scope.newstock.SendSMS = true;
        }


        var datatosend = {
            PortalId: $scope.user.PortalId, ItemId: $scope.newstock.ItemId, qty: $scope.newstock.qty,
            TagLocation: $scope.newstock.TagLocation, AlertTimeStart: $scope.newstock.AlertTimeStart2, AlertTimeStop: $scope.newstock.AlertTimeStop2,
            ServiceValidTillDate: $scope.newstock.ServiceValidTillDate.net, SendSMS: $scope.newstock.SendSMS, ItemAmount: $scope.newstock.ItemAmount,
            PurchasedByUserId: $scope.newstock.PurchasedByUserId, ItemPurchaseDate: $scope.newstock.ItemPurchaseDate, CreatedBy: localStorage.getItem('userid')
        };


        var searchUrl = $scope.serviceURL + "/RFIDTagsAdd"
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
            if (results.d == 1) {
                alert('Items added successfully');
                $scope.newstock = {};
                $scope.$apply();
            }
            else {
                alert('An error occurred. Ensure you filled the form correctly and retry');
            }
        }
        ).fail(function (jpXHR, textStatus, thrownError) {
            console.log("--------------------");
            console.log(textStatus);
            console.log(jpXHR);
            console.log(thrownError);
            console.log("--------------------");
            alert('An error occurred. Ensure you filled the form correctly and retry');
        }
        );
    }
    setTimeout(function () {
        // $scope.getCountries(); $scope.getStates(); $scope.getCompanies();
    }, 1000);
    //---------------------------------------------------
    $scope.updateCountryList = function () {
        $('.chosen-select').trigger('chosen:updated');
        $scope.$apply();
    }
    ///----------------------------------------------
    $scope.getallitems();

    $(document).ready(function (e) {
        $('#spinner3').spinner({ value: 1, min: 1, max: 999999 });
        $.getScript("js/numericonly.js", function (data, textStatus, jqxhr) { });

        $('input').iCheck({
            checkboxClass: 'icheckbox_square-blue',
            radioClass: 'iradio_square-blue',
            increaseArea: '20%'
        });
        jQuery('.datecontrol').datetimepicker({ timepicker: false, format: 'd/m/Y' });
        $('.timecontrol').timepicker();


        $('#txtCompanySearch').keyup(function (e) {
            var $searchText = $(this).val().toLowerCase();
            $('.coyname').each(function (index, element) {
                var $thisCoy = $(this).text().toLowerCase();
                var $cid = $(this).attr('cid');

                if ($thisCoy.indexOf($searchText) == -1) {
                    $('li[cid=' + $cid + ']').fadeOut();
                }
                else {
                    $('li[cid=' + $cid + ']').fadeIn();
                }
            });
        });



        $('#selectCompany').change(function (e) {
            $scope.selectedCompany.Id = $(this).val();
            //var flow = require ('../plugin/flow');

            Deferred.next(function () {

            }).next(function () {
                $scope.getCarriers($scope.getTerminalsbyTransportCompany);

            }).next(function () {
                //$scope.getTerminalsbyTransportCompany();

            }).next(function () {

                setTimeout(function () {
                    //$scope.$apply();
                    $scope.updateChosenList();
                    $scope.bindToggleview();
                }, 2000);
            });


        });

        $('#selectCompanyforRoutes').change(function (e) {
            $scope.selectedCompany.Id = $(this).val();

            $scope.getRoutes();
            var callbacks = [$scope.bindToggleview];
            setTimeout(function () {
                //				$scope.bindToggleview();
                $('a.delete-terminal>i.cancelitem').click(function (e) {
                    var $tid = $(this).attr('tid');
                    //$scope.deleteTerminal($tid);
                });
            }, 500);
        });


    });

}