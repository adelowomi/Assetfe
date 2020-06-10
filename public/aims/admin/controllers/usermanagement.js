function usermanagementCtrl($scope, $http) {

    
    $scope.ResetData = function () {
        $scope.NewAccount = {
            isGuardian: false, PortalId: $scope.user.PortalId, StaffCode: "", BranchId: null, DepartmentId: null,
            surname: null, othernames: null, email: null, phonenumber: "", Address: "", AddressStreet: "", PositionId: 0,
            AddressCity: "", PhotoURL: "/no-photo.phf", UserSignURL: "/no-signature.phf", CreatedBy: $scope.user.Id, IsActive: true, IsSuperUser: false, IsPortalAdmin: false
        };
    }

    $scope.ResetData();
    $scope.CollapseSection('#AddSection');
    $scope.UploadedPassport = { done: false };
    $scope.UploadedSign = { done: false };
    $scope.EditedPassport = { done: false };
    $scope.EditedSign = { done: false };
    d = new Date();
    $scope.PassportFile = { filename: "" };// 
    $scope.SignFile = { filename: "" };
    $scope.MakeDropZone('#profilepic', $scope.PassportFile, RootFolder + '/Users/' + $scope.user.PortalId + '/Passport',
        '/Users/' + $scope.user.PortalId + '/Passport/', $scope.UploadedPassport);
    $scope.MakeDropZone('#signature', $scope.SignFile, RootFolder + '/Users/' + $scope.user.PortalId + '/Signatures',
        '/Users/' + $scope.user.PortalId + '/Signatures/', $scope.UploadedSign);

    $scope.MakeDropZone('#ImgEditPassport', $scope.PassportFile, RootFolder + '/Users/' + $scope.user.PortalId + '/Passport',
        '/Users/' + $scope.user.PortalId + '/Passport/', $scope.EditedPassport);
    $scope.MakeDropZone('#ImgEditSignature', $scope.SignFile, RootFolder + '/Users/' + $scope.user.PortalId + '/Signatures',
        '/Users/' + $scope.user.PortalId + '/Signatures/', $scope.EditedSign);

    TweakSkin();
    
    $scope.CreateUser = function () {
        
        var branchid = $('#selBranch').val();
        if (branchid == '-') {
            $scope.MessageAlert('Kindly specify a branch for this user.', 'error');
            return;
        }
        $scope.NewAccount.BranchId = branchid;

        var DeptId = $('#SelDepartment').val();
        if (DeptId == '-') {
            $scope.MessageAlert('Kindly specify a Department for this user.', 'error');
            return;
        }
        $scope.NewAccount.DepartmentId = DeptId;

        if (!$scope.NewAccount.surname || !$scope.NewAccount.othernames || !$scope.NewAccount.StaffCode || !$scope.NewAccount.email ) {
            $scope.MessageAlert('Incomplete data in form. Please fill form properly before submitting.');
            return;
        }
        if ($scope.UploadedPassport.done) {
            $scope.NewAccount.PhotoURL = '/Users/' + $scope.user.PortalId + '/Passport/' + $scope.PassportFile.filename;
        }
        if ($scope.UploadedSign.done) {
            $scope.NewAccount.UserSignURL = '/Users/' + $scope.user.PortalId + '/Signatures/' + $scope.SignFile.filename;
        }
        
        $scope.NewAccount.IsSuperUser = $('#ChkSuperUser').prop('checked');
        $scope.NewAccount.IsPortalAdmin = $('#ChkPortalAdmin').prop('checked');

        $scope.NewAccount.hostname = Hostname;
        $.support.cors = true;
        AjaxOptions.data = JSON.stringify($scope.NewAccount);
        AjaxOptions.url = $scope.serviceURL + "/UsersAdd";
        $.ajax(AjaxOptions).done(function (results) {
            console.log(results);
            if (results.d > 0) {
                $scope.ResetData();
                $scope.getallusers();
                $('#profilepic, #signature').removeAttr('src');
                $scope.UploadedPassport.done = false;
                $scope.UploadedSign.done = false;
                $scope.GiveUserRoles(results.d, $('#SelRoles').val());
                ApplyViewChanges($scope);
                $scope.MessageAlert('New user account created successfully.', 'success');
                $('#SelRoles').val('-');
                $('#ChkPortalAdmin, #ChkSuperUser').prop('checked', false);
                $('#ChkPortalAdmin, #ChkSuperUser').iCheck('update');
                $scope.updateChosenList();
                //$scope.getAvailableIDCard();
            }
            else if (results.d == -2) {
                $scope.MessageAlert('A user exists with the specified email. Emails are unique, please specify a unique email.', 'error');
            }
            else {
                $scope.MessageAlert('Request did not complete successfully. Please try again later.', 'error');
            }
        }
        ).fail(AjaxFail);
    }

    $scope.$on('BranchesListed', function (event) {
        ApplyViewChanges($scope);
        $scope.updateChosenList();
    });
    $scope.$on('DepartmentsListed', function (event) {
        ApplyViewChanges($scope);
        $scope.updateChosenList();
    });
    $scope.$on('RolesListed', function (event) {
        ApplyViewChanges($scope);
        $scope.updateChosenList();
    });

    $scope.BranchDepartments = {};
    $scope.FetchBranchDepartments = function (BranchId) {
        if (BranchId == '-') {
            $scope.BranchDepartments = {};
        }
        else {
            $scope.BranchDepartments = $.grep($scope.Departments, function (e) { return e.CompanyBranchId == BranchId; });
        }
        ApplyViewChanges($scope);
        $scope.updateChosenList();
    }

    $('#selBranch').change(function () {
        $scope.FetchBranchDepartments($(this).val());
    });

    $('#SelEditBranch').change(function () {
        $scope.FetchBranchDepartments($(this).val());
    });

    $scope.NewRoleTemplate = {Id: 0, PortalId: $scope.user.PortalId, UsersId: null, RolesAssetId: null,
        Email: "", DepartmentId: 0, CreatedBy: $scope.user.Id, DateCreated: new Date("October 13, 2014 11:13:00"), //arbitrary date, not to be used
        SurName: "", OtherNames: ""
    }

    $scope.GiveUserRoles = function(UserId, RoleIds)
    {
        if (!RoleIds) return;   
        var ds = [];
        for (var i = 0; i < RoleIds.length; i++) {
            var newObject = jQuery.extend(true, {}, $scope.NewRoleTemplate);
            newObject.UsersId = UserId;
            newObject.RolesAssetId = RoleIds[i];
            ds.push(newObject);
        }

        $.support.cors = true;
        AjaxOptions.data = JSON.stringify({arrauInfo: ds});
        AjaxOptions.url = $scope.serviceURL + "/RolesAssetUsersAdd";
        $.ajax(AjaxOptions).done(function (results) {
            console.log(results);
            if (results.d > 0) {
                $scope.MessageAlert('Roles granted successfully.', 'success');
                //$scope.getAvailableIDCard();
            }
            else {
                $scope.MessageAlert('Roles were not granted to user.', 'error');
            }
        }
        ).fail(AjaxFail);
    }

    $scope.DenyUserRole = function (RoleId) {
        $.support.cors = true;
        var MappingId = $.grep($scope.UserRoles, function (e) { return e.RolesAssetId == RoleId; })[0].Id;
        AjaxOptions.data = JSON.stringify({ Id: MappingId});
        AjaxOptions.url = $scope.serviceURL + "/RolesAssetUsersByIdDelete";
        $.ajax(AjaxOptions).done(function (results) {
            console.log(results);
            if (results.d > 0) {
                $scope.MessageAlert('Role denied successfully.', 'warning');
                //$scope.getAvailableIDCard();
            }
            else {
                $scope.MessageAlert('An error occurred. Request was not completed.', 'error');
            }
        }
        ).fail(AjaxFail);
    }

    $('#EditView').slideUp();
    $scope.$on('UsersListed', function (event) {
        //$scope.FixUserData();
        Usertable = $scope.DoDataTable(UsertableFormatted, 'tblUsers', $scope.allusers, $scope.BindDeleteFunction, //
            ["PassportImage", "StaffCode", "SurName", "OtherNames", "Email", "Mobile", "BranchName", "DepartmentName"],//
            false, true, "Email", $scope.PrepareEdit);
    });
    $scope.$on('UserRolesListed', function (event) {
        for (var i = 0; i < $scope.UserRoles.length; i++) {
            $('option.edit-mapping[value=' + $scope.UserRoles[i].RolesAssetId + ']').attr('selected', 'true');
        }
        $scope.updateChosenList();
        ApplyViewChanges($scope);
    });
    //RolesAssetId
    $scope.BindDeleteFunction = function () {
        $('.ParentControls.Delete').click(function () {
            var MyId = $(this).attr('ref');
            $scope.DeleteUser(MyId);
        });

        $('.ParentControls.Edit').click(function () {
            var MyId = $(this).attr('ref');
            $scope.PrepareEdit(MyId);
        });


    }

    $scope.EditUser = {};
    $scope.PrepareEdit = function (ref) {
        if(!$scope.Booleanfy(Number(ref)))
        {
            return;
        }
        $scope.BranchDepartments = $scope.Departments;
        ApplyViewChanges($scope);
        
        $('#MainView').slideUp();
        $scope.EditUser = $.grep($scope.allusers, function (e) { return e.Id == ref; })[0];
        $scope.ListUserRoles($scope.EditUser.Id);
        if ($scope.EditUser.PhotoUrl != "") {
            $('#ImgEditPassport').attr('src', $scope.PictureRoot + $scope.EditUser.PhotoUrl);
        } else {
            $('#ImgEditPassport').attr('src', 'images/upload_photo.jpg');
        }
        if ($scope.EditUser.UserSignURL != "") {
            $('#ImgEditSignature').attr('src', $scope.PictureRoot + $scope.EditUser.UserSignURL);
        } else {
            $('#ImgEditSignature').attr('src', 'images/upload_signature.jpg');
        }
        $('#SelEditBranch').val($scope.EditUser.BranchId);
        $('#SelEditDepartment').val($scope.EditUser.DepartmentId);
        $scope.updateChosenList();
        $('#ChkEditSuperUser').prop('checked', $scope.EditUser.IsSuperUser);
        $('#ChkEditPortalAdmin').prop('checked', $scope.EditUser.IsPortalAdmin);
        $('#ChkEditPortalAdmin, #ChkEditSuperUser').iCheck('update');

        $('#EditView').css('display', 'block');
        $scope.EditMode = true;
        
        if ($scope.EditUser.IsActive) {
            mySwitch.turnOn();
        }
        else {
            mySwitch.turnOff();
        }
        var mesg = "";
        mesg = $scope.EditUser.IsActive ? "enabled" : "disabled";
        $('#ChkIsActive+span').text(mesg);
        $scope.ScrollPageUp();
    }

    $scope.ExitEdit = function () {
        $scope.EditUser = {};
        $('#MainView').slideDown();
        $('#EditView').css('display', 'none');
        $('#ImgEditSignature').removeAttr('src');
        $('#ImgEditPassport').removeAttr('src');
        $scope.EditMode = false;
        $('option.edit-mapping').removeAttr('selected');
        $scope.updateChosenList();
        $("html, body").animate({ scrollTop: 90 }, "slow");
        Usertable.columns.adjust().draw();
    }

    $scope.SubmitEditUser = function (IsActiveOnly, IsActiveValue, confirmed) {

        if (!IsActiveOnly) {
            if (!confirmed) {
                $scope.ConfirmBeforeAction('Confirm Update!', 'Are you sure you want to update this user\'s records?<br>' + //
                    'You action will have system wide implications.<br><br>' +//
                    '<b>Do you want to continue?</b>',
                    function () { $scope.SubmitEditUser(IsActiveOnly, IsActiveValue, true) });
                return;
            }
            

            var branchid = $('#SelEditBranch').val();
            if (branchid == '-' || !$scope.Booleanfy(branchid)) {
                //$scope.MessageAlert('Kindly specify a branch for this user.', 'error');
                //return;
                branchid = 0;
            }
            $scope.EditUser.BranchId = branchid;

            var DeptId = $('#SelEditDepartment').val();
            if (DeptId == '-' || !$scope.Booleanfy(DeptId)) {
                //$scope.MessageAlert('Kindly specify a Department for this user.', 'error');
                //return;
                DeptId = 0;
            }
            $scope.EditUser.DepartmentId = DeptId;

            if (!$scope.EditUser.SurName || !$scope.EditUser.OtherNames || !$scope.EditUser.StaffCode || !$scope.EditUser.Email) {
                $scope.MessageAlert('Incomplete data in form. Please fill form properly before submitting.', 'error');
                return;
            }
            if ($scope.EditedPassport.done) {
                $scope.EditUser.PhotoURL = '/Users/'+$scope.user.PortalId+'/Passport/' + $scope.PassportFile.filename;
            }
            if ($scope.EditedSign.done) {
                $scope.EditUser.UserSignURL = '/Users/' + $scope.user.PortalId + '/Signatures/' + $scope.SignFile.filename;;
            }
            
            
        }
        else {
            $scope.EditUser.IsActive = IsActiveValue;
        }
        
        $scope.EditUser.DateCreated = new Date("October 13, 2014 11:13:00"); //arbitrary date, not to be used
        $scope.EditUser.CreatedBy = $scope.user.Id;
        $scope.EditUser.IsSuperUser = $('#ChkEditSuperUser').prop('checked');
        $scope.EditUser.IsPortalAdmin = $('#ChkEditPortalAdmin').prop('checked');
        delete $scope.EditUser.__type;
        AjaxOptions.data = JSON.stringify({ uInfo: $scope.EditUser });
        AjaxOptions.url = $scope.serviceURL + "/UsersUpdate";
        $.ajax(AjaxOptions).done(function (results) {
            if (!IsActiveOnly) {
                if (results.d > 0) {
                    $scope.MessageAlert('User update was successful', 'success');
                    console.log(results);
                    ApplyViewChanges($scope);
                    $scope.getallusers();
                    $scope.EditedPassport.done = false;
                    $scope.EditedSign.done = false;
                    $('#ChkEditPortalAdmin, #ChkEditSuperUser').prop('checked', false);
                    $('#ChkEditPortalAdmin, #ChkEditSuperUser').iCheck('update');
                    $scope.ExitEdit();
                    $scope.EditUser = {};
                }
                else {
                    $scope.MessageAlert('An error occurred. Please try again later.', 'error');
                    console.log(results);
                }
            }
            else {
                if (results.d > 0) {
                    var mesg = "";
                    mesg = IsActiveValue ? "enabled" : "disabled";
                    $scope.MessageAlert('User account ' + mesg, 'warning');
                    $('#ChkIsActive+span').text(mesg);
                }
                else {
                    $scope.MessageAlert('An error occurred. Please try again later.', 'error');
                    console.log(results);
                }
            }
        }
        ).fail(AjaxFail);
    }
    ///------------------------------------
    var Usertable;
    var UsertableFormatted = true; //false = enable custom drop down

    $scope.DeleteUser = function (UserId, confirmed) {
        if (!confirmed) {
            $scope.ConfirmBeforeAction('Confirm Delete!', 'Are you sure you want to Remove this user?<br>' + //
                'All user records including historical information of items in custody of user will be lost.<br><br>' +//
                '<b>Do you want to continue?</b>',
                function () { $scope.DeleteUser(UserId, true) });
            return;
        }
        //$scope.HideModal();
        $.support.cors = true;
        var ThisUser = $.grep($scope.allusers, function (e) { return e.Id == UserId; })[0];
        AjaxOptions.data = JSON.stringify({ UsernameEmail: ThisUser.Email });
        AjaxOptions.url = $scope.serviceURL + "/UsersByEmailDelete";
        $.ajax(AjaxOptions).done(function (results) {
            console.log(results);
            if (results.d > 0) {
                $scope.getallusers();
                $scope.MessageAlert('User record deleted.', 'warning');
            }
            else {
                $scope.MessageAlert('Request did not complete successfully. Please try again later.', 'error');
            }
        }
        ).fail(AjaxFail);
    }
   
    $scope.EditMode = false;
    $('#SelEditRoles.chosen-select').on('change', function (evt, params) {
        if (!$scope.EditMode) return;
        if (params.selected) {
            var Addition = [];
            Addition.push(params.selected);
            $scope.GiveUserRoles($scope.EditUser.Id, Addition);
        }
        if (params.deselected) {
            $scope.DenyUserRole(params.deselected);
        }
    });

    $('#ChkIsActive').change(function () {
        var NewVal = $(this).prop('checked');
        $scope.SubmitEditUser(true, NewVal);
    });

    $scope.getBranches();
    $scope.ListDepartments();
    $scope.ListRoles();
    $scope.getallusers();
}








