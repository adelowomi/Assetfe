function positionsCtrl($scope, $http) {

    $scope.newposition = {
        PortalId: $scope.user.PortalId, PositionName: null,
        PositionDescription: "", CreatedBy: $scope.user.Id
    };
    TweakSkin();
    /// ---------------------------------------------------
    $('#EditView').slideUp();
    //userid company
    $scope.addposition = function () {
        if (!$scope.newposition.PositionName) {
            $scope.MessageAlert('You cannot save position with blank name.', 'error');
            return;
        }
        $.support.cors = true;
        AjaxOptions.data = JSON.stringify($scope.newposition);
        AjaxOptions.url = $scope.serviceURL + "/PositionAdd";
        $.ajax(AjaxOptions).done(function (results) {
            console.log(results);
            if (results.d > 0) {
                $scope.newposition = {
                    PortalId: $scope.user.PortalId, PositionName: null,
                    PositionDescription: "", CreatedBy: $scope.user.Id
                };
                $scope.getpositions();
                $scope.MessageAlert('Position created successfully.', 'success');
            }
            else {
                $scope.MessageAlert('Request did not complete successfully. Please try again later.', 'error');
            }
        }
        ).fail(AjaxFail);
    }

    $scope.$on('PositionsListed', function () {
        $scope.FixPositionData();
    });

    $scope.BindDeleteFunction = function () {
        $('.ParentControls.Delete').click(function () {
            var MyId = $(this).attr('ref');
            $scope.DeletePosition(MyId);
        });

        $('.ParentControls.Edit').click(function () {
            var MyId = $(this).attr('ref');
            $scope.PrepareEdit(MyId);
        });


    }
    $scope.EditPosition = {};
    $scope.PrepareEdit = function (ref) {
        $('#MainView').slideUp();
        $scope.EditPosition = $.grep($scope.Positions, function (e) { return e.Id == ref; })[0];
        $('#EditView').css('display', 'block');
        ApplyViewChanges($scope);
        $scope.ScrollPageUp();
    }

    $scope.ExitEdit = function () {
        $scope.EditPosition = {};
        $('#MainView').slideDown();
        $('#EditView').css('display', 'none');
    }

    $scope.SubmitEditPosition = function (confirmed) {
        if (!confirmed) {
            $scope.ConfirmBeforeAction('Confirm Update!', 'Are you sure you want to update this Position record?<br>' + //
                'You action will have system wide implications.<br><br>' +//
                '<b>Do you want to continue?</b>',
                function () { $scope.SubmitEditPosition(true) });
            return;
        }
        if (!$scope.EditPosition.PositionName) {
            $scope.MessageAlert('Position name is a compulsory field and cannot be blank.', 'error');
            return;
        }
        $scope.EditPosition.DateCreated = new Date("October 13, 2014 11:13:00"); //arbitrary date, not to be used
        $scope.EditPosition.CreatedBy = $scope.user.Id;

        $.support.cors = true;
        AjaxOptions.data = JSON.stringify({ rfidInfo: $scope.EditPosition });
        AjaxOptions.url = $scope.serviceURL + "/PositionUpdate";
        $.ajax(AjaxOptions).done(function (results) {
            if (results.d > 0) {
                $scope.MessageAlert('Position update was successful', 'success');
                console.log(results);
                ApplyViewChanges($scope);
                $scope.getpositions();
                $scope.ExitEdit();
            }
            else {
                $scope.MessageAlert('An error occurred. Please try again later.', 'error');
                console.log(results);
            }
        }
        ).fail(AjaxFail);



    }
    
    ///------------------------------------
    var Positiontable;
    var PositiontableFormatted = true; //false = enable custom drop down
    $scope.FixPositionData = function () {
        Positiontable = $scope.DoDataTable(PositiontableFormatted, 'tblPositions', $scope.Positions, $scope.BindDeleteFunction, //
             ["PositionName", "PositionDescription"],//
             false, true, "PositionName", $scope.PrepareEdit);
    }

    $scope.DeletePosition = function (PositionId, confirmed) {
        if (!confirmed) {
            $scope.ConfirmBeforeAction('Confirm Delete!', 'Are you sure you want to remove this Position?<br>' + //
                'All associated data will be lost including employee-position associations.<br><br>' +//
                '<b>Do you want to continue?</b>',
                function () { $scope.DeletePosition(PositionId, true) });
            return;
        }
        $.support.cors = true;
        AjaxOptions.data = JSON.stringify({ Id: PositionId });
        AjaxOptions.url = $scope.serviceURL + "/PositionByIdDelete";
        $.ajax(AjaxOptions).done(function (results) {
            console.log(results);
            if (results.d > 0) {
                $scope.getpositions();
                $scope.MessageAlert('Position record deleted.', 'success');
                $scope.ExitEdit();
            }
            else {
                $scope.MessageAlert('Request did not complete successfully. Please try again later.', 'error');
            }
        }
        ).fail(AjaxFail);
    }
    
    $scope.getpositions();
}