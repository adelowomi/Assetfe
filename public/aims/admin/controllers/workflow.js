function workflowCtrl($scope, $http) {

    $scope.NewWorkflow = {
        PortalId: $scope.user.PortalId, TemplateId: $scope.TemplateId, RolesAssetId: null, OrderId: null,   
        IsFinalApproval: false, CanBeSkipped: false, CreatedBy: $scope.user.Id
    }

    TweakSkin();

    $('#SelTemplate').val($scope.TemplateId);
    $('#ImgIllustration').attr('src', 'images/workflows/' + $scope.TemplateId.toString() + '.png');
    $('#SelTemplate').change(function () {
        $('#ImgIllustration').fadeOut();
        $('#ImgIllustration').attr('src', 'images/workflows/' + $(this).val().toString() + '.png'); 
        $('#ImgIllustration').fadeIn();
    });
    
    $('#TemplateChange').next('.panel-body').slideUp();
    $('#TemplateChange').addClass('up');

    $scope.LastManRemoved = false;
    $scope.DeleteWorkflow = function (WorkflowId) {
        if ($scope.Workflows.length <= 3) {
            $scope.MessageAlert('Sorry, workflow already has minimum number of roles. In order to remove, add a new role first.', 'warning');
            return;
        }
        var LastManId = $scope.Workflows[$scope.Workflows.length - 1].Id;
        if (WorkflowId == LastManId) {
            $scope.LastManRemoved = true;
        }
        $.support.cors = true;
        AjaxOptions.data = JSON.stringify({ Id: WorkflowId });
        AjaxOptions.url = $scope.serviceURL + "/RolesWorkFlowByIdDelete";
        $.ajax(AjaxOptions).done(function (results) {
            console.log(results);
            if ($scope.LastManRemoved == false) {
                $scope.NeedReorder = true;
            }
            $scope.ListWorkflows();
        }
        ).fail(AjaxFail);
    }

    
    $scope.EditWorkflow = {};
    $scope.StartEdit = function (ref, target) {
        $scope.EditWorkflow = $.grep(target, function (e) { return e.Id == ref; })[0];
        $('#SelEditRole').val($scope.EditWorkflow.RolesAssetId);
        $scope.updateChosenList();
        ApplyViewChanges($scope);
        $('#DefaultView').slideUp();
        $('#EditView').css('display', 'block');
    }

    $scope.ExitEdit = function () {
        $scope.EditWorkflow = {};
        $('#DefaultView').slideDown();
        $('#EditView').css('display', 'none');
    }

    $('input#RadIsConcurrence').on('ifChecked', function (event) {
        $('#IsOptionalSection').slideDown();
        $scope.NewWorkflow.IsFinalApproval = false;
    });

    $('input#RadIsApproval').on('ifChecked', function (event) {
        $('#IsOptionalSection').slideUp();
        $scope.NewWorkflow.IsFinalApproval = true;
    });

    $scope.AddWorkflow = function () {
        $('input').iCheck('update');
        $scope.NewWorkflow.RolesAssetId = $('#SelRole').val();
        if ($scope.NewWorkflow.RolesAssetId == '-') {
            $scope.MessageAlert('Please specify the role to include in the Workflow.', 'warning');
            return;
        }
        $scope.NewWorkflow.CanBeSkipped = $scope.Booleanfy($('#RadOptional').prop('checked'));
        $scope.NewWorkflow.IsFinalApproval = $scope.Booleanfy($('#RadIsApproval').prop('checked'));
        if ($scope.NewWorkflow.IsFinalApproval) {
            $scope.NewWorkflow.CanBeSkipped = false;
            $scope.NewWorkflow.OrderId = $scope.GetHighestOrderId() + 1;
        }
        else {
            $scope.NewWorkflow.OrderId = $scope.GetHighestOrderId();
        }
        $scope.NewWorkflow.TemplateId = $scope.TemplateId;


        $.support.cors = true;
        AjaxOptions.data = JSON.stringify($scope.NewWorkflow);
        AjaxOptions.url = $scope.serviceURL + "/RolesWorkFlowAdd";
        $.ajax(AjaxOptions).done(function (results) {
            console.log(results);
            if (results.d > 0) {
                if ($scope.NewWorkflow.IsFinalApproval) {
                    //ensure that all other previous entries have false as final approval
                    $scope.EditWorkflowss = $scope.Workflows;
                    if ($scope.EditWorkflowss.length > 0) {
                        for (var i = 0; i < $scope.EditWorkflowss.length; i++) {
                            $scope.EditWorkflowss[i].IsFinalApproval = false;
                        }
                        $scope.SendWorkflowsForUpdate($scope.EditWorkflowss, false);
                    }
                    else {
                        $scope.ListWorkflows();
                        $scope.MessageAlert('Workflow updated', 'success');
                    }
                }
                else {
                    //increase the orderID for only the last workflow item
                    $scope.EditWorkflowss = $scope.Workflows;
                    if ($scope.EditWorkflowss.length > 0) {
                        var lastIndex = $scope.EditWorkflowss.length - 1;
                        $scope.EditWorkflowss[lastIndex].OrderId += 1;
                        var EditPool = [];
                        EditPool.push($scope.EditWorkflowss[lastIndex]);
                        $scope.SendWorkflowsForUpdate(EditPool, false);
                    }
                    else {
                        $scope.ListWorkflows();
                        $scope.MessageAlert('Workflow updated', 'success');
                    }
                }
                $scope.NewWorkflow = {
                    PortalId: $scope.user.PortalId, TemplateId: $scope.TemplateId, RolesAssetId: null, OrderId: null,
                    IsFinalApproval: $scope.NewWorkflow.IsFinalApproval, CreatedBy: $scope.user.Id
                }
                ApplyViewChanges($scope);
            }
            else {
                $scope.MessageAlert('Workflow update was NOT successful. Role may exist in workflow already!', 'error');
            }
        }
        ).fail(AjaxFail);
    }
    //-------------------------------------------- RolesWorkFlowUpdate
    $scope.SendEditWorkflow = function () {
        $scope.EditWorkflow.RolesAssetId = $('#SelEditRole').val();
        if ($scope.EditWorkflow.RolesAssetId == '-') {
            $scope.MessageAlert('Please specify the role for the Workflow member.');
            return;
        }
        var EditArray = [];
        $scope.EditWorkflow.DateCreated = new Date("October 13, 2014 11:13:00"); //arbitrary date, not to be used
        EditArray.push($scope.EditWorkflow);
        $scope.SendWorkflowsForUpdate(EditArray, true);

    }

    $scope.ReOrderDown = function (ref, target) {
        var WorkflowToReorder = $.grep(target, function (e) { return e.Id == ref; })[0];
        var MyOrderId = WorkflowToReorder.OrderId;
       
        var WorkflowBelow = $.grep(target, function (e) { return e.OrderId == MyOrderId + 1; });
        if (WorkflowBelow.length <= 0 || WorkflowBelow == null) {
            $scope.MessageAlert('This is the last workflow member!', 'warning');
            return;
        }
        else {
            MyOrderId++;
            WorkflowToReorder.OrderId = MyOrderId;
            WorkflowBelow = WorkflowBelow[0];
            WorkflowBelow.OrderId--;
            var WorkflowsToUpdate = [];
            var LastManId = $scope.Workflows[$scope.Workflows.length - 1].Id;
            if (LastManId == WorkflowBelow.Id) {
                WorkflowToReorder.IsFinalApproval = true;
                WorkflowToReorder.CanBeSkipped = false;
                WorkflowBelow.IsFinalApproval = false;
            }
            WorkflowsToUpdate.push(WorkflowToReorder);
            WorkflowsToUpdate.push(WorkflowBelow);
            $scope.SendWorkflowsForUpdate(WorkflowsToUpdate);
        }
    }
    //
    $scope.ReOrderUp = function (ref, target) {
        var WorkflowToReorder = $.grep(target, function (e) { return e.Id == ref; })[0];
        var MyOrderId = WorkflowToReorder.OrderId;
        if (MyOrderId == 2) {
            $scope.MessageAlert('Sorry, you cannot change the initiator role!', 'warning');
            return;
        }
        var WorkflowAbove = $.grep(target, function (e) { return e.OrderId == MyOrderId - 1; });
        if (WorkflowAbove.length <= 0 || WorkflowAbove == null) {
            $scope.MessageAlert('This is the first workflow member!', 'warning');
            return;
        }
        else {
            MyOrderId--;
            WorkflowToReorder.OrderId = MyOrderId;
            WorkflowAbove = WorkflowAbove[0];
            WorkflowAbove.OrderId++;
            var WorkflowsToUpdate = [];
            var LastManId = $scope.Workflows[$scope.Workflows.length - 1].Id;
            if (LastManId == ref) {
                WorkflowToReorder.IsFinalApproval = false;
                WorkflowAbove.IsFinalApproval = true;
                WorkflowAbove.CanBeSkipped = false;
            }
            WorkflowsToUpdate.push(WorkflowToReorder);
            WorkflowsToUpdate.push(WorkflowAbove);
            $scope.SendWorkflowsForUpdate(WorkflowsToUpdate);
        }
    }
    //
    $scope.SendWorkflowsForUpdate = function (subject, fulledit) {
        for (var i = 0; i < subject.length; i++) {
            subject[i].DateCreated = new Date("October 13, 2014 11:13:00"); //arbitrary date, not to be used
        }
        $.support.cors = true;
        var ds = { arrRW: subject };
        AjaxOptions.data = JSON.stringify(ds);
        AjaxOptions.url = $scope.serviceURL + "/RolesWorkFlowUpdate";
        $.ajax(AjaxOptions).done(function (results) {
            console.log(results);
            subject = [];
            $scope.ListWorkflows();
            
            ApplyViewChanges($scope);
            if (fulledit == true) {
                $scope.ExitEdit();
            }
            $scope.MessageAlert('Workflow updated', 'success');
        }
        ).fail(AjaxFail);
    }

    $scope.NeedReorder = false;
    $scope.ReorderWorkflowss = {};
    $scope.$on('WorkflowsListed', function (event) {
        if ($scope.NeedReorder) {
            $scope.ReorderWorkflowss = $scope.Workflows;
            for (var i = 0; i < $scope.ReorderWorkflowss.length; i++) {
                $scope.ReorderWorkflowss[i].OrderId = i + 1;
            }
            $scope.NeedReorder = false;
            $scope.SendWorkflowsForUpdate($scope.ReorderWorkflowss);
        }
        else if ($scope.LastManRemoved)
        {
            $scope.ReorderWorkflowss = $scope.Workflows;
            $scope.ReorderWorkflowss[$scope.ReorderWorkflowss.length - 1].IsFinalApproval = true;
            var BounceBack = [];
            BounceBack.push($scope.ReorderWorkflowss[$scope.ReorderWorkflowss.length - 1]);
            $scope.SendWorkflowsForUpdate(BounceBack);
            $scope.LastManRemoved = false;
        }
        else {
            ApplyViewChanges($scope);
            $scope.fixDataWorkflow();
        }
    });

    $scope.$on('TemplateIdGotten', function (event) {
        $('#SelTemplate').val($scope.TemplateId);
        $('#ImgIllustration').attr('src', 'images/workflows/' + $scope.TemplateId.toString() + '.png');
        $scope.ListWorkflows();
    });

    $scope.$on('RolesListed', function (event) {
        ApplyViewChanges($scope);
        $scope.updateChosenList();
    });
    $scope.BindReorderTrigger = function () {

        $('img.ParentControls').unbind();
        $('img.ReOrderUp').click(function () {
            var ref = $(this).attr('ref');
            $scope.ReOrderUp(ref, $scope.Workflows);
        });

        $('img.ReOrderDown').click(function () {
            var ref = $(this).attr('ref');
            $scope.ReOrderDown(ref, $scope.Workflows);
        });

        $('img.EditParent').click(function () {
            var ref = $(this).attr('ref');
            $scope.StartEdit(ref, $scope.Workflows);
        });

        $('img.Delete').click(function () {
            var ref = $(this).attr('ref');
            $scope.DeleteWorkflow(ref);
        });
    }

    $scope.formatWorkflow = function (d) {
        // `d` is the original data object for the row
      
        return '<div class="childcontainer" style="padding-left: 0px; background: #dfc5cc;">' +//
            '<h5 style="font-weight: bold; margin-left: 5px; color: #e1003a;margin-top: 0px; padding-top: 20px">' +
            'Child Workflows</h5><table id="' +//
            CurrentParentRef + '" class="childmembers table table-striped" cellpadding="5" cellspacing="0" border="0" style="padding-left:50px; width: 100%;"><thead>' +
            '<tr style="background: #dfc5cc; color: #fff;">' +
                  '<th>Name</th><th>Description</th><th>URL</th><th>Icon Class</th><th></th>' +
              '</tr></thead><tbody>' +
            '<tr>' +
                  '<td colspan="5"><button  type="submit" ref="' + d.Id + '" class="btn btn-danger btn-sm ParentDelete" style="float: right;"><i class="fa fa-close" style="margin-right: 10px;"></i>Delete Workflow Family</button></td>' +
              '</tr>' +
            '<tr>' +
                  '<td colspan="5"></td>'
        '</tr>' +


    '</tbody></table><br style="clear: both;" /></div>';

    }
    ///------------------------------------
    var Workflowtable;
    var WorkflowtableFormatted = false;
    $scope.fixDataWorkflow = function () {
        try {
            Workflowtable.destroy();
        } catch (e) {

        }

        Workflowtable = $('#tblWorkflows').DataTable({
            "ordering": false,
            dom: 'T<"clear">lfrtip',
            tableTools: {
                "sSwfPath": "resources/copy_csv_xls_pdf.swf"
            },
            data: $scope.Workflows,
            columns: [
                    { "data": "RoleName" }, { "data": "OptionalBadge" }, { "data": "Function" }, { "data": "Controls" }

            ]
        });


        if (!WorkflowtableFormatted) {

            // Add event listener for opening and closing details
            $('#tblWorkflows tbody').on('click', 'td.details-control', function () {
                var tr = $(this).parents('tr');
                var row = Workflowtable.row(tr);

                if (row.child.isShown()) {
                    // This row is already open - close it
                    row.child.hide();
                    tr.removeClass('shown');
                }
                else {
                    // Open this row
                    row.child($scope.formatWorkflow(row.data())).show();
                    tr.addClass('shown');
                }
                //$scope.BindRoomTypeDelete();
            });
            WorkflowtableFormatted = true;
        }
        //ensure that the reorder buttons can work
        setTimeout(function () { $scope.BindReorderTrigger(); }, 200);
    }
    //
    $scope.GetHighestOrderId = function (parentid) {
        if ($scope.Workflows.length > 0 && $scope.Workflows != null) {
            return $scope.Workflows[$scope.Workflows.length - 1].OrderId;
        }
        else {
            return 0;
        }
    }

    $scope.NewTemplateRow = {};
    $scope.ChangeWorkflowTemplate = function () {
        $scope.NewTemplateRow = $scope.TemplateRow;
        $scope.NewTemplateRow.UtilityValue = $('#SelTemplate').val();
        $scope.NewTemplateRow.CreatedDate = new Date("October 13, 2014 11:13:00");
        $.support.cors = true;
        var ds = { rfidInfo: $scope.NewTemplateRow };
        AjaxOptions.data = JSON.stringify(ds);
        AjaxOptions.url = $scope.serviceURL + "/UtilityUpdate";
        $.ajax(AjaxOptions).done(function (results) {
            console.log(results);
            $scope.GetTemplateId();
            $scope.ListWorkflows();
            $('#ImgIllustration').attr('src', 'images/workflows/' + $('#SelTemplate').val().toString() + '.png');
            ApplyViewChanges($scope);
        }
        ).fail(AjaxFail);
    }

    $scope.ListWorkflows();
    $scope.ListRoles();

    setTimeout(function () { $scope.updateChosenList(); }, 2000);
}