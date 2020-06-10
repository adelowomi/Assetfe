function idcardsCtrl($scope, $http) {

    TweakSkin();
    $scope.ShowReprints = false;
    /// ---------------------------------------------------
    $scope.IDCategories = {};
    $scope.$on('CategoriesListed', function (event) {
        $scope.IDCategories = $.grep($scope.categories, function (e) { return e.CategoryType == 0; });
        ApplyViewChanges($scope);

        //these next lines affect direct entry for immediate printing from fulfilment module
        //there is another line too -- scroll down
        var linkCategoryId = localStorage.getItem('id_CategoryId');
        localStorage.removeItem('id_CategoryId');
        if (linkCategoryId) {
            $('#selItem').val(linkCategoryId);
            $scope.ListAssignedIDs(linkCategoryId);
        }

        $scope.updateChosenList();
    });
    $scope.$on('BranchesListed', function (event) {
        ApplyViewChanges($scope);
        $scope.updateChosenList();
        $scope.ListDepartmentNamesList();
    });
    $scope.$on('UsersListed', function (event) {
        ApplyViewChanges($scope);
        $scope.updateChosenList();
    });

    $scope.$on('AssignedIDsCountListed', function (event) {

        //$scope.updateChosenList();
        $scope.CategoryChanged = true;
        ApplyViewChanges($scope);
    });

    $scope.$on('DepartmentNamesListed', function (event) {
        ApplyViewChanges($scope);
        $scope.updateChosenList();
    });


    $('#ToggleAllSelectors').on('ifToggled', function (event) {
        if ($(this).prop('checked')) {
            $('input[type=checkbox].selector').iCheck('check');
        }
        else {
            $('input[type=checkbox].selector').iCheck('uncheck');
        }
    });

    $scope.UnPrintedItems = {};
    $scope.$on('AssignedIDsListed', function (event) {
        $scope.UnPrintedItems = $.grep($scope.AssignedIDs, function (e) { return e.IsPrinted == false; });
        $scope.FixStockData($scope.UnPrintedItems);
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

    $scope.CategoryChanged = false;
    $('#selItem').change(function () {
        $scope.CountAssignedIDs($(this).val());
        $scope.FixStockData({});
    });

    $scope.TrimmedFaculties = {};
    $('#selBranch').change(function () {
        var BranchId = $('#selBranch').val();
        $scope.GetDepartmentsWithItems(BranchId);

        //var branchname = $('#selBranch option:selected').text();
        //if (branchname) branchname = branchname.toLowerCase();
        //$scope.FixStockData({});
        ////the lines below enable the departments for a particular branch to get listed after its selected
        //$scope.TrimmedFaculties = $.grep($scope.DepartmentNamesList, function (e) { return e.BranchName.toLowerCase() == branchname; });
        //ApplyViewChanges($scope);
        //$scope.updateChosenList();
    });

    $scope.DeptTrim = ""; $scope.LevelTrim = "";
    $scope.FetchTrimmedData = function () {
        var BranchId = $('#selBranch').val();
        var CategoryId = $('#selItem').val();
        $scope.DeptTrim = $('#SelFaculty option:selected').text();
        if (CategoryId == '-' || BranchId == '-') {
            $scope.FixStockData({});
            $scope.MessageAlert('At least <b>Branch</b> and <b>Category</b> must be specified.', 'warning');
        } else {
            if ($scope.ShowReprints) {
                $scope.ListAssignedIDsTrimDept(CategoryId, BranchId, $scope.DeptTrim, true);
            } else {
                if ($scope.DeptTrim.trim() == "" && $scope.LevelTrim.trim() == "") {
                    //use branch alone to fetch data
                    $scope.ListAssignedIDsByBranch(CategoryId, BranchId);
                }
                else if ($scope.DeptTrim.trim() != "" && $scope.LevelTrim.trim() == "") {
                    //use branch and department
                    $scope.ListAssignedIDsTrimDept(CategoryId, BranchId, $scope.DeptTrim);
                }
                else if ($scope.DeptTrim.trim() != "" && $scope.LevelTrim.trim() != "") {
                    //use branch and department
                    $scope.ListAssignedIDsTrimDeptLevel(CategoryId, BranchId, $scope.DeptTrim, $scope.LevelTrim);
                }
                else {
                    $scope.FixStockData({});
                    $scope.MessageAlert('No item matches selected criteria.', 'warning'); //false means dont autoclose
                }
            }
        }
    }

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
        $scope.DoDataTable(StocktableFormatted, 'tblStock', TableData, $scope.BindDeleteFunction, //
            ["Selector", "ItemName", "ItemDescription", "Barcode", "SurName", "OtherNames", "BranchName"], true);

        //these next lines affect direct entry for immediate printing from fulfilment module
        //there is another line too -- scroll up
        var link_Tag = localStorage.getItem('id_TagId');
        localStorage.removeItem('id_TagId');
        if (link_Tag) {
            $('input[ref=' + link_Tag + ']').prop('checked', true);
            $('input[type=checkbox].selector').iCheck('update');
        }
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
        var SelectedIds = [];
        try {

            $('input[type=checkbox].selector').each(function () {
                if ($(this).prop('checked') == true) {

                    var ItemId = $(this).attr('ref');
                    var Item = $.grep($scope.AssignedIDs, function (e) { return e.Id == ItemId })[0];
                    SelectedIds.push({ Id: Item.Id, BranchId: Item.BranchId });
                    ds.push({
                        PortalName: $scope.CurrentCompany.CompanyName,
                        LogoURL: $scope.PictureRoot + $scope.CurrentCompany.CompanyLogoUrl,
                        Barcode: PictureHostRoot + Item.BarcodeUrl,
                        Firstname: Item.OtherNames, Lastname: Item.SurName.toUpperCase(), CodeValue: Item.StaffCode, Type: TagType,
                        HolderSignature: $scope.PictureRoot + Item.SignatureURL,
                        AuthorizedSignature: $scope.PictureRoot + $scope.CurrentCompany.AuthorizedSignUrl,
                        Address: $scope.CurrentCompany.CompanyAddress, Phone: $scope.CurrentCompany.MobileNo,
                        Passport: $scope.PictureRoot + Item.PhotoUrl, Department: Item.DepartmentName, Hostname: ReportHostname, Branch: Item.BranchName,
                        PortalId: $scope.CurrentCompany.Id
                    });
                }
            });

        } catch (e) {
            $scope.MessageAlert('An error was encountered while sending items for printing. Some selected items may have incomplete data', 'error');
            return;
        }

        if (ds.length == 0) {
            $scope.MessageAlert('Select an Item first', 'error');
            return;
        }
        ShowBusyMode();
        console.log({ "TagJSON": JSON.stringify({ hasdata: true }) })
        // fetch(url, {
        //     method: 'POST',
        //     headers: { "TagJSON": JSON.stringify({ hasdata: true }) },
        //     body: JSON.stringify({ "TagJSON": ds })
        // })
        //     .then(response => response.json())
        //     .then(response => {
        //         if (response == 0) {
        //             $scope.MessageAlert('Sorry, an error occurred while generating IDs. You may retry after sometime.', 'error');
        //             HideBusyMode();
        //         }
        //         else {
        //             var filename = request.getResponseHeader('filename');

        //             //former method to get downloaded pdf from server
        //             var form = $('<form method="POST" action="' + url + '">');
        //             /* $.each(params, function (k, v) {
        //                  form.append($('<input type="hidden" name="' + k +
        //                          '" value="' + v + '">'));
        //              });*/
        //             form.append($('<input type="hidden" name="filename" value="' + filename + '">'));
        //             $('body').append(form);
        //             form.submit();
        //             //$("#myDownloaderFrame").attr("src", url+"?filename="+filename);
        //             HideBusyMode();

        //             $scope.ConfirmBeforeAction('Confirm Print!', 'Were the IDs for print generated correctly?<br>' + //
        //                 'If you answer Yes, it means the IDs were generated correctly and <b>you will not be able to print this ID again.</b><br><br>' +//
        //                 '<a href="' + url + "?filename=" + filename + '" target="_blank">Download File Again</a>',
        //                 function () { $scope.UpdatePrint(SelectedIds); }, 'No', 'Yes');
        //         }
        //     }).catch(function () {
        //         $scope.MessageAlert('An error occurred. Please check your network connection.', 'error');
        //         HideBusyMode();
        //     })
        const header = {
            "TagJSON": JSON.stringify({ hasdata: true }),

        };
        $.ajax({
            type: "POST",
            url: url,
            data: JSON.stringify({ "TagJSON": ds }),
            headers: header,
            success: function (response, status, request) {
                if (response == 0) {
                    $scope.MessageAlert('Sorry, an error occurred while generating IDs. You may retry after sometime.', 'error');
                    HideBusyMode();
                }
                else {
                    var filename = request.getResponseHeader('filename');

                    //former method to get downloaded pdf from server
                    var form = $('<form method="POST" action="' + url + '">');
                    /* $.each(params, function (k, v) {
                         form.append($('<input type="hidden" name="' + k +
                                 '" value="' + v + '">'));
                     });*/
                    form.append($('<input type="hidden" name="filename" value="' + filename + '">'));
                    $('body').append(form);
                    form.submit();
                    //$("#myDownloaderFrame").attr("src", url+"?filename="+filename);
                    HideBusyMode();

                    $scope.ConfirmBeforeAction('Confirm Print!', 'Were the IDs for print generated correctly?<br>' + //
                        'If you answer Yes, it means the IDs were generated correctly and <b>you will not be able to print this ID again.</b><br><br>' +//
                        '<a href="' + url + "?filename=" + filename + '" target="_blank">Download File Again</a>',
                        function () { $scope.UpdatePrint(SelectedIds); }, 'No', 'Yes');
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
            content: '<img src="images/tagsamples/' + size + '.jpg"  />',
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

    $scope.UpdatePrint = function (TagIds) {
        $.support.cors = true;
        var ds = [];

        for (var i = 0; i < TagIds.length; i++) {
            ds.push({ Id: TagIds[i].Id, IsPrinted: true, PortalId: $scope.user.PortalId, BranchId: TagIds[i].BranchId, CreatedBy: $scope.user.Id });
        }
        AjaxOptions.data = JSON.stringify({ iListrfidInfo: ds });
        AjaxOptions.url = $scope.serviceURL + "/RFIDTagsByRFIDTagIdPrintedUpdate";
        $.ajax(AjaxOptions).done(function (results) {
            if (results.d > 0) {
                $scope.MessageAlert('ID successfully printed. <br/>Batch no is <b>' + results.d + '</b>', 'success', false); //false means dont autoclose
                $("#myDownloaderFrame").attr("src", "");
                console.log(results);
                ApplyViewChanges($scope);
                //$scope.ListAssignedIDs($('#selItem').val());
                $scope.FetchTrimmedData();
            }
            else {
                $scope.MessageAlert('An error occurred, you will have to download again to log the success of your printing.', 'error');
                console.log(results);
            }
        }
        ).fail(AjaxFail);



    }

    //   $scope.DepartmentsWithItems = {};
    $scope.GetDepartmentsWithItems = function (BranchId) {
        var ds = { PortalId: $scope.user.PortalId, CompanyBranchId: BranchId };
        $.support.cors = true;
        AjaxOptions.data = JSON.stringify(ds);
        AjaxOptions.url = $scope.serviceURL + "/DepartmentByCompanyBranchIdList";
        $.ajax(AjaxOptions).done(function (results) {
            console.log(results);
            $scope.TrimmedFaculties = results.d;
            SanitizeAll($scope.TrimmedFaculties);
            ApplyViewChanges($scope);
            setTimeout(function () {
                $scope.updateChosenList();
            }, 500);
        }
        ).fail(AjaxFail);
    }

    $scope.getCompanyInfo($scope.user.PortalId);
    // $scope.getallitems();
    $scope.getcategories();
    $scope.getBranches();


    $('#SelRequestType').change(function () {
        var RequestType = $(this).val();
        if (RequestType == '2') {
            $scope.ShowReprints = true;
        } else {
            $scope.ShowReprints = false;
        }

    });
}