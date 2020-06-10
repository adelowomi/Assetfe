function issuenaCtrl($scope, $http) {
    TweakSkin();

    $scope.PNAsToShow = {};
    $scope.RefreshPNAsList = function () {
        var IsPending = $('#RadPending').prop('checked');
        $scope.PNAsToShow = $.grep($scope.PortalRequisitionNAs, function (e) { return e.IsIncluded != IsPending });
        $scope.FixPortalRequisitionNAData();
    }

    $scope.$on('PortalRequisitionNAListed', function (event) {
        $scope.RefreshPNAsList();
    });

    $scope.ProcessRequest = function (requisitionid) {
        $scope.EditPortalRequisitionNA = $.grep($scope.PortalRequisitionNAs, function (e) { return e.Id == requisitionid; })[0];
        $scope.EditPortalRequisitionNA.IsIncluded = true;
        $scope.EditPortalRequisitionNA.DateIncluded = new Date("October 13, 2014 11:13:00"); //arbitrary date, not to be used;
        $scope.EditPortalRequisitionNA.DateCreated = new Date("October 13, 2014 11:13:00"); //arbitrary date, not to be used;
        $scope.EditPortalRequisitionNA.IncludeBy = $scope.user.Id;


        $.support.cors = true;
        if (!$scope.EditPortalRequisitionNA.CreatedByFullName) {
            $scope.EditPortalRequisitionNA.CreatedByFullName = "";
        }
        AjaxOptions.data = JSON.stringify({hostname: Hostname, rfidInfo: $scope.EditPortalRequisitionNA});
        AjaxOptions.url = $scope.serviceURL + "/RequisitionsNotAvailableUpdate";
        $.ajax(AjaxOptions).done(function (results) {
            if (results.d > 0) {
                $scope.MessageAlert('Action was processed successfully. Request initiator will get notification that item is now available.', 'success');
                console.log(results);
                $scope.EditPortalRequisitionNA = {};
                ApplyViewChanges($scope);
                $scope.ListPortalRequisitionNAs();
            }
            else {
                $scope.MessageAlert('An error occurred. Please try again later.', 'error');
                console.log(results);
            }
        }
        ).fail(AjaxFail);
    }

    $scope.BindDeleteFunction = function () {
        $('.ParentControls.Approve').click(function () {
            var MyId = $(this).attr('ref');
            $scope.ProcessRequest(MyId);
        });
    }
    
    $scope.formatPortalRequisitionNA = function (d) {
        // `d` is the original data object for the row


        return '<div class="childcontainer" style="padding-left: 0px; background: #dfc5cc;">' +//
            '<table id="PortalRequisitionNA' +//
            d.Id + '" class="childmembers table table-striped" cellpadding="5" cellspacing="0" border="0" style="padding-left:50px; width: 100%;"><thead>' +
            '<tr style="background: #dfc5cc; color: #fff;">' +
                  '<th>Logo</th><th>Authorized Signature</th><th></th>' +
              '</tr></thead><tbody>' +
            '<tr><td style="width: 150px"><img class="table-inner-image" src="' + d.PortalRequisitionNALogoUrl +
            '" /></td><td style="width: 200px"><img class="table-inner-image" src="' + d.AuthorizedSignUrl +
            '" /></td><td></td></tr>' +
            '<tr>' +
                  '<td colspan="3"></td>'
        '</tr>' +


    '</tbody></table><br style="clear: both;" /></div>';

    }
    ///------------------------------------
    var PortalRequisitionNAtable;
    var PortalRequisitionNAtableFormatted = true; //false = enable custom drop down
    $scope.FixPortalRequisitionNAData = function () {
        try {
            PortalRequisitionNAtable.destroy();
        } catch (e) {

        }

        PortalRequisitionNAtable = $('#tblPortalRequisitionNA').DataTable({
            responsive: true,
            "ordering": true,
            dom: 'T<"clear">lfrtip',
            tableTools: {
                "sSwfPath": "resources/copy_csv_xls_pdf.swf"
            },
            data: $scope.PNAsToShow,
            columns: [
                    {
                        "class": 'details-control',
                        "orderable": false,
                        "data": null,
                        "defaultContent": ''
                    }, { "data": "Controls" },
                    { "data": "ItemDescription" }, { "data": "Quantity" }, { "data": "CreatedByFullName" }, { "data": "DateCreatedReadable" },
                    { "data": "IncludedByFullName" }  

            ],
            order: [[5, 'asc']]
        });
        PortalRequisitionNAtable.columns.adjust().draw();

        if (!PortalRequisitionNAtableFormatted) {

            // Add event listener for opening and closing details
            $('#tblPortalRequisitionNA tbody').on('click', 'td.details-control', function () {
                var tr = $(this).parents('tr');
                var row = PortalRequisitionNAtable.row(tr);

                if (row.child.isShown()) {
                    // This row is already open - close it
                    row.child.hide();
                    tr.removeClass('shown');
                }
                else {
                    // Open this row
                    row.child($scope.formatPortalRequisitionNA(row.data())).show();
                    tr.addClass('shown');
                }
                //$scope.BindRoomTypeDelete();
            });
            PortalRequisitionNAtableFormatted = true;
        }
        //ensure that the reorder buttons can work
        setTimeout(function () { $scope.BindDeleteFunction(); }, 200);
    }

    $('#RadPending, #RadTreated').on('ifChecked', function () {
        $scope.RefreshPNAsList();
    });
   
    $scope.ListPortalRequisitionNAs();


}