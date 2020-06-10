function pipeCtrl($scope, $http) {

    $('body').css('visibility', 'hidden');
    ShowBusyMode();
    $scope.$on('UserRolesListed', function (event) {
        var IsMyRoleNext = $.grep($scope.UserRoles, function (e) { return e.RoleName == $scope.LastWorkflow.ToRoleName; }).length;
        if (IsMyRoleNext > 0) {
            //user can work on the request
            localStorage.setItem('requisitionid', $scope.RequisitionId);
            $('body').css('visibility', 'visible');
            window.location.href = "#/approvals";
        }
        else if ($scope.LastWorkflow.Id == 0) {
            //no one has ever worked on this request. We need to check if user still belongs to the first 
            //expected role
            $scope.CheckFirstRole();
        }
        else {
            //wrong email sent or another person has worked on the request
            // alert('. Thank you.');
            $scope.ThrowPageError('Oh Snap!', 'A colleague may have worked on this request or you do not have the right to work on request');
        }
    });

    $scope.DecryptToken = function (token) {
        $.support.cors = true;
        AjaxOptions.data = JSON.stringify({ str: $scope.decode(token) });
        AjaxOptions.url = $scope.serviceURL + "/DecriptString";
        try {
            $.ajax(AjaxOptions).done(function (results) {
                console.log(results);
                $scope.DecryptedToken = results.d;
                $scope.ProcessPipe();
            }
            ).fail(AjaxFail);
        } catch (e) {
            //redirect to error screen
        }
    }

    $scope.CheckFirstRole = function () {
        $.support.cors = true;
        AjaxOptions.data = JSON.stringify({ str: $scope.decode($scope.FirstRoleId) });
        AjaxOptions.url = $scope.serviceURL + "/DecriptString";
        try {
            $.ajax(AjaxOptions).done(function (results) {
                console.log(results);
                if (results.d) {
                    $scope.FirstRoleId = results.d;
                    var IsMyRoleNext = $.grep($scope.UserRoles, function (e) { return e.RolesAssetId == $scope.FirstRoleId; }).length;
                    if (IsMyRoleNext > 0) {
                        //user can work on the request
                        localStorage.setItem('requisitionid', $scope.RequisitionId);
                        $('body').css('visibility', 'visible');
                        window.location.href = "#/approvals";
                    }
                    else {
                        //user cannot work on this request
                        $scope.ThrowPageError('Oh Snap!', 'A colleague may have worked on this request or you do not have the right to work on request');
                    }
                    
                }
                else {
                    //error if results == null
                    $scope.ThrowPageError();
                }
            }
            ).fail(AjaxFail);
        } catch (e) {
            //redirect to error screen
        }
    }

    $scope.GetLastWorkflowRow = function (RequisitionId) {
        $.support.cors = true;
        AjaxOptions.data = JSON.stringify({ RequisitionId: RequisitionId });
        AjaxOptions.url = $scope.serviceURL + "/StaffRequisitionsWorkFlowByRequisitionsIdGet";
        //StaffRequisitionsWorkFlowByRequisitionsIdGet 
        // this fetches the row for the last action on the request 
        // row will contain next role to action request
        try {
            $.ajax(AjaxOptions).done(function (results) {
                console.log(results);
                if (results.d) {
                    $scope.LastWorkflow = results.d; // results.d is a row
                    
                    //fetch current rolename (backend logic contrained us to  comparing using rolename) from lastworkflow
                    //meanwhile fetch this user's roles (that's if he's loggedon);
                    //objective is to compare his current roles with the next role to work on the request
                    if ($scope.user) {
                        $scope.RequisitionId = RequisitionId;
                        $scope.ListUserRoles($scope.user.Id);
                        //logic continues at $on('userroleslisted');
                    }
                }
                else {
                    //error if results == null
                    $scope.ThrowPageError('Oh Snap!', 'The system encountered a glitch while retrieving details of the request and approval history. Ensure your network connection is okay and try again.');
                }
            }
            ).fail(AjaxFail);
        } catch (e) {
            //redirect to error screen
            $scope.ThrowPageError();
        }
    }

    $scope.DecryptedToken;
    $scope.ProcessPipe = function () {
        if ($scope.Action == 'p') {
            //$.session.clear();
            Cookies.remove('user', { path: '/' }); //for forgetting logged on user
            localStorage.setItem('resetemail', $scope.DecryptedToken);
            window.location.href = "../passwordreset.html";
        }
        else if ($scope.Action == 'w') {
            var RequisitionId = $scope.DecryptedToken;
            $scope.GetLastWorkflowRow(RequisitionId);
        }
        else if ($scope.Action == 'a') {
            //acknowledge
            var RequisitionId = $scope.DecryptedToken;
            localStorage.setItem('requisitionid', RequisitionId);
            $('body').css('visibility', 'visible');
            window.location.href = "#/requisition";
        }


    }

    $scope.EnsureUserLogsIn = function () {
        if (!$scope.user) {
            //if user isnt logged on, save workflow id and intent=w in session and redirect to logon page
            //$.session.clear();
            localStorage.setItem('hasintent', '1');
            localStorage.setItem('intent', $scope.Action);
            if ($scope.Action == 'w') {
                localStorage.setItem('requisitionid', $scope.Token);
                localStorage.setItem('toroleid', $scope.FirstRoleId);
            }
            else {
                localStorage.setItem('token', $scope.Token);
            }
            window.location.href = "../login.html";
        }
    }

    $scope.Action = $scope.getUrlParameter('action');
    if ($scope.Action != 'w') {
        $scope.Token = $scope.getUrlParameter('token');
    } else {
        $scope.Token = $scope.getUrlParameter('requisitionId');
        $scope.FirstRoleId = $scope.getUrlParameter('toRoleWFId');
    }

    if ($scope.Action != 'p') {
        $scope.EnsureUserLogsIn();
    }
    $scope.DecryptToken($scope.Token);

}