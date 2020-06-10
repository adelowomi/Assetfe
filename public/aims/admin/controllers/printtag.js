function printtagCtrl($scope, $http) {

    TweakSkin();
    /// ---------------------------------------------------
    $scope.NonIDItems = {};
    $scope.$on('ItemsListed', function (event) {
        $scope.NonIDItems = $.grep($scope.allitems, function (e) { return e.CategoryType != 0; });
        ApplyViewChanges($scope);
        $scope.updateChosenList();
    });
    $scope.$on('BranchesListed', function (event) {
        ApplyViewChanges($scope);
        $scope.updateChosenList();
    });
    $scope.$on('UsersListed', function (event) {
        ApplyViewChanges($scope);
        $scope.updateChosenList();
    });

    $scope.CancelAllSelection = function () {
        $('input[type=checkbox].selector').iCheck('uncheck');
    }

    $scope.$on('ItemTagsListed', function (event) {
        $scope.FixStockData($scope.ItemTags);
    });

    $scope.gettime = function (raw) {
        var d1_hour = raw.toString().substring(0, 2);
        var d1_minute = raw.toString().substring(3, 5);
        var d1_meridian = raw.toString().substring(6, 8);
        if (d1_meridian.toLowerCase() == 'pm') {
            d1_hour = parseInt(d1_hour, 10) + 12;
        }
        return d1_hour.toString() + ":" + d1_minute;
    }

    $('#selItem').change(function () {
        var ItemId = $(this).val();
        if (ItemId == '-') {
            $scope.FixStockData({});
        } else {
            $scope.ListItemTags(ItemId);
        }
    });

    $('#EditView').slideUp();
    $scope.BindDeleteFunction = function () {
        
        $('input[type=checkbox].selector').iCheck('destroy');
        $('input[type=checkbox].selector').iCheck({
            checkboxClass: 'icheckbox_square-blue',
            radioClass: 'iradio_square-blue',
            increaseArea: '20%'
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
            $('#EditImage').attr('src', $scope.EditStock.PhotoUrl.trim());
        }
        $('#Barcode').attr('src', $scope.pictureHostMain + $scope.EditStock.BarcodeUrl.trim());
        $('#QRCode').attr('src', $scope.pictureHostMain + $scope.EditStock.QRCodeUrl.trim());
        $('#SelEditBranch').val($scope.EditStock.TagLocationBranchId);
        $('#SelEditPurchaser').val($scope.EditStock.PurchasedBy);
        $('#SelSMS').val($scope.Bitfy($scope.EditStock.SendSMS));
        ApplyViewChanges($scope);
        $scope.updateChosenList();
        $('#EditView').css('display', 'block');
    }

    $scope.ExitEdit = function () {
        $scope.EditStock = {};
        $('#MainView').slideDown();
        $('#EditView').css('display', 'none');

    }

    $scope.SubmitEditStock = function () {
        //
        var branchid = $("#SelEditBranch").val();
        if (branchid == "-") {
            $scope.MessageAlert('Form not properly filled. Ensure you specified a valid Branch.');
            return;
        }
        $scope.EditStock.TagLocationBranchId = branchid;
        $scope.EditStock.PurchasedByUserId = $('#SelEditPurchaser').val();
        if ($scope.EditStock.PurchasedByUserId == "-") {
            $scope.MessageAlert('Please specify the employee / personnel who purchased item(s).');
            return;
        }
        try {
            $scope.EditStock.ItemPurchaseDate = $scope.computedate($scope.EditStock.ItemPurchaseDateReadable, "10:00 AM");
        }
        catch (e) {
            $scope.MessageAlert('Please specify valid purchase date.', 'error');
            return;
        }

        if ($scope.UploadedItemImage.done) {
            $scope.EditStock.PhotoUrl = $scope.PictureRoot + '/AssetImages/Items/' + $scope.ItemFile.filename;
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
        $scope.DoDataTable( StocktableFormatted, 'tblStock', TableData, $scope.BindDeleteFunction, //
           ["Selector", "Barcode", "SerialNo", "ItemName", "CategoryName", "ItemDescription", "ItemPurchaseDateReadable", //
               "BranchName"], true);
    }

   
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


    $scope.DownloadPDF = function (TagType) {
        
        var url = GlobalDownloader;
        var params = {};
        var ds = []
        $('input[type=checkbox].selector').each(function () {
            if ($(this).prop('checked') == true) {
                //alert('Nice');
                var ItemId = $(this).attr('ref');
                var Item = $.grep($scope.ItemTags, function (e) { return e.Id == ItemId })[0];
                
                ds.push({
                    PortalName: $scope.CurrentCompany.CompanyName,
                    LogoURL: PictureHostRoot +$scope.CurrentCompany.CompanyLogoUrl,
                    Barcode: PictureHostRoot + Item.BarcodeUrl,
                    QRCode: PictureHostRoot + Item.QRCodeUrl, CodeValue: Item.Barcode, Type: TagType
                });
            } else {
                //alert('Bad');
            }
        });
        if (ds.length == 0) {
            $scope.MessageAlert('Select an Item first', 'error');
            return;
        }
        ShowBusyMode();
        
        $.ajax({
            type: "POST",
            url: url, headers: { "TagJSON": JSON.stringify({ hasdata: true }) },
            data: JSON.stringify({ "TagJSON": ds }),
            success: function (response, status, request) {
                if (response == 0) {
                    $scope.MessageAlert('Sorry, an error occurred while generating Tags. You may retry after sometime.', 'error');
                    HideBusyMode();
                }
                else {
                    var filename = request.getResponseHeader('filename');
                    //if (disp && disp.search('attachment') != -1) {
                    var form = $('<form method="POST" action="' + url + '">');
                    $.each(params, function (k, v) {
                        form.append($('<input type="hidden" name="' + k +
                                '" value="' + v + '">'));
                    });
                    form.append($('<input type="hidden" name="filename" value="' + filename + '">'));
                    $('body').append(form);
                    form.submit();
                    HideBusyMode();
                    //}
                }
            }, error: function () {
                $scope.MessageAlert('An error occurred. Please check your network connection.', 'error');
                HideBusyMode();
            }
        });
    }
 
    $('.size-selector').each(function () {
        var size = $(this).attr('ref');
        $(this).jBox('Tooltip', {
            content: '<img src="images/tagsamples/'+ size +'.jpg"  />',
            closeOnMouseleave: true
        });
        

    });

    $scope.ShowPrint = false;
    $scope.CheckShowPrint = function () {
        var len = $('input[type=checkbox].selector:checked').length;
        if (len > 0) {
            $scope.ShowPrint = true;
        }
        else {
            $scope.ShowPrint = false;
        }
        ApplyViewChanges($scope);
    }

    setInterval(function () {
        $scope.CheckShowPrint();
    }, 1000);
    //$scope.ListStock();
    $scope.getCompanyInfo($scope.user.PortalId);
    $scope.getallitems();
    

    

}