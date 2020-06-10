function requisitionNACtrl($scope, $http) {

    TweakSkin();

    $scope.NewRequisitionNA = {
        PortalId: $scope.user.PortalId, ItemDescription: null, Quantity: 0,
        CreatedBy: $scope.user.Id
    };

    $scope.AddRequisitionNA = function () {
        if (!$scope.NewRequisitionNA.ItemDescription) {
            $scope.MessageAlert('Please describe the item.', 'error');
            return;
        }

        AjaxOptions.data = JSON.stringify($scope.NewRequisitionNA);
        AjaxOptions.url = $scope.serviceURL + "/RequisitionsNotAvailableAdd";
        $.ajax(AjaxOptions).done(function (results) {
            console.log(results);
            if (results.d > 0) {
                $scope.ListRequisitionNA($scope.user.Id);
                $scope.NewRequisitionNA = {
                    PortalId: $scope.user.PortalId, ItemDescription: null, Quantity: 0,
                    CreatedBy: $scope.user.Id
                };
                $scope.MessageAlert('Request made successfully.', 'success');
            }
            else {
                $scope.MessageAlert('Sorry, request was not successful. Try again or contact system admin', 'error');
            }
        }
        ).fail(AjaxFail);

    }

    $('#EditView').slideUp();
    $scope.$on('RequisitionNAListed', function (event) {
        $scope.FixRequisitionNAData();
    });
    $scope.BindDeleteFunction = function () {
        $('.ParentControls.Delete').click(function () {
            var MyId = $(this).attr('ref');
            $scope.DeleteRequisitionNA(MyId);
        });

        $('.ParentControls.Edit').click(function () {
            var MyId = $(this).attr('ref');
            $scope.PrepareEdit(MyId);
        });


    }

    $scope.EditRequisitionNA = {};
    $scope.PrepareEdit = function (ref) {
        $('#MainView').slideUp();
        $scope.EditRequisitionNA = $.grep($scope.RequisitionNA, function (e) { return e.Id == ref; })[0];
        $('#EditView').css('display', 'block');
        ApplyViewChanges($scope);
        $scope.ScrollPageUp();
    }

    $scope.ExitEdit = function () {
        $scope.EditRequisitionNA = {};
        $('#MainView').slideDown();
        $('#EditView').css('display', 'none');
    }

    $scope.SubmitEditRequisitionNA = function (confirmed) {
        if (!confirmed) {
            $scope.ConfirmBeforeAction('Confirm Update!', 'Are you sure you want to update this request?<br>',
                function () { $scope.SubmitEditRequisitionNA(true) });
            return;
        }

        if (!$scope.EditRequisitionNA.ItemDescription) {
            $scope.MessageAlert('Please describe the item.', 'error');
            return;
        }
        
        $scope.EditRequisitionNA.DateIncluded = new Date("October 13, 2014 11:13:00"); //arbitrary date, not to be used
        $scope.EditRequisitionNA.DateCreated = new Date("October 13, 2014 11:13:00"); //arbitrary date, not to be used
        $scope.EditRequisitionNA.CreatedBy = $scope.user.Id;
        //delete $scope.EditRequisitionNA.__type; //funny though
        AjaxOptions.data = JSON.stringify({hostname: Hostname, rfidInfo: $scope.EditRequisitionNA });
        AjaxOptions.url = $scope.serviceURL + "/RequisitionsNotAvailableUpdate";
        $.ajax(AjaxOptions).done(function (results) {
            if (results.d > 0) {
                $scope.MessageAlert('Requisition modification was successful', 'success');
                console.log(results);
                ApplyViewChanges($scope);
                $scope.ListRequisitionNA($scope.user.Id);
                $scope.ExitEdit();
                $scope.EditRequisitionNA = {};
            }
            else {
                $scope.MessageAlert('An error occurred. Please try again later.', 'error');
                console.log(results);
            }
        }
        ).fail(AjaxFail);
    }

    ///------------------------------------
    var RequisitionNAtable;
    var RequisitionNAtableFormatted = true; //false = enable custom drop down
    $scope.FixRequisitionNAData = function () {
        RequisitionNAtable = $scope.DoDataTable(RequisitionNAtableFormatted, 'tblRequisitionNAs', $scope.RequisitionNA, $scope.BindDeleteFunction, //
            ["ItemDescription", "Quantity", "IsIncluded", "IncludedByFullName"],//
            false, true, "ItemDescription", $scope.PrepareEdit);
    }

    $scope.DeleteRequisitionNA = function (RequisitionNAId, confirmed) {
        if (!confirmed) {
            $scope.ConfirmBeforeAction('Confirm Delete!', 'Are you sure you want to cancel this Request?<br>',
                function () { $scope.DeleteRequisitionNA(RequisitionNAId, true) });
            return;
        }
        $.support.cors = true;
        AjaxOptions.data = JSON.stringify({ Id: RequisitionNAId });
        AjaxOptions.url = $scope.serviceURL + "/RequisitionsNotAvailableByIdDelete";
        $.ajax(AjaxOptions).done(function (results) {
            console.log(results);
            if (results.d > 0) {
                $scope.ListRequisitionNA($scope.user.Id);
                $scope.MessageAlert('Requisition cancelled.', 'success');
            }
            else {
                $scope.MessageAlert('Request did not complete successfully. Please try again later.', 'error');
            }
        }
        ).fail(AjaxFail);
    }



    $scope.ListRequisitionNA($scope.user.Id);
}