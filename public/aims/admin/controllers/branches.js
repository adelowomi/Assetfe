function branchesCtrl($scope, $http) {
    $scope.newbranch = {
        PortalId: $scope.user.PortalId, CountryId: null, StateId: null, BranchName: null, BranchDetails: null,
        Location: null, CreatedBy: $scope.user.Id
    };
    $scope.branchTable = {};

    TweakSkin();
    /// ---------------------------------------------------
    $('#EditView').slideUp();
    $scope.addbranch = function () {
        var stateid = $('#selState').val();
        if (stateid == '-') {
            $scope.MessageAlert('You need to select a state for this branch.', 'error');
            return;
        }
        var CountryId = $('#SelCountry').val();
        if (CountryId == '-') {
            $scope.MessageAlert('You need to select a country for this branch.', 'error');
            return;
        }
        if (!$scope.newbranch.BranchName || !$scope.newbranch.Location) {
            $scope.MessageAlert('Branch name and Location are compulsory fields.', 'error');
            return;
        }
        $scope.newbranch.StateId = stateid;
        var SelectedCountry =  $.grep($scope.Countries, function (e) { return e.CountryCode == CountryId; })[0];
        $scope.newbranch.CountryId = SelectedCountry.Id;
        $.support.cors = true;
        AjaxOptions.data = JSON.stringify($scope.newbranch);
        AjaxOptions.url = $scope.serviceURL + "/CompanyBranchAdd";
        $.ajax(AjaxOptions).done(function (results) {
            if (results.d > 0) {
                $scope.MessageAlert('Branch added successfully', 'success');
                console.log(results);
                $scope.newbranch = {
                    PortalId: $scope.user.PortalId, CountryId: null, StateId: null, BranchName: null, BranchDetails: null,
                    Location: null, CreatedBy: $scope.user.Id
                };
                ApplyViewChanges($scope);
                $scope.getBranches();
            }
            else {
                $scope.MessageAlert('An error occurred. Please try again later.', 'error');
                console.log(results);
            }
        }
        ).fail(AjaxFail);

    }

    $scope.proccessadd = function () {
        try {
            $scope.additems();
        }
        catch (exception) {
            alert('An error occurred. Ensure you have filled form properly and retry.');
        }
    }

    $scope.$on('CountriesListed', function (event) {
        ApplyViewChanges($scope);
        $scope.updateChosenList();
        $scope.UpdateStateList();
    });
    $scope.$on('StatesListed', function (event) {
        ApplyViewChanges($scope);
        if ($scope.EditMode) {
            setTimeout(function () {
                $('#SelEditState').val($scope.EditBranch.StateId);
                $scope.EditMode = false;
                $scope.updateChosenList();
            }, 200);
        } 
        $scope.updateChosenList();
    });

   
    $scope.$on('BranchesListed', function (event) {
        $scope.FixBranchData();
    });


    $("#SelCountry").change(function () {
        $scope.UpdateStateList();
    });

    $("#SelEditCountry").change(function () {
        var CountryCode = $(this).val();
        $scope.UpdateStateList(undefined, CountryCode);
    });

    $scope.EditMode = false;
    $scope.UpdateStateList = function (editmode, CountryCode) {
        var CountryId;
        if (editmode) {
            $scope.EditMode = editmode;
        }
        if (!CountryCode) {
            CountryId = $("#SelCountry").val();
        }
        else {
            CountryId = CountryCode;
        }
        if (CountryId != '-') {
            $scope.getStates(CountryId);
        }
        else {
            //$('#selState').
            $scope.getStates(0);//no state
        }
        
    }

    $scope.BindDeleteFunction = function () {
        return;
        $('.ParentControls.Delete').click(function () {
            var MyId = $(this).attr('ref');
            $scope.DeleteBranch(MyId);
        });

        $('.ParentControls.Edit').click(function () {
            var MyId = $(this).attr('ref');
            $scope.PrepareEdit(MyId);
        });


    }
    $scope.EditBranch = {};
    $scope.PrepareEdit = function (ref) {
        
        $('#MainView').slideUp();
        $scope.EditBranch = $.grep($scope.branches, function (e) { return e.Id == ref; })[0];
        $('#SelEditCountry').val('C'+$scope.EditBranch.CountryId);
        $scope.UpdateStateList(true, 'C' + $scope.EditBranch.CountryId);
        $scope.updateChosenList();
        $('#EditView').css('display', 'block');
        $scope.ScrollPageUp();
    }

    $scope.ExitEdit = function () {
        $scope.EditBranch = {};
        $('#MainView').slideDown();
        $('#EditView').css('display', 'none');
    }

    $scope.SubmitEditBranch = function (confirmed) {
        if (!confirmed) {
            $scope.ConfirmBeforeAction('Confirm Update!', 'Are you sure you want to edit this Branch record?<br>' + //
                'Your action will have system wide implications!<br><br>' +//
                '<b>Do you want to continue?</b>',
                function () { $scope.SubmitEditBranch(true) });
            return;
        }
        var stateid = $('#SelEditState').val();
        if (stateid == '-') {
            $scope.MessageAlert('You need to select a state for this branch.', 'error');
            return;
        }
        var CountryId = $('#SelEditCountry').val();
        if (CountryId == '-') {
            $scope.MessageAlert('You need to select a country for this branch.', 'error');
            return;
        }
        if (!$scope.EditBranch.BranchName || !$scope.EditBranch.Location) {
            $scope.MessageAlert('Branch name and Location are compulsory fields.', 'error');
            return;
        }
        $scope.EditBranch.StateId = stateid;
        var SelectedCountry = $.grep($scope.Countries, function (e) { return e.CountryCode == CountryId; })[0];
        $scope.EditBranch.CountryId = SelectedCountry.Id;
        $scope.EditBranch.DateCreated = new Date("October 13, 2014 11:13:00"); //arbitrary date, not to be used
        $scope.EditBranch.CreatedBy = $scope.user.Id;

        $.support.cors = true;
        AjaxOptions.data = JSON.stringify({ tInfo: $scope.EditBranch });
        AjaxOptions.url = $scope.serviceURL + "/CompanyBranchUpdate";
        $.ajax(AjaxOptions).done(function (results) {
            if (results.d > 0) {
                $scope.MessageAlert('Branch update was successful', 'success');
                console.log(results);
                ApplyViewChanges($scope);
                $scope.getBranches();
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
    var Branchtable;
    var BranchtableFormatted = true; //false = enable custom drop down
    $scope.FixBranchData = function () {
        Branchtable = $scope.DoDataTable(BranchtableFormatted, 'tblBranches', $scope.branches, $scope.BindDeleteFunction, //
            ["BranchName", "CountryName", "StateName", "Location", "BranchDetails" ],//
            false, true, "BranchName", $scope.PrepareEdit);
    }

    $scope.DeleteBranch = function (BranchId, confirmed) {
        if (!confirmed) {
            $scope.ConfirmBeforeAction('Confirm Delete!', 'Are you sure you want to remove this Branch?<br>' + //
                'All associated data including employee-branch relationships will also be lost!<br><br>' +//
                '<b>Do you want to continue?</b>',
                function () { $scope.DeleteBranch(BranchId, true) });
            return;
        }
        $.support.cors = true;
        AjaxOptions.data = JSON.stringify({ Id: BranchId });
        AjaxOptions.url = $scope.serviceURL + "/CompanyBranchByIdDelete";
        $.ajax(AjaxOptions).done(function (results) {
            console.log(results);
            if (results.d > 0) {
                $scope.getBranches();
                $scope.MessageAlert('Branch record deleted.', 'success');
                $scope.ExitEdit();
            }
            else {
                $scope.MessageAlert('Request did not complete successfully. Please try again later.', 'error');
            }
        }
        ).fail(AjaxFail);
    }

    $scope.ListCountries();
    $scope.getBranches();
}