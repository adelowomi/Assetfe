function DepartmentCtrl($scope, $http) {
    $scope.newDepartment = {
        PortalId: $scope.user.PortalId, CompanyBranchId: null, DepartmentName: null,  DepartmentDetails: null,
         CreatedBy: $scope.user.Id
    };
    TweakSkin();
    /// ---------------------------------------------------
    $('#EditView').slideUp();

    $scope.addDepartment = function () {
        var branchid = $('#SelBranch').val();
        if (branchid == '-') {
            $scope.MessageAlert('You need to select a branch for this Department.', 'error');
            return;
        }
        
        if (!$scope.newDepartment.DepartmentName) {
            $scope.MessageAlert('Department name is a compulsory field.', 'error');
            return;
        }
        var ds = [];
        if (branchid == '0') {
            for (var i = 0; i < $scope.branches.length; i++) {
                var NewObject;
                NewObject = jQuery.extend(true, {}, $scope.newDepartment);
                NewObject.CompanyBranchId = $scope.branches[i].Id;
                ds.push(NewObject);
            }
        }
        else {
            $scope.newDepartment.CompanyBranchId = branchid;
            ds.push($scope.newDepartment);
        }

        $.support.cors = true;
        AjaxOptions.data = JSON.stringify({arrdInfo: ds});
        AjaxOptions.url = $scope.serviceURL + "/DepartmentAdd";
        $.ajax(AjaxOptions).done(function (results) {
            if (results.d > 0) {
                $scope.MessageAlert('Department added successfully', 'success');
                console.log(results);
                $scope.newDepartment = {
                    PortalId: $scope.user.PortalId, CompanyBranchId: null, DepartmentName: null, DepartmentDetails: null,
                    CreatedBy: $scope.user.Id
                };
                ApplyViewChanges($scope);
                $scope.ListDepartments();
            }
            else {
                $scope.MessageAlert('An error occurred. Please try again later.', 'error');
                console.log(results);
            }
        }
        ).fail(AjaxFail);

    }

    $scope.$on('BranchesListed', function (event) {
        ApplyViewChanges($scope);
        $scope.updateChosenList();
    });

    $scope.$on('DepartmentsListed', function (event) {
        $scope.FixDepartmentData();
    });

    $scope.BindDeleteFunction = function () {
        $('.ParentControls.Delete').click(function () {
            var MyId = $(this).attr('ref');
            $scope.DeleteDepartment(MyId);
        });

        $('.ParentControls.Edit').click(function () {
            var MyId = $(this).attr('ref');
            $scope.PrepareEdit(MyId);
        });


    }
    $scope.EditDepartment = {};
    $scope.PrepareEdit = function (ref) {
        $('#MainView').slideUp();
        $scope.EditDepartment = $.grep($scope.Departments, function (e) { return e.Id == ref; })[0];
        $('#EditView').css('display', 'block');
        ApplyViewChanges($scope);
        $scope.ScrollPageUp();
    }

    $scope.ExitEdit = function () {
        $scope.EditDepartment = {};
        $('#MainView').slideDown();
        $('#EditView').css('display', 'none');
    }

    $scope.SubmitEditDepartment = function (confirmed) {
        if (!confirmed) {
            $scope.ConfirmBeforeAction('Confirm Update!', 'Are you sure you want to update Department record?<br>' + //
                'Your action will have system wide implications<br><br>' +//
                '<b>Do you want to continue?</b>',
                function () { $scope.SubmitEditDepartment(true) });
            return;
        }
        if (!$scope.EditDepartment.DepartmentName) {
            $scope.MessageAlert('Department name is a compulsory field.', 'error');
            return;
        }
        $scope.EditDepartment.DateCreated = new Date("October 13, 2014 11:13:00"); //arbitrary date, not to be used
        $scope.EditDepartment.CreatedBy = $scope.user.Id;

        $.support.cors = true;
        AjaxOptions.data = JSON.stringify({ rfidInfo: $scope.EditDepartment });
        AjaxOptions.url = $scope.serviceURL + "/DepartmentUpdate";
        $.ajax(AjaxOptions).done(function (results) {
            if (results.d > 0) {
                $scope.MessageAlert('Department update was successful', 'success');
                console.log(results);
                ApplyViewChanges($scope);
                $scope.ListDepartments();
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
    var Departmenttable;
    var DepartmenttableFormatted = true; //false = enable custom drop down
    $scope.FixDepartmentData = function () {
        Departmenttable = $scope.DoDataTable(DepartmenttableFormatted, 'tblDepartment', $scope.Departments, $scope.BindDeleteFunction, //
             ["DepartmentName", "BranchName", "DepartmentDetails"],//
             false, true, "DepartmentName", $scope.PrepareEdit);
    }

    $scope.DeleteDepartment = function (DepartmentId, confirmed) {
        if (!confirmed) {
            $scope.ConfirmBeforeAction('Confirm Delete!', 'Are you sure you want to delete this Department?<br>' + //
                'All associated information will also be lost including department-employee associations.<br><br>' +//
                '<b>Do you want to continue?</b>',
                function () { $scope.DeleteDepartment(DepartmentId, true) });
            return;
        }
        $.support.cors = true;
        AjaxOptions.data = JSON.stringify({ Id: DepartmentId });
        AjaxOptions.url = $scope.serviceURL + "/DepartmentByIdDelete";
        $.ajax(AjaxOptions).done(function (results) {
            console.log(results);
            if (results.d > 0) {
                $scope.ListDepartments();
                $scope.MessageAlert('Department record deleted.', 'success');
                $scope.ExitEdit();
            }
            else {
                $scope.MessageAlert('Request did not complete successfully. Please try again later.', 'error');
            }
        }
        ).fail(AjaxFail);
    }

    $scope.getBranches();
    $scope.ListDepartments();
}