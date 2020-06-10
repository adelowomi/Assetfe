function userprofileCtrl ($scope, $http)
{
    TweakSkin();
    //$scope.user = JSON.parse($.session.get('user'));
    $scope.EditUser = $scope.user;
	$.session.set('userid', $scope.user.Id);
	$scope.userid = $.session.get('userid');
	
	$("#profilepic, .profilepics").attr("src", $scope.PictureRoot + $scope.user.PhotoUrl);
	if ($scope.user.UserSignURL == "") {
	    $("#ImgEditSignature").attr("src", "images/upload_signature.jpg");
	}
	else {
	    $("#ImgEditSignature").attr("src", $scope.PictureRoot + $scope.user.UserSignURL);
	}
	var StaffItemsTable;
	var StaffItemsTableFormatted = true; //false = enable custom drop down
	$scope.$on('StaffItemsListed', function (event) {
	    StaffItemsTable = $scope.DoDataTable(StaffItemsTableFormatted, 'tblItems', $scope.StaffItems, undefined, //
             ["BarcodeStr", "ItemName", "DateIssuedReadable", "IsReturnable"],//
             true, true, "BarcodeStr", undefined);
	    $scope.FirstRun = false;
	});
	$scope.$on('DepartmentsListed', function (event) {
	    if ($scope.FirstRun) $scope.ListUserRoles();
	    $scope.BranchDepartments = $scope.Departments;
	    ApplyViewChanges($scope);
	    $('#SelEditDepartment').val($scope.EditUser.DepartmentId);
	    $scope.updateChosenList();
	});
	$scope.$on('BranchesListed', function (event) {
	    if ($scope.FirstRun) $scope.ListDepartments();
	    ApplyViewChanges($scope);
	    $('#SelEditBranch').val($scope.EditUser.BranchId);
	    $scope.updateChosenList();
	});
	$scope.$on('UserRolesListed', function (event) {
	    if ($scope.FirstRun) $scope.ListStaffItems($scope.user.Id);
	    ApplyViewChanges($scope);
	});

	$scope.$on('UploadComplete', function (event) {
	    if ($scope.EditedPassport.done) {
	        $scope.SubmitEditUser(true, true);
	    }
	});

	$scope.$on('UserGotten', function (event) {
	    $scope.user = $scope.GottenUser;
	    $.session.set("user", JSON.stringify($scope.user));
	    Cookies.set('user', JSON.stringify($scope.user), { expires: 1, path: '/' }); //for remembering logged on user
	    $.session.set('username', $scope.user.UserName);
	    $.session.set('fullname', $scope.user.SurName + ' ' + $scope.user.OtherNames);
	    $("#profilepic, .profilepics").attr("src", $scope.PictureRoot + $scope.user.PhotoUrl);
	    $('span.usernamelabel').text($scope.user.SurName + ' ' + $scope.user.OtherNames);
	});

	$scope.PasswordChange = {
	    email: $scope.user.Email, oldPassword: null, newPassword: null, retype: null
	};
	$scope.ChangePassword = function () {
	    if (!$scope.PasswordChange.oldPassword || !$scope.PasswordChange.newPassword ) {
	        $scope.MessageAlert('Please fill form properly', 'error');
	        return;
	    }

	    if ($scope.PasswordChange.newPassword != $scope.PasswordChange.retype) {
	        $scope.MessageAlert('New password and retype doesnt match! Review and retry', 'error');
	        return;
	    }

	    $.support.cors = true;
	    AjaxOptions.data = JSON.stringify($scope.PasswordChange);
	    AjaxOptions.url = $scope.serviceURL + "/UsersChangePassword";
	    $.ajax(AjaxOptions).done(function (results) {
	        console.log(results);
	        if (results.d > 0) {
	            $scope.MessageAlert('Password change was successful', 'success');
	            $scope.MessageAlert('Please wait while you are redirected', 'warning');
	            $scope.PasswordChange = {};
	            ApplyViewChanges($scope);
	            setTimeout(function () {
	                window.location = "../logout.html";
	            }, 4000);
	        }
	        else {
	            $scope.MessageAlert('An error occurred. Please try again later.', 'error');
	        }
	    }
        ).fail(AjaxFail);
	}

	
	$scope.EditedPassport = { done: false };
	$scope.EditedSign = { done: false };
	d = new Date();
	$scope.PassportFile = { filename: "" };// 
	$scope.SignFile = { filename: "" };
	$scope.MakeDropZone('#profilepic', $scope.PassportFile, RootFolder + '/Users/' + $scope.user.PortalId + '/Passport',
       '/Users/' + $scope.user.PortalId + '/Passport/', $scope.EditedPassport);
	$scope.MakeDropZone('#ImgEditSignature', $scope.SignFile, RootFolder + '/Users/' + $scope.user.PortalId + '/Signatures',
        '/Users/' + $scope.user.PortalId + '/Signatures/', $scope.EditedSign);

	$scope.SubmitEditUser = function (PassportOnly, confirmed) {
	    
	    if (!PassportOnly) {
	        if (!confirmed) {
	            $scope.ConfirmBeforeAction('Confirm Update!', 'Are you sure you want to update your profile with the information provided?<br>' + //
                    'You action will have system wide implications.<br><br>' +//
                    '<b>Do you want to continue?</b>',
                    function () { $scope.SubmitEditUser(PassportOnly, true) });
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
	        
	        if ($scope.EditedSign.done) {
	            $scope.EditUser.UserSignURL = '/Users/' + $scope.user.PortalId + '/Signatures/' + $scope.SignFile.filename;;
	        }


	    }
	    else {
	        if ($scope.EditedPassport.done) {
	            $scope.EditUser.PhotoURL = '/Users/' + $scope.user.PortalId + '/Passport/' + $scope.PassportFile.filename;
	        }
	    }

	    $scope.EditUser.DateCreated = new Date("October 13, 2014 11:13:00"); //arbitrary date, not to be used
	    $scope.EditUser.CreatedBy = $scope.user.Id;
	    delete $scope.EditUser.__type;
	    AjaxOptions.data = JSON.stringify({ uInfo: $scope.EditUser });
	    AjaxOptions.url = $scope.serviceURL + "/UsersUpdate";
	    $.ajax(AjaxOptions).done(function (results) {
	        if (!PassportOnly) {
	            if (results.d > 0) {
	                $scope.MessageAlert('Profile update was successful', 'success');
	                ApplyViewChanges($scope);
	                $scope.getallusers();
	                $scope.EditedPassport.done = false;
	                $scope.EditedSign.done = false;
	                
	            }
	            else {
	                $scope.MessageAlert('An error occurred. Please try again later.', 'error');
	                console.log(results);
	            }
	        }
	        else {
	            if (results.d > 0) {
	                
	            }
	            else {
	                $scope.MessageAlert('An error occurred. Please try again later.', 'error');
	                console.log(results);
	            }
	        }
	        $scope.GetUser();
	    }
        ).fail(AjaxFail);
	}


	$scope.FirstRun = true;
	$scope.getBranches();
	
	
	
	//if (!window.mobilecheck()) {
	//    setTimeout(function () {
	//        $("html").css('overflow', 'scroll !important');
	//    }, 2000);
	//}
}
