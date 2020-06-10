function issueCtrl($scope, $http) {
    TweakSkin();

    $scope.WorkflowItem = {
        PortalId: $scope.user.PortalId, StaffRequisitionsId: null, Comment: "", feedback: null,
        CreatedBy: $scope.user.Id
    }

    $scope.$on('ItemsToIssueListed', function (event) {
        $scope.FixItemsToIssueData();
    });

    $scope.AvailableItems = {};
    $scope.$on('UnassignedItemTagsListed', function (event) {
        $scope.AvailableItems = $scope.UnassignedItemTags;  //$.grep($scope.UnassignedItemTags, function (e) { return e.IsAssigned == false; });
        for (var i = 0; i < $scope.AvailableItems.length; i++) {
            $scope.AvailableItems[i].Selector = '<input name="availableitems" class="AvailableItems" type="radio" value="' + $scope.AvailableItems[i].Id + '" />';
        }
        $scope.FixItemTagsData();
    });

    $scope.NewRequisition = {
        PortalId: $scope.user.PortalId, RequisitionId: null, RFIDTagId: null, IsReturnable: false,
        IsCurrentUser: false, DateIssued: new Date("October 13, 2014 11:13:00"), ApprovedStaffId: null,
        CreatedBy: $scope.user.Id
    };

    $scope.AttemptIdPrinting = function (item) {
        $scope.ConfirmBeforeAction("Print ID?", "Seems you just issued an Identification Material. <br> Would you like to generate a printable copy, or you prefer to do that later?",
            function () {
                localStorage.setItem('id_CategoryId', item.CategoryId);
                localStorage.setItem('id_TagId', item.Id);
                window.location.href = "#/idcards";
            },
        "No, Thanks", "Yes, let me generate now")
    }

    $scope.IssueItem = function () {
        $scope.NewRequisition.RequisitionId = $scope.EditItemsToIssue.Id;
        $scope.NewRequisition.RFIDTagId = $('input[name=availableitems]:checked').val();
        if (!$scope.NewRequisition.RFIDTagId) {
            $scope.MessageAlert('Please select an item first', 'error');
            return;
        }
        var ItemToIssue = $.grep($scope.AvailableItems, function (e) { return e.Id == $scope.NewRequisition.RFIDTagId; })[0];

        $scope.NewRequisition.IsReturnable = $('#ChkReturnable').prop('checked');
        $scope.NewRequisition.IsCurrentUser = $('#ChkPreissue').prop('checked');
        $scope.NewRequisition.ApprovedStaffId = $scope.EditItemsToIssue.ApprovedBy;


        $.support.cors = true;
        $scope.NewRequisition.hostname = Hostname
        AjaxOptions.data = JSON.stringify($scope.NewRequisition);
        AjaxOptions.url = $scope.serviceURL + "/StaffRequisitesAdd";
        $.ajax(AjaxOptions).done(function (results) {
            if (results.d > 0) {
                $scope.MessageAlert('Item was issued successfully. Ensure that recepient acknowledges receipt', 'success');
                console.log(results);
                $scope.EditItemsToIssue = {};
                ApplyViewChanges($scope);
                $scope.ListItemsToIssue();
                $scope.ExitEdit();
                $scope.NewRequisition = {
                    PortalId: $scope.user.PortalId, RequisitionId: null, RFIDTagId: null, IsReturnable: false,
                    IsCurrentUser: false, DateIssued: new Date("October 13, 2014 11:13:00"), ApprovedStaffId: null,
                    CreatedBy: $scope.user.Id
                };

                //do idcard things
                if (ItemToIssue.CategoryType == 0) //identificatio material
                {
                    $scope.AttemptIdPrinting(ItemToIssue);
                }
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
        $('.ParentControls.Notes').click(function () {
            var MyId = $(this).attr('ref');
            $scope.PrepareEdit(MyId);
        });
    }

    $scope.EditItemsToIssue = {};
    $scope.PrepareEdit = function (ref) {
        $('#MainView').slideUp();
        $scope.EditItemsToIssue = $.grep($scope.ItemsToIssue, function (e) { return e.Id == ref; })[0];
        $scope.ListUnassignedItemTags($scope.EditItemsToIssue.ItemId);
        ApplyViewChanges($scope);
        $('#EditView').css('display', 'block');
        $scope.ListWorkflowHistory(ref, true, $scope.ItemsToIssue);
        $scope.ScrollPageUp();
    }

    $scope.ExitEdit = function () {
        $scope.EditItemsToIssue = {};
        $('#MainView').slideDown();
        $('#EditView').css('display', 'none');
        ItemsToIssuetable.columns.adjust().draw();
    }

    $scope.SubmitEditItemsToIssue = function () {
        //
        var branchid = $("#SelEditBranch").val();
        if (branchid == "-") {
            $scope.MessageAlert('Form not properly filled. Ensure you specified a valid Branch.');
            return;
        }
        $scope.EditItemsToIssue.TagLocationBranchId = branchid;
        $scope.EditItemsToIssue.PurchasedByUserId = $('#SelEditPurchaser').val();
        if ($scope.EditItemsToIssue.PurchasedByUserId == "-") {
            $scope.MessageAlert('Please specify the employee / personnel who purchased item(s).');
            return;
        }
        try {
            $scope.EditItemsToIssue.ItemPurchaseDate = $scope.computedate($scope.EditItemsToIssue.ItemPurchaseDateReadable, "10:00 AM");
        }
        catch (e) {
            $scope.MessageAlert('Please specify valid purchase date.', 'error');
            return;
        }

        if ($scope.UploadedItemImage.done) {
            $scope.EditItemsToIssue.PhotoUrl = $scope.PictureRoot + '/AssetImages/Items/' + $scope.ItemFile.filename;
        }
        $scope.EditItemsToIssue.DateCreated = new Date("October 13, 2014 11:13:00"); //arbitrary date, not to be used
        $scope.EditItemsToIssue.CreatedBy = $scope.user.Id;
        $scope.EditItemsToIssue.SendSMS = $scope.Booleanfy($('#SelSMS').val());

        //bad date issues and nulls -- TOO BAD I HAVE TO DO THIS
        $scope.EditItemsToIssue.ServiceValidTillDate = $scope.RegularizeDate($scope.EditItemsToIssue.ServiceValidTillDate);
        $scope.EditItemsToIssue.CardValidTillDate = $scope.RegularizeDate($scope.EditItemsToIssue.CardValidTillDate);
        $scope.StripObjectOfNulls($scope.EditItemsToIssue);
        //
        $scope.EditItemsToIssue.__type = "UnifiedSchoolPortalService.RFIDTagsInfo"; //this is funny and its a new discovery
        $.support.cors = true;
        AjaxOptions.data = JSON.stringify({ tInfo: $scope.EditItemsToIssue });
        AjaxOptions.url = $scope.serviceURL + "/RFIDTagsUpdate";
        $.ajax(AjaxOptions).done(function (results) {
            if (results.d > 0) {
                $scope.MessageAlert('Item update was successful', 'success');
                console.log(results);
                ApplyViewChanges($scope);
                $scope.ListItemsToIssue();
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
    var ItemsToIssuetable;
    var ItemsToIssuetableFormatted = true; //false = enable custom drop down
    $scope.FixItemsToIssueData = function () {
        ItemsToIssuetable = $scope.DoDataTable(ItemsToIssuetableFormatted, 'tblItemsToIssue', $scope.ItemsToIssue, $scope.BindDeleteFunction, //
              ["ItemCode", "ItemName", "Quantity", "RequestMadeByStaffName", "RequestMadeForStaffName",//
                  "DepartmentName", "DateCreatedReadable", "DeliveryDateReadable"],//
              false, true, "ItemName", $scope.PrepareEdit);
    }

    $scope.DeleteItemsToIssue = function (ItemsToIssueId) {
        $scope.MessageAlert('Sorry, item deletion is not enabled on your portal.', 'error');
        return;


        var RFId = $.grep($scope.ItemsToIssue, function (e) { return e.Id == ItemsToIssueId })[0].RFID;
        $.support.cors = true;
        AjaxOptions.data = JSON.stringify({ PortalId: $scope.user.PortalId, RFID: RFId });
        AjaxOptions.url = $scope.serviceURL + "/RFIDTagsByRFIDDelete";
        $.ajax(AjaxOptions).done(function (results) {
            console.log(results);
            if (results.d > 0) {
                $scope.ListItemsToIssue();
                $scope.MessageAlert('ItemsToIssue record deleted.', 'warning');
            }
            else {
                $scope.MessageAlert('Request did not complete successfully. Please try again later.', 'error');
            }
        }
        ).fail(AjaxFail);
    }

    $('#RadIssued, #RadStore').on('ifChecked', function () {
        $scope.ListItemsToIssue();
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

    $scope.MyWH = {};
    $scope.$on('WorkflowHistoryListed', function (event) {
        $scope.MyWH = $scope.WorkflowHistory;
        //for (var i = 0; i < $scope.MyWH.length; i++) {
        //    $scope.MyWH[i].CreatedByName = $.grep($scope.allusers, function (e) { return e.Id == $scope.MyWH[i].CreatedBy; })[0].SurName;
        //}
        $scope.WorkflowActivated = false;
        if ($scope.MyWH.length > 0) {
            if ($scope.MyWH[$scope.MyWH.length - 1].ToRoleName == 'STAFF') {
                $scope.WorkflowActivated = true;
            }
        }
        ApplyViewChanges($scope);
        $scope.FixHistoryData();
    });

    var HistoryTable;
    var HistoryTableFormatted = true; //false = enable custom drop down
    $scope.FixHistoryData = function () {
        try {
            HistoryTable.destroy();
        } catch (e) {

        }

        HistoryTable = $('#tblWorkflowHistory').DataTable({
            responsive: true,
            "ordering": false,
            dom: 'T<"clear">lfrtip',
            tableTools: {
                "sSwfPath": "resources/copy_csv_xls_pdf.swf"
            },
            data: $scope.MyWH,
            columns: [ { "data": "CreatedByName" }, { "data": "Comment" }, { "data": "FeedBackLabel" }, { "data": "DateCreatedReadable" },
                    { "data": "ToRoleNameLabel" }

            ]
        });
        HistoryTable.columns.adjust().draw();

        if (!HistoryTableFormatted) {

            // Add event listener for opening and closing details
            $('#tblWorkflowHistory tbody').on('click', 'td.details-control', function () {
                var tr = $(this).parents('tr');
                var row = HistoryTable.row(tr);

                if (row.child.isShown()) {
                    // This row is already open - close it
                    row.child.hide();
                    tr.removeClass('shown');
                }
                else {
                    // Open this row
                    row.child($scope.formatRequisition(row.data())).show();
                    tr.addClass('shown');
                }
                //$scope.BindRoomTypeDelete();
            });
            HistoryTableFormatted = true;
        }
        //ensure that the reorder buttons can work

    }

    var ItemTagsTable;
    var ItemTagsTableFormatted = true; //false = enable custom drop down
    $scope.FixItemTagsData = function () {
        try {
            ItemTagsTable.destroy();
        } catch (e) {

        }

        ItemTagsTable = $('#tblItemsAvailable').DataTable({
            responsive: true,
            "ordering": true,
            dom: 'T<"clear">lfrtip',
            tableTools: {
                "sSwfPath": "resources/copy_csv_xls_pdf.swf"
            },
            data: $scope.AvailableItems,
            columns: [{ "data": "Selector" },
                    { "data": "Barcode" }, { "data": "ItemPurchaseDateReadable" }, { "data": "PurchasedByStaffName" },
                    {"data": "BranchName"}

            ]
        });
        ItemTagsTable.columns.adjust().draw();

        if (!ItemTagsTableFormatted) {

            // Add event listener for opening and closing details
            $('#tblWorkflowItemTags tbody').on('click', 'td.details-control', function () {
                var tr = $(this).parents('tr');
                var row = ItemTagsTable.row(tr);

                if (row.child.isShown()) {
                    // This row is already open - close it
                    row.child.hide();
                    tr.removeClass('shown');
                }
                else {
                    // Open this row
                    row.child($scope.formatRequisition(row.data())).show();
                    tr.addClass('shown');
                }
                //$scope.BindRoomTypeDelete();
            });
            ItemTagsTableFormatted = true;
        }
        //ensure that the reorder buttons can work
        $scope.StyleItemRadios();
    }
    
    $scope.StyleItemRadios = function () {
        $('input.AvailableItems').iCheck({
            checkboxClass: 'icheckbox_square-blue',
            radioClass: 'iradio_square-blue',
            increaseArea: '20%'
        });
    }

    $scope.ListItemsToIssue();
    

}