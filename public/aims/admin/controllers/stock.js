function stockCtrl($scope, $http) {
    TweakSkin();
    /// ---------------------------------------------------
    $scope.newstock = { PortalId: $scope.user.PortalId, ItemId: null, qty: 0, SerialNo: "",
      TagLocationBranchId: null, TagLocation: "", AlertTimeStart: "", AlertTimeStop: "", ServiceValidTillDate: "",
      SendSMS: false, ItemAmount: 0.0, PurchasedByUserId: null, ItemPurchaseDate: null, CreatedBy: $scope.user.Id};
    
    $scope.$on('ItemsListed', function (event) {
        if ($scope.FirstRun) $scope.getBranches();
        ApplyViewChanges($scope);

        var AutoItem = localStorage.getItem('AddItem');
        $.session.clear('AddItem');
        if (AutoItem) {
            $('#selItem').val(AutoItem);
            ExpandSection('.initial-collapse');
        }

        $scope.updateChosenList();
    });
    $scope.$on('BranchesListed', function (event) {
        if ($scope.FirstRun) $scope.getallusers();
        ApplyViewChanges($scope);
        $scope.updateChosenList();
    });
    $scope.$on('UsersListed', function (event) {
        if ($scope.FirstRun) $scope.ListStock();
        ApplyViewChanges($scope);
        $scope.updateChosenList();
    });

    $scope.$on('StockListed', function (event) {
        $scope.FirstRun = false;
        var IsStore = $('#RadStore').prop('checked');
        if (IsStore) {
            $scope.FixStockData($scope.StockInStore);
        }
        else {
            $scope.FixStockData($scope.StockIssued);
        }
    });

    $scope.gettime = function (raw)
    {
        var d1_hour = raw.toString().substring(0, 2);
        var d1_minute =raw.toString().substring(3, 5);
        var d1_meridian = raw.toString().substring(6, 8);
        if (d1_meridian.toLowerCase() == 'pm') {
            d1_hour = parseInt(d1_hour, 10) + 12;
        }
        return d1_hour.toString()+":"+ d1_minute;
    }

    
    $scope.proccessadd = function () {
        try {
            $scope.additems();
        }
        catch (exception) {
            $scope.MessageAlert('An error occurred. Ensure you have filled form properly and retry.', 'error');
        }
    }

    $scope.additems = function () {
        $scope.newstock.ItemId = $("#selItem").val();
        $scope.newstock.qty = $("#txtqty").val();
        var branchid = $("#selBranch").val();
        if (branchid == "-" || $scope.newstock.ItemId == "-") {
            $scope.MessageAlert('Form not properly filled. Ensure you specify a valid Item and Branch.', 'error');
            return;
        }
        $scope.newstock.TagLocationBranchId = branchid;
        $scope.newstock.PurchasedByUserId = $('#selbuyer').val();
        if ($scope.newstock.PurchasedByUserId == "-") {
            $scope.MessageAlert('Please specify the employee / personnel who purchased item(s).', 'error');
            return;
        }
        $scope.newstock.ItemPurchaseDate = $scope.computedate($scope.newstock.purchasedate, "10:00 AM");
        if ($scope.newstock.SerialNo) {
            var Serials = $scope.newstock.SerialNo.split(',');
            if (Serials.length != $scope.newstock.qty) {
                $scope.MessageAlert('Serial numbers specified must match quantity of items being added to stock. Use commas to separate multiple serial numbers.', 'error');
                return;
            }
        }

        $.support.cors = true;
        AjaxOptions.data = JSON.stringify($scope.newstock);
        AjaxOptions.url = $scope.serviceURL + "/RFIDTagsAdd";
        $.ajax(AjaxOptions).done(function (results) {
            if (results.d > 0) {
                $scope.MessageAlert('Item(s) added successfully', 'success');
                console.log(results);
                $scope.newstock = {
                    PortalId: $scope.user.PortalId, ItemId: null, qty: 0, SerialNo: "",
                    TagLocationBranchId: null, TagLocation: "", AlertTimeStart: "", AlertTimeStop: "", ServiceValidTillDate: "",
                    SendSMS: false, ItemAmount: 0.0, PurchasedByUserId: null, ItemPurchaseDate: null, CreatedBy: $scope.user.Id
                };

                ApplyViewChanges($scope);
                $scope.ListStock();
            }
            else {
                $scope.MessageAlert('An error occurred. Please try again later.', 'error');
                console.log(results);
            }
        }
        ).fail(AjaxFail);
    }
   

    $('#EditView').slideUp();
    $scope.BindDeleteFunction = function () {
        $('.ParentControls.Delete').click(function () {
            var MyId = $(this).attr('ref');
            $scope.DeleteStock(MyId);
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
    $scope.EditStock = {};
    $scope.PrepareEdit = function (ref) {
        $('#MainView').slideUp();

        $scope.EditStock = $.grep($scope.Stock, function (e) { return e.Id == ref; })[0];
        if ($scope.EditStock.PhotoUrl.trim() == '') {
            $('#EditImage').attr('src', 'images/na.jpg');
        }
        else {
            $('#EditImage').attr('src', PictureHostRoot +$scope.EditStock.PhotoUrl.trim());
        }
        $('#Barcode').attr('src', PictureHostRoot + $scope.EditStock.BarcodeUrl.trim());
        $('#QRCode').attr('src', PictureHostRoot + $scope.EditStock.QRCodeUrl.trim());
        $('#SelEditBranch').val($scope.EditStock.TagLocationBranchId);
        $('#SelEditPurchaser').val($scope.EditStock.PurchasedBy);
        $('#SelSMS').val($scope.Bitfy($scope.EditStock.SendSMS));
        ApplyViewChanges($scope);
        $scope.updateChosenList();
        $('#EditView').css('display', 'block');
        $scope.ScrollPageUp();
    }

    $scope.ExitEdit = function () {
        $scope.EditStock = {};
        $('#MainView').slideDown();
        $('#EditView').css('display', 'none');
        Stocktable.columns.adjust().draw();
    }

    $scope.SubmitEditStock = function (confirmed) {
        if (!confirmed) {
            $scope.ConfirmBeforeAction('Confirm Update!', 'Are you sure you want to update this stock record?<br>' + //
                'Your action will have system wide implications.<br><br>' +//
                '<b>Do you want to continue?</b>',
                function () { $scope.SubmitEditStock(true) });
            return;
        }
        $scope.HideModal();
        var branchid = $("#SelEditBranch").val();
        if (branchid == "-" ) {
            $scope.MessageAlert('Form not properly filled. Ensure you specified a valid Branch.');
            return;
        }
        $scope.EditStock.TagLocationBranchId = branchid;
        $scope.EditStock.PurchasedByUserId = $('#SelEditPurchaser').val();
        if ($scope.EditStock.PurchasedByUserId == "-") {
            $scope.MessageAlert('Please specify the employee / personnel who purchased item(s).');
            return;
        }
        try{
            $scope.EditStock.ItemPurchaseDate = $scope.computedate($scope.EditStock.ItemPurchaseDateReadable, "10:00 AM");
        }
        catch(e){
            $scope.MessageAlert('Please specify valid purchase date.', 'error');
            return;
        }

        if ($scope.UploadedItemImage.done) {
            $scope.EditStock.PhotoUrl = '/AssetImages/'+ $scope.user.PortalId +'/AssetPhoto/' + $scope.ItemFile.filename;
        }
        $scope.EditStock.DateCreated = new Date("October 13, 2014 11:13:00"); //arbitrary date, not to be used
        $scope.EditStock.CreatedBy = $scope.user.Id;
        $scope.EditStock.SendSMS = $scope.Booleanfy($('#SelSMS').val());

        //bad date issues and nulls -- TOO BAD I HAVE TO DO THIS
        $scope.EditStock.ServiceValidTillDate = $scope.RegularizeDate($scope.EditStock.ServiceValidTillDate);
        $scope.EditStock.CardValidTillDate = $scope.RegularizeDate($scope.EditStock.CardValidTillDate);
        $scope.StripObjectOfNulls($scope.EditStock);
        //
        $scope.EditStock.__type = "UnifiedSchoolPortalService.RFIDTagsInfo"; //this is funny and its a new discovery
        $.support.cors = true;
        AjaxOptions.data = JSON.stringify({ tInfo: $scope.EditStock });
        AjaxOptions.url = $scope.serviceURL + "/RFIDTagsUpdate";
        $.ajax(AjaxOptions).done(function (results) {
            if (results.d > 0) {
                $scope.MessageAlert('Item update was successful', 'success');
                console.log(results);
                ApplyViewChanges($scope);
                $scope.ListStock();
                $scope.UploadedItemImage.done = false;
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
    var Stocktable;
    var StocktableFormatted = true; //false = enable custom drop down
    $scope.FixStockData = function (TableData) {
        Stocktable = $scope.DoDataTable(StocktableFormatted, 'tblStock', TableData, $scope.BindDeleteFunction, //
           [ "Barcode", "ItemName", "CategoryName", "ItemAmount", "PurchasedByStaffName", "ItemPurchaseDateReadable", //
               "BranchName"], false, true, "Barcode", $scope.PrepareEdit);
        $scope.StockFetched = true;
        ApplyViewChanges($scope);
    }

    $scope.DeleteStock = function (StockId, confirmed) {
        if (!confirmed) {
            $scope.ConfirmBeforeAction('Confirm Delete!', 'Are you sure you want to Remove this item from stock?<br>' + //
                'If a stock is removed, all associated information including assigned employees.<br><br>' +//
                '<b>Do you want to continue?</b>',
                function () { $scope.DeleteStock(StockId, true) });
            return;
        }
        $scope.HideModal();
        $scope.MessageAlert('Sorry, item deletion is not enabled on your portal.', 'error');
        return;


        var RFId = $.grep($scope.Stock, function (e) { return e.Id == StockId })[0].RFID;
        $.support.cors = true;
        AjaxOptions.data = JSON.stringify({PortalId: $scope.user.PortalId, RFID: RFId });
        AjaxOptions.url = $scope.serviceURL + "/RFIDTagsByRFIDDelete";
        $.ajax(AjaxOptions).done(function (results) {
            console.log(results);
            if (results.d > 0) {
                $scope.ListStock();
                $scope.MessageAlert('Stock record deleted.', 'warning');
            }
            else {
                $scope.MessageAlert('Request did not complete successfully. Please try again later.', 'error');
            }
        }
        ).fail(AjaxFail);
    }

    $('#RadIssued, #RadStore').on('ifChecked', function () {
        $scope.ListStock();
    });

    $scope.AdvancedOpen = false;
    $('#AdvancedSection').slideUp();
    $scope.ToggleAdvancedSection = function () {
        if ($scope.AdvancedOpen) {
            $('#AdvancedSection').slideUp();
            $scope.AdvancedOpen = false;
        }
        else {
            $('#AdvancedSection').slideDown();
            $scope.AdvancedOpen = true;
        }

    }

    $scope.StockFetched = false;
    $scope.FirstRun = true;
    $scope.getallitems();
    
    
    $scope.UploadedItemImage = { done: false };
    $scope.ItemFile = { filename: "" };// 
    $scope.MakeDropZone('#EditImage', $scope.ItemFile, RootFolder + '/AssetImages/' + $scope.user.PortalId + '/AssetPhoto',
        '/AssetImages/' + $scope.user.PortalId + '/AssetPhoto/', $scope.UploadedItemImage);


}