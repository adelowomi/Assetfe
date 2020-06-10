function categoriesCtrl($scope, $http) {

    TweakSkin();
    $scope.newcategory = {PortalId: $scope.user.PortalId, CategoryName: null, CategoryDescription: null,
        CategoryType: null, CatCode: null, CreatedBy: $scope.user.Id};
 

    $scope.addCategory = function () {
        var CategoryType = $('#selType').val();
        if (CategoryType == '-') {
            $scope.MessageAlert('Select category type.', 'error'); return;
        }
        $scope.newcategory.CategoryType = CategoryType;
        AjaxOptions.data = JSON.stringify($scope.newcategory);
        AjaxOptions.url = $scope.serviceURL + "/ItemsCategoryAdd";
        $.ajax(AjaxOptions).done(function (results) {
            console.log(results);
            $scope.getcategories();
            $scope.newcategory = {
                PortalId: $scope.user.PortalId, CategoryName: null, CategoryDescription: null,
                CategoryType: null, CatCode: null, CreatedBy: $scope.user.Id
            };
            $scope.MessageAlert('Item added successfully.', 'success');
            ApplyViewChanges($scope);
        }
        ).fail(AjaxFail);

    }
    $scope.AddItem = function (CategoryId) {
        localStorage.setItem('AddCategory', CategoryId);
        window.location.href = "#/items";
    }

    $('#EditView').slideUp();
    $scope.$on('CategoriesListed', function (event) {
        $scope.FixCategoryData();
    });
    $scope.BindDeleteFunction = function () {
        $('.ParentControls.Delete').click(function () {
            var MyId = $(this).attr('ref');
            $scope.DeleteCategory(MyId);
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
    $scope.EditCategory = {};
    $scope.PrepareEdit = function (ref) {
        $('#MainView').slideUp();
        $scope.EditCategory = $.grep($scope.categories, function (e) { return e.Id == ref; })[0];
        $('#SelEditCategoryType').val($scope.EditCategory.CategoryType);
        $scope.updateChosenList();
        $('#EditView').css('display', 'block');
        $scope.ScrollPageUp();
    }

    $scope.ExitEdit = function () {
        $scope.EditCategory = {};
        $('#MainView').slideDown();
        $('#EditView').css('display', 'none');
    }

    $scope.SubmitEditCategory = function (confirmed) {
        if (!confirmed) {
            $scope.ConfirmBeforeAction('Confirm Edit!', 'Are you sure you want to update this Category record?<br>',
                function () { $scope.SubmitEditCategory(true); });
            return;
        }
        $scope.HideModal();
        var CategoryType = $('#SelEditCategoryType').val();
        if (CategoryType == '-') {
            $scope.MessageAlert('Select category type.', 'error'); return;
        }
        $scope.EditCategory.CategoryType = CategoryType;
        $scope.EditCategory.DateCreated = new Date("October 13, 2014 11:13:00"); //arbitrary date, not to be used
        $scope.EditCategory.CreatedBy = $scope.user.Id;
        AjaxOptions.data = JSON.stringify({ tInfo: $scope.EditCategory });
        AjaxOptions.url = $scope.serviceURL + "/ItemsCategoryUpdate";
        $.ajax(AjaxOptions).done(function (results) {
            if (results.d > 0) {
                $scope.MessageAlert('Category update was successful', 'success');
                console.log(results);
                ApplyViewChanges($scope);
                $scope.getcategories();
                $scope.ExitEdit();
                $scope.EditCategory = {};
            }
            else {
                $scope.MessageAlert('An error occurred. Please try again later.', 'error');
                console.log(results);
            }
        }
        ).fail(AjaxFail);
    }

    
    ///------------------------------------
    var Categorytable;
    var CategorytableFormatted = true; //false = enable custom drop down
    $scope.FixCategoryData = function () {
        Categorytable = $scope.DoDataTable(true, 'tblCategories', $scope.categories, $scope.BindDeleteFunction, //
      ["CatCode", "CategoryName", "CategoryDescription", "TypeMeaning" ], false, true, //
      "CategoryName");

    }

    $scope.DeleteCategory = function (CategoryId, confirmed) {
        if (!confirmed) {
            $scope.ConfirmBeforeAction('Confirm Delete!', 'Are you sure you want to Remove this Category?<br>'+ //
                'If a Category is removed, Items that belong to this category and all associated information may be lost.<br><br>'+//
                '<b>Do you want to continue?</b>',
                function () { $scope.DeleteCategory(CategoryId, true) });
            return;
        }
        $scope.HideModal();
        $.support.cors = true;
        AjaxOptions.data = JSON.stringify({ Id: CategoryId });
        AjaxOptions.url = $scope.serviceURL + "/ItemsCategoryDelete";
        $.ajax(AjaxOptions).done(function (results) {
            console.log(results);
            if (results.d > 0) {
                $scope.getcategories();
                $scope.MessageAlert('Category record deleted.', 'success');
                $scope.ExitEdit();
            }
            else {
                $scope.MessageAlert('Request did not complete successfully. Please try again later.', 'error');
            }
        }
        ).fail(AjaxFail);
    }



    $scope.getcategories();
}