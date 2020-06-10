function approvalsCtrl($scope, $http) {
    TweakSkin();
    /// ---------------------------------------------------
   
    $scope.WorkflowItem = {
        PortalId: $scope.user.PortalId, StaffRequisitionsId: null, Comment: "", feedback: null,
        CreatedBy: $scope.user.Id
    }

    $scope.$on('ApprovalsListed', function (event) {
        $scope.FixApprovalData($scope.Approvals);
    });

    $scope.$on('ApprovalsHistoryListed', function (event) {
        $scope.FixApprovalData($scope.ApprovalsHistory);
    });

    $scope.ApproveRequest = function () {
        $scope.ProcessRequest($scope.EditApproval.Id, $scope.EditApproval.Comment, 1);
    }
    $scope.RejectRequest = function () {
        $scope.ProcessRequest($scope.EditApproval.Id, $scope.EditApproval.Comment, 0);
    }
    $scope.ProcessRequest = function (requisitionid, comment, feedback) {
        $scope.WorkflowItem.StaffRequisitionsId = requisitionid;
        $scope.WorkflowItem.Comment = comment;
        $scope.WorkflowItem.feedback = feedback;

        $.support.cors = true;
        $scope.WorkflowItem.hostname = Hostname;
        AjaxOptions.data = JSON.stringify($scope.WorkflowItem);
        AjaxOptions.url = $scope.serviceURL + "/StaffRequisitionsWorkFlowAdd";
        $.ajax(AjaxOptions).done(function (results) {
            if (results.d > 0) {
                $scope.MessageAlert('Action was processed successfully', 'success');
                console.log(results);
                $scope.EditApproval = {};
                ApplyViewChanges($scope);
                $scope.ListApprovals();
                $scope.ExitEdit();
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
        $('.ParentControls.Reject').click(function () {
            var MyId = $(this).attr('ref');
            $scope.ProcessRequest(MyId, 'Rejected', 0);
        });

        $('.ParentControls.Approve').click(function () {
            var MyId = $(this).attr('ref');
            $scope.ProcessRequest(MyId, 'Okay', 1);
        });

        $('.ParentControls.Notes').click(function () {
            var MyId = $(this).attr('ref');
            $scope.PrepareEdit(MyId);
        });


    }

    $scope.EditApproval = {};
    $scope.PrepareEdit = function (ref, pipeinmode) {
        $scope.ListWorkflowHistory(ref, true, $scope.Approvals);
        $('#MainView').slideUp();
        $scope.EditApproval = $.grep($scope.Approvals, function (e) { return e.Id == ref; })[0];
        if (!pipeinmode) {
            ApplyViewChanges($scope);
        }
        $('#EditView').css('display', 'block');
        $scope.ScrollPageUp();
    }

    $scope.ExitEdit = function () {
        $scope.EditApproval = {};
        $('#MainView').slideDown();
        $('#EditView').css('display', 'none');
        Approvaltable.columns.adjust().draw();
    }

    $scope.SubmitEditApproval = function () {
        //
        var branchid = $("#SelEditBranch").val();
        if (branchid == "-") {
            $scope.MessageAlert('Form not properly filled. Ensure you specified a valid Branch.');
            return;
        }
        $scope.EditApproval.TagLocationBranchId = branchid;
        $scope.EditApproval.PurchasedByUserId = $('#SelEditPurchaser').val();
        if ($scope.EditApproval.PurchasedByUserId == "-") {
            $scope.MessageAlert('Please specify the employee / personnel who purchased item(s).');
            return;
        }
        try {
            $scope.EditApproval.ItemPurchaseDate = $scope.computedate($scope.EditApproval.ItemPurchaseDateReadable, "10:00 AM");
        }
        catch (e) {
            $scope.MessageAlert('Please specify valid purchase date.', 'error');
            return;
        }

        if ($scope.UploadedItemImage.done) {
            $scope.EditApproval.PhotoUrl = $scope.PictureRoot + '/AssetImages/Items/' + $scope.ItemFile.filename;
        }
        $scope.EditApproval.DateCreated = new Date("October 13, 2014 11:13:00"); //arbitrary date, not to be used
        $scope.EditApproval.CreatedBy = $scope.user.Id;
        $scope.EditApproval.SendSMS = $scope.Booleanfy($('#SelSMS').val());

        //bad date issues and nulls -- TOO BAD I HAVE TO DO THIS
        $scope.EditApproval.ServiceValidTillDate = $scope.RegularizeDate($scope.EditApproval.ServiceValidTillDate);
        $scope.EditApproval.CardValidTillDate = $scope.RegularizeDate($scope.EditApproval.CardValidTillDate);
        $scope.StripObjectOfNulls($scope.EditApproval);
        //
        $scope.EditApproval.__type = "UnifiedSchoolPortalService.RFIDTagsInfo"; //this is funny and its a new discovery
        $.support.cors = true;
        AjaxOptions.data = JSON.stringify({ tInfo: $scope.EditApproval });
        AjaxOptions.url = $scope.serviceURL + "/RFIDTagsUpdate";
        $.ajax(AjaxOptions).done(function (results) {
            if (results.d > 0) {
                $scope.MessageAlert('Item update was successful', 'success');
                console.log(results);
                ApplyViewChanges($scope);
                $scope.ListApprovals();
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
    var Approvaltable;
    var ApprovaltableFormatted = true; //false = enable custom drop down
    $scope.FixApprovalData = function (TableData) {
        Approvaltable = $scope.DoDataTable(ApprovaltableFormatted, 'tblApproval', TableData, $scope.BindDeleteFunction, //
              ["ItemCode", "ItemName", "Quantity", "RequestMadeByStaffName", "RequestMadeForStaffName",//
                  "DepartmentName", "DateCreatedReadable", "DeliveryDateReadable"],//
              false, true, "ItemName", $scope.PrepareEdit);

        
        //ensure that the reorder buttons can work
        
        if ($scope.PipingMode) {
            $scope.PipingMode = false;
            var TranId = localStorage.getItem('requisitionid');
            $scope.PrepareEdit(TranId, true);
            $('span.usernamelabel').text($scope.user.SurName + ' ' + $scope.user.OtherNames);
        }
    }

    $scope.DeleteApproval = function (ApprovalId) {
        $scope.MessageAlert('Sorry, item deletion is not enabled on your portal.', 'error');
        return;


        var RFId = $.grep($scope.Approval, function (e) { return e.Id == ApprovalId })[0].RFID;
        $.support.cors = true;
        AjaxOptions.data = JSON.stringify({ PortalId: $scope.user.PortalId, RFID: RFId });
        AjaxOptions.url = $scope.serviceURL + "/RFIDTagsByRFIDDelete";
        $.ajax(AjaxOptions).done(function (results) {
            console.log(results);
            if (results.d > 0) {
                $scope.ListApprovals();
                $scope.MessageAlert('Approval record deleted.', 'warning');
            }
            else {
                $scope.MessageAlert('Request did not complete successfully. Please try again later.', 'error');
            }
        }
        ).fail(AjaxFail);
    }

    $('#RadPending').on('ifChecked', function () {
        $scope.ListApprovals();
    });

    $('#RadHistory').on('ifChecked', function () {
        $scope.ListApprovalsHistory();
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
            columns: [
                    { "data": "CreatedByName" }, { "data": "Comment" }, { "data": "FeedBackLabel" }, { "data": "DateCreatedReadable" },
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

    //$scope.getallitems();
   // $scope.getBranches();
    //$scope.getallusers();
    $scope.ListApprovals();
    

}