function rolesCtrl($scope, $http) {

    $scope.EditMode = false;
    TweakSkin();
    $scope.NewRole = {
        PortalId: $scope.user.PortalId, RoleName: null, RoleDescription: "",
        IsFixed: false, CreatedBy: $scope.user.Id
    };

    $scope.RemoveMapping = function (MenuId) {
        var CurrentMapping = $.grep($scope.RoleMappings, function (e) { return e.PagesAssetId == MenuId; })[0];
        $.support.cors = true;
        AjaxOptions.data = JSON.stringify({ Id: CurrentMapping.Id });
        AjaxOptions.url = $scope.serviceURL + "/PagesRolesMappingByIdDelete";
        try {
            $.ajax(AjaxOptions).done(function (results) {
                console.log(results);
                if (results.d <= 0) {
                    $scope.MessageAlert('Request did not complete successfully. Please try again later.', 'error');
                }
            }
            ).fail(AjaxFail);
        } catch (e) {
            $scope.MessageAlert('Request not completed, please check your network connection!', 'error');
        }
    }

    $scope.AddRoleMapping = function(MenuIds, RoleId)
    {
        //iPRM
        var CurrentRoleId;
        if (!RoleId) {
            CurrentRoleId = $scope.EditRole.Id;
        }
        else {
            CurrentRoleId = RoleId;
        }
        var NewMapping = {
            Id: 0, PortalId: $scope.user.Id, PagesAssetId: 0, RolesAssestId: CurrentRoleId,
            CreatedBy: $scope.user.Id, DateCreated: new Date("October 13, 2014 11:13:00") //irrelevant date
        }
        var MappingsToSend = [];
        for (var i = 0; i < MenuIds.length; i++) {
            var newObject = jQuery.extend(true, {}, NewMapping);
            newObject.PagesAssetId = MenuIds[i];
            MappingsToSend.push(newObject);
        }

        $.support.cors = true;
        AjaxOptions.data = JSON.stringify({ iPRM: MappingsToSend });
        AjaxOptions.url = $scope.serviceURL + "/PagesRolesMappingAdd";
        try {
            $.ajax(AjaxOptions).done(function (results) {
                console.log(results);
                if (results.d < 0) {
                    $scope.MessageAlert('Request did not complete successfully. Please try again later.', 'error');
                }
            }
            ).fail(AjaxFail);
        } catch (e) {
            $scope.MessageAlert('Request not completed, please check your network connection!', 'error');
        }

    }

    $scope.AddRole = function () {
        if (!$scope.NewRole.RoleName) {
            $scope.MessageAlert('Role name is mandatory.', 'error');
            return;
        }
        var Permissions = $('#SelPermission').val();
        if (!Permissions) {
            $scope.MessageAlert('At least one page must be mapped to this Role under permissions.', 'error');
            return;
        }
        AjaxOptions.data = JSON.stringify($scope.NewRole);
        AjaxOptions.url = $scope.serviceURL + "/RolesAsssetAdd";
        try {
            $.ajax(AjaxOptions).done(function (results) {
                console.log(results);
                $scope.ListRoles();
                $scope.NewRole = {
                    PortalId: $scope.user.PortalId, RoleName: null, RoleDescription: "",
                    IsFixed: false, CreatedBy: $scope.user.Id
                };
                $scope.AddRoleMapping(Permissions, results.d);
                ApplyViewChanges($scope);
                $scope.MessageAlert('Role added successfully.', 'success');
                $('option.add-permission').removeAttr('selected');
                $scope.updateChosenList();
                $scope.ReturnToList();
            }
            ).fail(AjaxFail);
        } catch (e) {
            $scope.MessageAlert('Request not completed. Please check your network connection!', 'error');
        }
    }


    $('#EditView').slideUp();
    $scope.$on('RolesListed', function (event) {
        $scope.FixRoleData();
    });
    $scope.MenuBlock = {};
    $scope.$on('ChildMenusListed', function (event) {
        //$scope.FixRoleData();
        // $scope.MenuBlock = jQuery.extend(true, {}, $scope.ParentMenus);
        $scope.MenuBlock = $scope.ParentMenus;
        for (var i = 0; i < $scope.MenuBlock.length; i++) {
            $scope.MenuBlock[i].ChildList = $.grep($scope.ChildMenus, function (e) { return e.ParentId == $scope.MenuBlock[i].Id; });
        }
        ApplyViewChanges($scope);
        $scope.updateChosenList();
    });
    
    $scope.$on('RoleMappingsListed', function (event) {
        for (var i = 0; i < $scope.RoleMappings.length; i++) {
            $('option.edit-mapping[value=' + $scope.RoleMappings[i].PagesAssetId + ']').attr('selected', 'true');
        }
        $scope.updateChosenList();
        ApplyViewChanges($scope);
    });
    $('#MembersList').slideUp();
    $scope.ReturnToList = function () {
        $('#RolesList').slideDown();
        $('#MembersList').slideUp();
    }
    $scope.$on('RoleMembersListed', function (event) {
        //$('#RolesList').slideUp();
        $('#MembersList').slideDown();
        ApplyViewChanges($scope);
        $scope.FixMembersData();
    });

    $scope.ListedRole = {};
    $scope.BindDeleteFunction = function () {
        $('.ParentControls.Delete').click(function () {
            var MyId = $(this).attr('ref');
            $scope.DeleteRole(MyId);
        });

        $('.ParentControls.Edit').click(function () {
            var MyId = $(this).attr('ref');
            $scope.PrepareEdit(MyId);
        });

        $('.ParentControls.List').click(function () {
            var MyId = $(this).attr('ref');
            
            $scope.ListRoleMembers(MyId);
        });


    }
    $scope.EditRole = {};
    $scope.PrepareEdit = function (ref) {
        if (!$scope.Booleanfy(Number(ref))) {
            return;
        }
        $('#MainView').slideUp();
        $scope.EditRole = $.grep($scope.Roles, function (e) { return e.Id == ref; })[0];
        $scope.ListRoleMappings($scope.EditRole.Id);
        $scope.ListedRole = $scope.EditRole;
        $scope.ListRoleMembers($scope.EditRole.Id);
        $('#EditView').css('display', 'block');
        ApplyViewChanges($scope);
        $scope.EditMode = true;
        $scope.ScrollPageUp();
    }

    $scope.ExitEdit = function () {
        $scope.EditRole = {};
        $('#MembersList').slideUp();
        $('#MainView').slideDown();
        $('#EditView').css('display', 'none');
        $('option.edit-mapping').removeAttr('selected');
        $scope.updateChosenList();
        $scope.EditMode = false;
    }

    $scope.SubmitEditRole = function (confirmed) {
        if (!confirmed) {
            $scope.ConfirmBeforeAction('Confirm Update!', 'Are you sure you want to update Role record?<br>' + //
                'Your action will have system wide implications.<br><br>' +//
                '<b>Do you want to continue?</b>',
                function () { $scope.SubmitEditRole(true) });
            return;
        }
        

        if (!$scope.EditRole.RoleName) {
            $scope.MessageAlert('Role name is mandatory.', 'error');
            return;
        }
        $scope.EditRole.DateCreated = new Date("October 13, 2014 11:13:00"); //arbitrary date, not to be used
        $scope.EditRole.CreatedBy = $scope.user.Id;
        AjaxOptions.data = JSON.stringify({ rfidInfo: $scope.EditRole });
        AjaxOptions.url = $scope.serviceURL + "/RolesAsssetUpdate";
        try {
            $.ajax(AjaxOptions).done(function (results) {
                console.log(results);
                $scope.ListRoles();
                if (results.d > 0) {
                    $scope.MessageAlert('Role update was successful', 'success');
                    console.log(results);
                    ApplyViewChanges($scope);
                    $scope.ListRoles();
                    $scope.ExitEdit();
                    $scope.EditRole = {};
                }
                else {
                    $scope.MessageAlert('An error occurred. Please try again later.', 'error');
                    console.log(results);
                }
            }
            ).fail(AjaxFail);
        } catch (e) {
            $scope.MessageAlert('Request not completed, please check your network connection!', 'error');
        }


    }

    ///------------------------------------
    var Roletable;
    var RoletableFormatted = true; //false = enable custom drop down
    $scope.FixRoleData = function () {
        Roletable = $scope.DoDataTable(RoletableFormatted, 'tblRoles', $scope.Roles, $scope.BindDeleteFunction, //
           ["RoleName", "RoleDescription"],//
           false, true, "RoleName", $scope.PrepareEdit);

    }

    $scope.DeleteRole = function (RoleId, confirmed) {
        if (!confirmed) {
            $scope.ConfirmBeforeAction('Confirm Delete!', 'Are you sure you want to Remove this Role?<br>' + //
                'All information associated with this Role will be lost including User-Role Memberships.<br><br>' +//
                '<b>Do you want to continue?</b>',
                function () { $scope.DeleteRole(RoleId, true) });
            return;
        }
        $scope.HideModal();
        $.support.cors = true;
        AjaxOptions.data = JSON.stringify({ Id: RoleId });
        AjaxOptions.url = $scope.serviceURL + "/RolesAsssetByIdDelete";
        try {
            $.ajax(AjaxOptions).done(function (results) {
                console.log(results);
                if (results.d > 0) {
                    $scope.ListRoles();
                    $scope.MessageAlert('Role record deleted.', 'success');
                }
                else {
                    $scope.MessageAlert('Request did not complete successfully. Please try again later.', 'error');
                }
            }
            ).fail(AjaxFail);
        } catch (e) {
            $scope.MessageAlert('Request not completed, please check your network connection!', 'error');
        }
    }

    $('.chosen-select').on('change', function (evt, params) {
        if (!$scope.EditMode) return;
        if (params.selected) {
            var Addition = [];
            Addition.push(params.selected);
            $scope.AddRoleMapping(Addition);
        }
        if (params.deselected) {
            $scope.RemoveMapping(params.deselected);
        }
    });


    var Memberstable;
    var MemberstableFormatted = true; //false = enable custom drop down
    $scope.FixMembersData = function () {
        Memberstable = $scope.DoDataTable(MemberstableFormatted, 'tblRoleMembers', $scope.RoleMembers, $scope.BindMemberControlFunction, //
         ["SurName", "OtherNames", "Controls"],//
         false, true, undefined, undefined);

       
    }

    $scope.BindMemberControlFunction = function () {
        $('.ParentControls.label-danger').unbind('click');
        $('.ParentControls.label-danger').click(function () {
            var MyId = $(this).attr('ref');
            $scope.DenyUserRoleGlobal(MyId, function () { $scope.ListRoleMembers($scope.ListedRole.Id); });
        });
    }
    $scope.ListRoles();
    $scope.ListChildMenus();
}