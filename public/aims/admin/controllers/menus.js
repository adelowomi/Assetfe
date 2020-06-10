function menusCtrl($scope, $http) {

    if (!$scope.user.IsSuperUser) {
        ThrowPageError('Access Denied!', 'Sorry, you do not have access to the page requested.');
        return;
    }
    $scope.NewModule = { ParentId: null, PageName: null, PageURL: null, ListOrder: null,
        IconClass: null, CreatedBy: $scope.user.Id
    }
   
    TweakSkin();

    $scope.DeleteChildMenu = function (MenuId) {
        $.support.cors = true;
        AjaxOptions.data = JSON.stringify({Id: MenuId});
        AjaxOptions.url = $scope.serviceURL + "/PagesAssetByIdDelete";
        $.ajax(AjaxOptions).done(function (results) {
            console.log(results);
            $scope.ListChildMenus();
            $scope.ListParentChildMenus(CurrentParentId);
        }
        ).fail(AjaxFail);
    }

    $scope.DeleteParentMenu = function (MenuId) {
        $.support.cors = true;
        AjaxOptions.data = JSON.stringify({ Id: MenuId });
        AjaxOptions.url = $scope.serviceURL + "/PagesParentByIdDelete";
        $.ajax(AjaxOptions).done(function (results) {
            console.log(results);
            $scope.ListChildMenus();
            $scope.ListParentMenus();
        }
        ).fail(AjaxFail);
    }

    $scope.IsChild = false;
    $scope.EditModule = {};
    $scope.StartEdit = function (ref, target, IsChild) {
        $scope.EditModule = $.grep(target, function (e) { return e.Id == ref; })[0];
        if (IsChild != undefined) {
            $scope.IsChild = IsChild;
            if (IsChild) {
                $('#SelEditModule').val($scope.EditModule.ParentId);
                $scope.updateChosenList();
            }
        }
        else {
            $scope.IsChild = false;
        }
        ApplyViewChanges($scope);
        $('#DefaultView').slideUp();
        $('#EditView').css('display', 'block');
    }

    $scope.ExitEdit = function () {
        $scope.EditModule = {};
        $('#DefaultView').slideDown();
        $('#EditView').css('display', 'none');
    }

    $scope.AddModule = function () {
        $scope.NewModule.ParentId = $('#selParent').val();
        var WebMethod = "";
        if ($scope.NewModule.ParentId == '-') {
            alert('You need to specify the Parent Menu.');
            return;
        }
        else if ($scope.NewModule.ParentId == '0') {
            WebMethod = $scope.serviceURL + "/PagesParentAdd";
            $scope.NewModule.ListOrder = $scope.GetHighestListOrder() + 1;
        }
        else {
            WebMethod = $scope.serviceURL + "/PagesAssetAdd";
            $scope.NewModule.ListOrder = $scope.GetHighestListOrder($scope.NewModule.ParentId) + 1;
        }
        
        $.support.cors = true;
        AjaxOptions.data = JSON.stringify($scope.NewModule);
        AjaxOptions.url = WebMethod;
        $.ajax(AjaxOptions).done(function (results) {
            console.log(results);
            $scope.NewModule = {
                ParentId: null, PageName: null, PageURL: null, ListOrder: null,
                IconClass: null, CreatedBy: $scope.user.Id
            }
            $scope.ListParentMenus();
            $scope.ListChildMenus();
            ApplyViewChanges($scope);
        }
        ).fail(AjaxFail);
    }
    //--------------------------------------------
    $scope.SendEditModule = function () {
        $scope.EditModule.ParentId = $('#SelEditModule').val();
        if (($scope.EditModule.ParentId == '-') && ($scope.IsChild == true)) {
            alert('You need to specify the Parent Menu.');
            return;
        }
        var EditArray = [];
        $scope.EditModule.DateCreated = new Date("October 13, 2014 11:13:00"); //arbitrary date, not to be used
        EditArray.push($scope.EditModule);
        $scope.SendModulesForUpdate(EditArray, true);
        
    }

    $scope.ReOrderDown = function (ref, target) {
        var ModuleToReorder = $.grep(target, function (e) { return e.Id == ref; })[0];
        var MyListOrder = ModuleToReorder.ListOrder;
        var ModuleBelow = $.grep(target, function (e) { return e.ListOrder == MyListOrder + 1; });
        if (ModuleBelow.length <= 0 || ModuleBelow == null) {
            alert('This is the last element!');
            return;
        }
        else {
            MyListOrder++;
            ModuleToReorder.ListOrder = MyListOrder;
            ModuleToReorder.DateCreated = new Date("October 13, 2014 11:13:00");
            ModuleBelow = ModuleBelow[0];
            ModuleBelow.ListOrder--;
            ModuleBelow.DateCreated = new Date("October 13, 2014 11:13:00");
            var ModulesToUpdate = [];
            ModulesToUpdate.push(ModuleToReorder);
            ModulesToUpdate.push(ModuleBelow);
           $scope.SendModulesForUpdate(ModulesToUpdate);
        }
    }
    //
    $scope.ReOrderUp = function (ref, target) {
        var ModuleToReorder = $.grep(target, function (e) { return e.Id == ref; })[0];
        var MyListOrder = ModuleToReorder.ListOrder;
        var ModuleAbove = $.grep(target, function (e) { return e.ListOrder == MyListOrder - 1; });
        if (ModuleAbove.length <= 0 || ModuleAbove == null) {
            alert('This is the first element!');
            return;
        }
        else {
            MyListOrder--;
            ModuleToReorder.ListOrder = MyListOrder;
            ModuleToReorder.DateCreated = new Date("October 13, 2014 11:13:00");
            ModuleAbove = ModuleAbove[0];
            ModuleAbove.ListOrder++;
            ModuleAbove.DateCreated = new Date("October 13, 2014 11:13:00");
            var ModulesToUpdate = [];
            ModulesToUpdate.push(ModuleToReorder);
            ModulesToUpdate.push(ModuleAbove);
            $scope.SendModulesForUpdate(ModulesToUpdate);
        }
    }
    //
    $scope.SendModulesForUpdate = function (subject, fulledit) {
        $.support.cors = true;
        var IsParent = true;
        if (fulledit != true) { //full edit works for normal editing, while the other is for list order editing
            if (subject[0].ParentId == undefined) {
                var ds = { arrPagesParentInfo: subject };
                AjaxOptions.data = JSON.stringify(ds);
                AjaxOptions.url = $scope.serviceURL + "/PagesParentUpdate";
            }
            else {
                IsParent = false;
                var ds = { arrPagesAssetInfo: subject };
                AjaxOptions.data = JSON.stringify(ds);
                AjaxOptions.url = $scope.serviceURL + "/PagesAssetUpdate";
            }
        }
        else {
            if (!$scope.IsChild) {
                var ds = { arrPagesParentInfo: subject };
                AjaxOptions.data = JSON.stringify(ds);
                AjaxOptions.url = $scope.serviceURL + "/PagesParentUpdate";
            }
            else {
                IsParent = false;
                var ds = { arrPagesAssetInfo: subject };
                AjaxOptions.data = JSON.stringify(ds);
                AjaxOptions.url = $scope.serviceURL + "/PagesAssetUpdate";
            }

        }
        $.ajax(AjaxOptions).done(function (results) {
            console.log(results);
            
            
            if (!IsParent) {
                $scope.ListParentChildMenus(subject[0].ParentId);
            }
            else {
                $scope.ListParentMenus();
            }
            subject = [];
            ApplyViewChanges($scope);
            if (fulledit == true) {
                $scope.ExitEdit();
            }
        }
        ).fail(AjaxFail);
    }

    $scope.$on('ParentMenusListed', function (event) {
        ApplyViewChanges($scope);
        $scope.fixDataModule();
        $scope.updateChosenList();
    });

    $scope.$on('ParentChildMenusListed', function (event) {
        $('#' + CurrentParentRef + '>tbody>tr.fieldlist').remove();
        $('#' + CurrentParentRef).fadeOut();
        if ($scope.ParentChildMenus.length > 0) {
            for (var i = $scope.ParentChildMenus.length - 1; i >= 0; i--) {
                $('#' + CurrentParentRef + '>tbody').prepend($scope.ComposeNewChildHTML($scope.ParentChildMenus[i]));
            }
        } else {
            $('#' + CurrentParentRef + '>thead').fadeOut();
            $('#' + CurrentParentRef + '>tbody').prepend('<tr class="fieldlist"><td colspan="5">No child menus available. </td></tr>');
        }
        setTimeout(function () { $('#' + CurrentParentRef).fadeIn(); }, 200);
        $scope.BindChildControlsTrigger();
    });

    $scope.ComposeNewChildHTML = function (child) {
        return '<tr class="fieldlist">' +
                  '<td>'+ child.PageName +'</td>' +
                  '<td>' + child.PageDescription + '</td>' +
            '<td>' + child.PageURL + '</td>' + '<td>' + child.IconClass + '</td>' +
            '<td class="child-menu-controls">' + child.Controls + '</td>'+
              '</tr>'
    }

    $scope.BindReorderTrigger = function () {
        $('img.ReOrderUp').click(function () {
            var ref = $(this).attr('ref');
            $scope.ReOrderUp(ref, $scope.ParentMenus);
        });

        $('img.ReOrderDown').click(function () {
            var ref = $(this).attr('ref');
            $scope.ReOrderDown(ref, $scope.ParentMenus);
        });

        $('img.EditParent').click(function () {
            var ref = $(this).attr('ref');
            $scope.StartEdit(ref, $scope.ParentMenus);
        });

       
    }

    $scope.BindChildControlsTrigger = function () {
        $('img.EditChild').click(function () {
            var ref = $(this).attr('ref');
            $scope.StartEdit(ref, $scope.ParentChildMenus, true);
        });

        $('.ReOrderDownChild').click(function () {
            var ref = $(this).attr('ref');
            $scope.ReOrderDown(ref, $scope.ParentChildMenus);
        });

        $('.ReOrderUpChild').click(function () {
            var ref = $(this).attr('ref');
            $scope.ReOrderUp(ref, $scope.ParentChildMenus);
        });

        $('.DeleteChild').click(function () {
            var MenuId = $(this).attr('ref');
            $scope.DeleteChildMenu(MenuId);
        });

        $('button.ParentDelete').click(function () {
            var ref = $(this).attr('ref');
            $scope.DeleteParentMenu(ref);
        });
    }

    $scope.formatModule = function (d) {
        // `d` is the original data object for the row
        CurrentParentRef = 'Parent' + d.Id.toString();
        CurrentParentId = d.Id;
        $scope.ListParentChildMenus(d.Id);
        
        return '<div class="childcontainer" style="padding-left: 0px; background: #dfc5cc;">' +//
            '<h5 style="font-weight: bold; margin-left: 5px; color: #e1003a;margin-top: 0px; padding-top: 20px">' +
            'Child Modules</h5><table id="' +//
            CurrentParentRef + '" class="childmembers table table-striped" cellpadding="5" cellspacing="0" border="0" style="padding-left:50px; width: 100%;"><thead>' +
            '<tr style="background: #dfc5cc; color: #fff;">' +
                  '<th>Name</th><th>Description</th><th>URL</th><th>Icon Class</th><th></th>' +
              '</tr></thead><tbody>' +
            '<tr>' +
                  '<td colspan="5"><button  type="submit" ref="' + d.Id + '" class="btn btn-danger btn-sm ParentDelete" style="float: right;"><i class="fa fa-close" style="margin-right: 10px;"></i>Delete Menu Family</button></td>' +
              '</tr>' +
            '<tr>' +
                  '<td colspan="5"></td>' 
              '</tr>' +
              

          '</tbody></table><br style="clear: both;" /></div>';
        
    }
    ///------------------------------------
    var Moduletable;
    var ModuletableFormatted = false;
    $scope.fixDataModule = function () {
        try {
            Moduletable.destroy();
        } catch (e) {

        }

        Moduletable = $('#tblModules').DataTable({
            "ordering": false,
            dom: 'T<"clear">lfrtip',
            tableTools: {
                "sSwfPath": "resources/copy_csv_xls_pdf.swf"
            },
            data: $scope.ParentMenus,
            columns: [
                    {
                        "class": 'details-control',
                        "orderable": false,
                        "data": null,
                        "defaultContent": ''
                    },
                    { "data": "PageName" }, { "data": "PageDescription" }, { "data": "Controls" }

            ]
        });


        if (!ModuletableFormatted) {

            // Add event listener for opening and closing details
            $('#tblModules tbody').on('click', 'td.details-control', function () {
                var tr = $(this).parents('tr');
                var row = Moduletable.row(tr);

                if (row.child.isShown()) {
                    // This row is already open - close it
                    row.child.hide();
                    tr.removeClass('shown');
                }
                else {
                    // Open this row
                    row.child($scope.formatModule(row.data())).show();
                    tr.addClass('shown');
                }
                //$scope.BindRoomTypeDelete();
            });
            ModuletableFormatted = true;
        }
        //ensure that the reorder buttons can work
        setTimeout(function () { $scope.BindReorderTrigger(); }, 200);
    }
    //
    $scope.GetHighestListOrder = function (parentid) {
        if (parentid == undefined) {
            if ($scope.ParentMenus.length > 0 && $scope.ParentMenus != null) {
                return $scope.ParentMenus[$scope.ParentMenus.length - 1].ListOrder;
            }
            else {
                return 0;
            }
        }
        else {
            var FellowChildren = $.grep($scope.ChildMenus, function (e) { return e.ParentId == parentid; });
            if (FellowChildren.length > 0 && FellowChildren != null) {
                return FellowChildren[FellowChildren.length - 1].ListOrder;
            }
            else {
                return 0;
            }
        }
    }


    $scope.ListParentMenus();
    $scope.ListChildMenus();
}