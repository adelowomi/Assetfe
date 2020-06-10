function itemsCtrl($scope, $http) {

    TweakSkin();
    $scope.NewItem = {
        PortalId: $scope.user.PortalId, ItemCategoryId: null, ItemName: null, ItemDescription: null,
        ItemCode: null, CreatedBy: $scope.user.Id
    };

    $scope.StockItem = function (ItemId) {
        localStorage.setItem('AddItem', ItemId);
        window.location.href = "#/additems";
    }

    $scope.AddItem = function () {
        var ItemCategoryId = $('#SelCategory').val();
        if (ItemCategoryId == '-') {
            $scope.MessageAlert('Please select Item Category.', 'error'); return;
        }
        $scope.NewItem.ItemCategoryId = ItemCategoryId;
        AjaxOptions.data = JSON.stringify($scope.NewItem);
        AjaxOptions.url = $scope.serviceURL + "/ItemsAdd";
        $.ajax(AjaxOptions).done(function (results) {
            console.log(results);
            $scope.getallitems();
            $scope.NewItem = {
                PortalId: $scope.user.PortalId, ItemCategoryId: null, ItemName: null, ItemDescription: null,
                ItemCode: null, CreatedBy: $scope.user.Id
            };
            $scope.MessageAlert('Item added successfully.', 'success');
            ApplyViewChanges($scope);
        }
        ).fail(AjaxFail);

    }


    $('#EditView').slideUp();
    $scope.$on('ItemsListed', function (event) {
        $scope.FixItemData();
    });
    $scope.$on('CategoriesListed', function (event) {
        var AutoCategory = localStorage.getItem('AddCategory');
        $.session.clear('AddCategory');
        ApplyViewChanges($scope);
        if (AutoCategory) {
            $('#SelCategory').val(AutoCategory);
            ExpandSection('.initial-collapse');
        }
        
            $scope.updateChosenList();
          
    });
    $scope.BindDeleteFunction = function () {
       
        $('.ParentControls.Delete').click(function () {
            var MyId = $(this).attr('ref');
            $scope.DeleteItem(MyId);
        });

        $('.ParentControls.Edit').click(function () {
            var MyId = $(this).attr('ref');
            $scope.PrepareEdit(MyId);
        });
        $('.edit-wrapper').unbind('click');
        $('.edit-wrapper').click(function () {
            var MyId = $(this).attr('ref');
            $scope.PrepareEdit(MyId);
        });

    }
    $scope.EditItem = {};
    $scope.PrepareEdit = function (ref) {
        $('#MainView').slideUp();
        $scope.EditItem = $.grep($scope.allitems, function (e) { return e.Id == ref; })[0];
        $('#SelEditCategory').val($scope.EditItem.ItemCategoryId);
        $scope.updateChosenList();
        $('#EditView').css('display', 'block');
        $scope.ScrollPageUp();
    }

    $scope.ExitEdit = function () {
        $scope.EditItem = {};
        $('#MainView').slideDown();
        $('#EditView').css('display', 'none');
    }

    $scope.SubmitEditItem = function (confirmed) {
        if (!confirmed) {
            $scope.ConfirmBeforeAction('Confirm Edit!', 'Are you sure you want to update this Item record?<br>',
                function () { $scope.SubmitEditItem(true); });
            return;
        }
        $scope.HideModal();
        var ItemCategoryId = $('#SelEditCategory').val();
        if (ItemCategoryId == '-') {
            $scope.MessageAlert('Please select Item Category.', 'error'); return;
        }
        $scope.EditItem.ItemCategoryId = ItemCategoryId;
        $scope.EditItem.DateCreated = new Date("October 13, 2014 11:13:00"); //arbitrary date, not to be used
        $scope.EditItem.CreatedBy = $scope.user.Id;
        delete $scope.EditItem.__type;
        AjaxOptions.data = JSON.stringify({ tInfo: $scope.EditItem });
        AjaxOptions.url = $scope.serviceURL + "/ItemsUpdate";
        $.ajax(AjaxOptions).done(function (results) {
            console.log(results);
            $scope.getallitems();
            if (results.d > 0) {
                $scope.MessageAlert('Item update was successful', 'success');
                console.log(results);
                ApplyViewChanges($scope);
                $scope.getallitems();
                $scope.ExitEdit();
                $scope.EditItem = {};
            }
            else {
                $scope.MessageAlert('An error occurred. Please try again later.', 'error');
                console.log(results);
            }
        }
        ).fail(AjaxFail);


        
    }

    
    ///------------------------------------
    var Itemtable;
    var ItemtableFormatted = true; //false = enable custom drop down
    $scope.FixItemData = function () {
        Itemtable = $scope.DoDataTable(true, 'tblItems', $scope.allitems, $scope.BindDeleteFunction, //
      ["ItemCode", "ItemName", "CategoryName", "ItemDescription", "ItemsInStore", "ItemsIssued"], false, true, //
      "ItemName");

    }

    $scope.DeleteItem = function (ItemId, confirmed) {
        if (!confirmed) {
            $scope.ConfirmBeforeAction('Confirm Delete!', 'Are you sure you want to Remove this Item?<br>' + //
                'If an Item is removed, all associated information including existing stock may be lost.<br><br>' +//
                '<b>Do you want to continue?</b>',
                function () { $scope.DeleteItem(ItemId, true) });
            return;
        }
        $scope.HideModal();
        var ItemToDelete = $.grep($scope.allitems, function (e) { return e.Id == ItemId; })[0];
        if ((ItemToDelete.ItemsIssued + ItemToDelete.ItemsInStore) > 0) {
            //prevent deletion of items classes with physical items in the system
            $scope.MessageAlert('Sorry, you cannot remove an Item having units in the Store or Issued.', 'warning');
            return;
        }
        $.support.cors = true;
        AjaxOptions.data = JSON.stringify({ Id: ItemId });
        AjaxOptions.url = $scope.serviceURL + "/ItemsByIdDelete";
        $.ajax(AjaxOptions).done(function (results) {
            console.log(results);
            if (results.d > 0) {
                $scope.getallitems();
                $scope.MessageAlert('Item record deleted.', 'success');
            }
            else {
                $scope.MessageAlert('Request did not complete successfully. Please try again later.', 'error');
            }
        }
        ).fail(AjaxFail);
    }



    $scope.getallitems();
    $scope.getcategories();
}