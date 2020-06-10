function requisitionCtrl($scope, $http) {
    $scope.WorkflowActivated = false;
    TweakSkin();
    $scope.NewRequisition = {
        PortalId: $scope.user.PortalId, ItemId: null, Quantity: 1, Description: "",
        DepartmentId: 1, RequestMadeForStaffId: null, DeliveryDate: null, CreatedBy: $scope.user.Id
    };

    $scope.AddRequisition = function () {
        var ItemId = $('#SelItem').val();
        if (ItemId == '-') {
            $scope.MessageAlert('Select and Item first.', 'error');
            return;
        }
        $scope.NewRequisition.ItemId = ItemId;

        var RequestedFor = $('#SelRequestedFor').val();
        if (RequestedFor == '-') {
            RequestedFor = $scope.user.Id;
        }
        $scope.NewRequisition.RequestMadeForStaffId = RequestedFor;
        $scope.NewRequisition.DepartmentId = $.grep($scope.allusers, function (e) { return e.Id == RequestedFor})[0].DepartmentId;
        try {
            $scope.NewRequisition.DeliveryDate = Date.parseExact($('#DeliveryDate').val(), 'd/M/yyyy');
        } catch (e) {
            $scope.MessageAlert('Invalid delivery date selected. Review and retry.', 'error');
            return;
        }
        $scope.NewRequisition.hostname = Hostname;
        AjaxOptions.data = JSON.stringify($scope.NewRequisition);
        AjaxOptions.url = $scope.serviceURL + "/StaffRequisitionsAdd";
        $.ajax(AjaxOptions).done(function (results) {
            console.log(results);
            $scope.ListRequisition();
            $scope.NewRequisition = {
                PortalId: $scope.user.PortalId, ItemId: null, Quantity: 1, Description: "",
                DepartmentId: $scope.user.DepartmentId, RequestMadeForStaffId: null, DeliveryDate: null, CreatedBy: $scope.user.Id
            };
            $scope.MessageAlert('Item requisition was successful.', 'success');
            $('select').val('-');
            ApplyViewChanges($scope);
        }
        ).fail(AjaxFail);

    }


    $('#EditView').slideUp();
    $('#RadMe').on('ifChecked', function () {
        $scope.ListRequisition();
    });
    $('#RadAssisted').on('ifChecked', function () {
        $scope.ListAssistedRequisition();
    });

    $scope.ActiveRequisitionSet = {};
    $scope.RequisitionListed = false;
    $scope.$on('RequisitionListed', function (event) {
        $scope.ActiveRequisitionSet = $scope.Requisition;
        $scope.FixRequisitionData($scope.Requisition);
    });

    $scope.$on('AssistedRequisitionListed', function (event) {
        $scope.ActiveRequisitionSet = $scope.AssistedRequisition;
        $scope.FixRequisitionData($scope.AssistedRequisition);
    });

    $scope.MyWH = {};
    $scope.$on('WorkflowHistoryListed', function (event) {
        $scope.MyWH = $scope.WorkflowHistory;
        //for (var i = 0; i < $scope.MyWH.length; i++) {
        //    $scope.MyWH[i].CreatedByName = $.grep($scope.allusers, function (e) { return e.Id == $scope.MyWH[i].CreatedBy; })[0].SurName;
        //}
        $scope.WorkflowActivated = false;
        if ($scope.MyWH.length > 0) {
            $scope.ApprovalMode = true;
            if ($scope.MyWH[$scope.MyWH.length - 1].ToRoleName == 'STAFF') {
                $scope.WorkflowActivated = true;
            }
        }
        else {
            $scope.ApprovalMode = false;
        }
        
        
        ApplyViewChanges($scope);
        $scope.FixHistoryData();

        //mark elements as readonly if required
        if (!((($scope.WorkflowActivated && $scope.ApprovalMode) || (!$scope.ApprovalMode)) && (!($scope.IssuedMode || $scope.RejectedMode || $scope.AcceptedMode)))) {
            $('#EditView input, #EditView textarea').attr('readonly', 'true');
            $('#EditView select, #EditDeliveryDate').prop('disabled', true);
            $scope.updateChosenList();
            $('#txtCommentReasons').removeAttr('readonly');
        }
        else {
            $('#EditView input, #EditView textarea').removeAttr('readonly');
            $('#EditView select, #EditDeliveryDate').prop('disabled', false);
            $scope.updateChosenList();
        }
    });

    $scope.$on('CategoriesListed', function (event) {
        ApplyViewChanges($scope);
        $scope.updateChosenList();
    });

    $scope.$on('CategoryItemsListed', function (event) {
        for (var i = 0; i < $scope.CategoryItems.length; i++) {
            $scope.CategoryItems[i].ItemsInStore = $.grep($scope.allitems, function (e) { return e.Id == $scope.CategoryItems[i].Id })[0].ItemsInStore;
        }
        $scope.EditItems = $scope.CategoryItems;
        ApplyViewChanges($scope);
        $scope.updateChosenList();
    });
    $scope.$on('UsersListed', function (event) {
        ApplyViewChanges($scope);
        $scope.updateChosenList();
    });

    $scope.EditItems = {};
    $scope.$on('ItemsListed', function (event) {
        $scope.EditItems = $scope.allitems;
        ApplyViewChanges($scope);
        $scope.updateChosenList();

        if ($scope.PipingMode) {
            var KeepInterval = setInterval(function () {
                if ($scope.RequisitionListed) {
                    $scope.UnsetPipingMode();
                    var TranId = $.session.get('requisitionid');
                    $scope.PrepareEdit(TranId, true);
                    $('span.usernamelabel').text($scope.user.SurName + ' ' + $scope.user.OtherNames);
                    clearInterval(KeepInterval);
                }
            }, 300);
        }
    });

    $('#SelCategory').change(function () {
        var CatId = $(this).val();
        $scope.getitemsbycategory(CatId);
    });

    $('#SelEditCategory').change(function () {
        var CatId = $(this).val();
        $scope.getitemsbycategory(CatId);
    });
    $scope.BindDeleteFunction = function () {
        $('.ParentControls.Delete').click(function () {
            var MyId = $(this).attr('ref');
            $scope.DeleteRequisition(MyId);
        });

        $('.ParentControls.Edit').click(function () {
            var MyId = $(this).attr('ref');
            $scope.PrepareEdit(MyId);
        });

        $('.edit-wrapper').click(function () {
            var MyId = $(this).attr('ref');
            $scope.PrepareEdit(MyId);
        });


    }
    $scope.EditRequisition = {};

    $scope.ApprovalMode = false;
    $scope.IssuedMode = false;
    $scope.RejectedMode = false;
    $scope.AcceptedMode = false;
    $scope.AcceptanceObject = {};
    $scope.PrepareEdit = function (ref, pipeinmode) {
        //acceptance object is relevant for acceptance feedback after the request has been fulfilled
        $scope.AcceptanceObject = {RequisitionId: ref, feedback: 0, rejectionComment: '', createdBy: $scope.user.Id}
        $scope.IssuedMode = false;
        $('#MainView').slideUp();
        $scope.EditRequisition = $.grep($scope.Requisition, function (e) { return e.Id == ref; })[0];
        $scope.ListWorkflowHistory(ref, false, $scope.Requisition);
        $scope.CurrentItem = $.grep($scope.allitems, function (e) { return e.Id == $scope.EditRequisition.ItemId; })[0];
        $('#SelEditCategory').val($scope.CurrentItem.ItemCategoryId);
        $('#SelEditItem').val($scope.EditRequisition.ItemId);
        $('#SelEditStaff').val($scope.EditRequisition.RequestMadeForStaffId);
        if ($scope.EditRequisition.Status.toLowerCase() == 'issued') {
            $scope.IssuedMode = true;
            $scope.RejectedMode = false;
            $scope.AcceptedMode = false;
        }
        else if ($scope.EditRequisition.Status.toLowerCase() == 'rejected') {
            $scope.RejectedMode = true;
            $scope.AcceptedMode = false;
            $scope.IssuedMode = false;
        }
        else if ($scope.EditRequisition.Status.toLowerCase() == 'accepted') {
            $scope.RejectedMode = false;
            $scope.AcceptedMode = true;
            $scope.IssuedMode = false;
        }
        else {
            $scope.RejectedMode = false;
            $scope.AcceptedMode = false;
            $scope.IssuedMode = false;
        }

        if (!pipeinmode) {
            ApplyViewChanges($scope);
        }
        //ApplyViewChanges($scope);
        $scope.updateChosenList();
        $('#EditView').css('display', 'block');
        $scope.ScrollPageUp();
    }

    $scope.ExitEdit = function () {
        $scope.EditRequisition = {};
        $('#MainView').slideDown();
        $('#EditView').css('display', 'none');
    }

    $scope.AcceptItem = function () {
        $scope.ConfirmBeforeAction('Accept Item?', 'Are you sure you want to accept the item issued to you?',
               function () { $scope.AcknowledgeReceipt(1); });
    }

    $scope.RejectItem = function () {
        $scope.ConfirmBeforeAction('Return Item', 'Are you sure you want to reject / return the item issued to you?',
               function () { $scope.AcknowledgeReceipt(0); });
    }

    $scope.AcknowledgeReceipt = function (feedback) {
        $scope.AcceptanceObject.feedback = feedback;
        $scope.HideModal();
        AjaxOptions.data = JSON.stringify($scope.AcceptanceObject);
        AjaxOptions.url = $scope.serviceURL + "/StaffRequisitionsAcceptanceUpdate";
        $.ajax(AjaxOptions).done(function (results) {
            if (results.d > 0) {
                if (feedback == 1) {
                    $scope.MessageAlert('You successfully accepted the item issued', 'success');
                }
                if (feedback == 0) {
                    $scope.MessageAlert('You have rejected the item issued, contact the store to get a replacement', 'success');
                }
                ApplyViewChanges($scope);
                $scope.ListRequisition();
                $scope.ExitEdit();
                $scope.EditRequisition = {};
            }
            else {
                $scope.MessageAlert('An error occurred. Please try again later.', 'error');
                console.log(results);
            }
        }
        ).fail(AjaxFail);
    }

    $scope.SubmitEditRequisition = function (confirmed) {
        if (!confirmed) {
            $scope.ConfirmBeforeAction('Confirm', 'Are you sure you want to Edit this Request?',
                function () { $scope.SubmitEditRequisition(true) });
            return;
        }
        $scope.HideModal();
        var ItemId = $('#SelEditItem').val();
        if (ItemId == '-') {
            $scope.MessageAlert('Select and Item first.', 'error');
            return;
        }
        $scope.EditRequisition.ItemId = ItemId;

        var RequestedFor = $('#SelEditStaff').val();
        if (RequestedFor == '-') {
            RequestedFor = $scope.user.Id;
        }
        $scope.EditRequisition.RequestMadeForStaffId = RequestedFor;

        try {
            $scope.EditRequisition.DeliveryDate = Date.parseExact($('#EditDeliveryDate').val(), 'd/M/yyyy');
        } catch (e) {
            $scope.MessageAlert('Invalid delivery date selected. Review and retry.', 'error');
            return;
        }

        var UpdateWorkflow = false;
        if ($scope.MyWH.length > 0) {
            if ($scope.MyWH[$scope.MyWH.length - 1].ToRoleName != 'STAFF') {
                $scope.MessageAlert('Sorry, you cannot edit this request again because approval has commenced. You may cancel the request if you wish.', 'error');
                return;
            }
            else {
                UpdateWorkflow = true;
            }
        }

        $scope.EditRequisition.DateCreated = new Date("October 13, 2014 11:13:00"); //arbitrary date, not to be used
        $scope.EditRequisition.DateApproved = $scope.RegularizeDate($scope.EditRequisition.DateApproved);
        $scope.EditRequisition.DateRead = $scope.RegularizeDate($scope.EditRequisition.DateRead);
        $scope.EditRequisition.DateAccepted = $scope.RegularizeDate($scope.EditRequisition.DateAccepted);

        $scope.EditRequisition.CreatedBy = $scope.user.Id;
        AjaxOptions.data = JSON.stringify({ rfidInfo: $scope.EditRequisition });
        AjaxOptions.url = $scope.serviceURL + "/StaffRequisitionsUpdate";
        $.ajax(AjaxOptions).done(function (results) {
            if (results.d > 0) {
                $scope.MessageAlert('Requisition update was successful', 'success');
                console.log(results);
                if (UpdateWorkflow) {
                    $scope.ProcessWorkflowRequest($scope.EditRequisition.Id, $scope.EditRequisition.ApprovalComment, 1);
                }
                ApplyViewChanges($scope);
                $scope.ListRequisition();
                $scope.ExitEdit();
                $scope.EditRequisition = {};
            }
            else {
                $scope.MessageAlert('An error occurred. Please try again later.', 'error');
                console.log(results);
            }
        }
        ).fail(AjaxFail);
    }

   
    ///------------------------------------
    var Requisitiontable;
    var RequisitiontableFormatted = true; //false = enable custom drop down
    $scope.FixRequisitionData = function (TableData) {
        Requisitiontable = $scope.DoDataTable(true, 'tblRequisition', TableData, $scope.BindDeleteFunction, //
       ["ItemName", "Quantity", "Description", "RequestMadeForStaffName", "DeliveryDateReadable", "Status"], false, true, //
       "ItemName", $scope.PrepareEdit);

        $scope.RequisitionListed = true;
        
    }

    $scope.DeleteRequisition = function (RequisitionId, confirmed) {
        if (!confirmed) {
            $scope.ConfirmBeforeAction('Confirm', 'Are you sure you want to Cancel this Request?',
                function () { $scope.DeleteRequisition(RequisitionId, true) });
            return;
        }
        $scope.HideModal();
        $.support.cors = true;
        AjaxOptions.data = JSON.stringify({ Id: RequisitionId });
        AjaxOptions.url = $scope.serviceURL + "/StaffRequisitionsByIdDelete";
        $.ajax(AjaxOptions).done(function (results) {
            console.log(results);
            if (results.d > 0) {
                $scope.ListRequisition();
                $scope.MessageAlert('Requisition cancelled.', 'warning');
                $scope.ExitEdit();
            }
            else {
                $scope.MessageAlert('Request did not complete successfully. Please try again later.', 'error');
            }
        }
        ).fail(AjaxFail);
    }

    var HistoryTable;
    var HistoryTableFormatted = true; //false = enable custom drop down
    $scope.FixHistoryData = function () {
        HistoryTable = $scope.DoDataTable(true, 'tblWorkflowHistory', $scope.MyWH, undefined, //
        ["CreatedByName", "Comment", "FeedBackLabel", "DateCreatedReadable", "ToRoleNameLabel"], true, false);
        
    }

    $scope.ListRequisition();
    $scope.getcategories();
    $scope.getallusers();
    $scope.getallitems();
    
}