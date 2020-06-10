function companyCtrl ($scope, $http)
{

    $('#EditView').slideUp();
   

    $scope.newCompany = {};
    $scope.ResetData = function(){
        $scope.newCompany.CompanyName = null;
        $scope.newCompany.CompanyAddress ="";
        $scope.newCompany.CompanyEmail= null;
        $scope.newCompany.MobileNo = "";
        $scope.newCompany.ContactPersonName = "";
        $scope.newCompany.ContactPersonName = "";
    }
    $scope.ResetData();
    $scope.UploadedLogo = {done: false};
    $scope.UploadedSign = { done: false };
    $scope.EditedLogo = { done: false };
    $scope.EditedSign = { done: false };
    $scope.ImmediatelyEdit = {
        Logo: false, Signature: false, PortalId: 0, LogoPath: "", SignaturePath: ""
    }
    d = new Date();
    $scope.LogoFile = { filename: "" };// 
    $scope.SignFile = { filename: "" };
    $scope.MakeDropZone('#profilepic', $scope.LogoFile, 'AIMS/CompanyLogos', '/CompanyLogos/', $scope.UploadedLogo);
    $scope.MakeDropZone('#signature', $scope.SignFile, 'AIMS/CompanySignatures', '/CompanySignatures/', $scope.UploadedSign);
    
    TweakSkin();

    $scope.DeleteCompany = function (CompanyId, confirmed) {
        if (!confirmed) {
            $scope.ConfirmBeforeAction('Confirm Delete!', 'Are you sure you want to remove this organisation?<br>' + //
                'This action will terminate all access to the application for all employees in the organisation.<br><br>' +//
                '<b>Do you want to continue?</b>',
                function () { $scope.DeleteCompany(CompanyId, true) });
            return;
        }
        $.support.cors = true;
        AjaxOptions.data = JSON.stringify({Id: CompanyId});
        AjaxOptions.url = $scope.serviceURL + "/CompanyByIdDelete";
        $.ajax(AjaxOptions).done(function (results) {
            console.log(results);
            if (results.d > 0) {
                $scope.getCompanies();
                ApplyViewChanges($scope);
                $scope.MessageAlert('Company record deleted.', 'success');
                $scope.ExitEdit();
            }
            else {
                $scope.MessageAlert('Request did not complete successfully. Please try again later.', 'error');
            }
        }
        ).fail(AjaxFail);
    }

	
	$scope.CreateCompany = function () {
	    
	    if ($scope.newCompany.CompanyName == undefined || $scope.newCompany.CompanyName.toString().trim() == "") {
	        $scope.MessageAlert('Fill in all company details before submitting.', 'error');
	        return;
	    }
	    if ($scope.UploadedLogo.done) {
	        $scope.newCompany.CompanyLogoUrl = '/CompanyLogos/' + $scope.LogoFile.filename;
	    }
	    else {
	        $scope.newCompany.CompanyLogoUrl = '/no-logo.phf';
	    }
	    if ($scope.UploadedSign.done) {
	        $scope.newCompany.AuthorizedSignUrl = '/CompanySignatures/' + $scope.SignFile.filename;
	    }
	    else {
	        $scope.newCompany.AuthorizedSignUrl = '/no-signature.phf';
	    }
	    
	    if ($('#selCountry').val() == '-') {
	        $scope.MessageAlert('You must select a Country before you can continue.', 'error');
	        return;
	    }
	    
	    $scope.newCompany.CreatedBy =$scope.user.Id;
        $scope.newCompany.CountryId = $('#selCountry').val();    

        $.support.cors = true;
        $scope.newCompany.hostname = Hostname;
	    AjaxOptions.data = JSON.stringify($scope.newCompany);
	    AjaxOptions.url = $scope.serviceURL + "/CompanyAdd";
	    $.ajax(AjaxOptions).done(function (results) {
	        console.log(results);
	        if (results.d > 0) {
	            // $scope.newCompany = {};
	            var PortalId = results.d;
	            var OldFilenames = [];
	            var NewFilenames = [];
	            var NewPaths = [];
	            $scope.ImmediatelyEdit.PortalId = results.d;
	            if ($scope.UploadedLogo.done) {
	                OldFilenames.push(RootFolder + '/CompanyLogos/' + $scope.LogoFile.filename);
	                NewFilenames.push(RootFolder + '/CompanyLogos/' + PortalId + "/" + $scope.LogoFile.filename);
	                NewPaths.push(RootFolder + '/CompanyLogos/' + PortalId + "/");
	                $scope.ImmediatelyEdit.Logo = true;
	                $scope.ImmediatelyEdit.LogoPath = '/CompanyLogos/' + PortalId + "/" + $scope.LogoFile.filename;
	            }
	            if ($scope.UploadedSign.done) {
	                OldFilenames.push(RootFolder + '/CompanySignatures/' + $scope.SignFile.filename);
	                NewFilenames.push(RootFolder + '/CompanySignatures/' + PortalId + "/" + $scope.SignFile.filename);
	                NewPaths.push(RootFolder + '/CompanySignatures/' + PortalId + "/");
	                $scope.ImmediatelyEdit.Signature = true;
	                $scope.ImmediatelyEdit.SignaturePath = '/CompanySignatures/' + PortalId + "/" + $scope.SignFile.filename;
	            }
	            if (!$scope.UploadedSign.done && !$scope.UploadedLogo.done) {
	                $scope.FinishUpAddition();
	            } else {
	                $scope.MoveFiles(OldFilenames, NewFilenames, PortalId, NewPaths);
	            }
	        }
	        else {
	            $scope.MessageAlert('Request did not complete successfully. Please try again later.', 'error');
	        }
	    }
        ).fail(AjaxFail);

	}

	$scope.MoveFiles = function (OldFilenames, NewFilenames, PortalId, NewPaths) {

	    var url = FileUploader;
	    var params = {};
	    var ds = {OldFilenames: OldFilenames, NewFilenames: NewFilenames, PortalId: PortalId, NewPaths: NewPaths}
	    
	    ShowBusyMode();

	    $.ajax({
	        type: "POST",
	        url: url, headers: { "MsgJSON": JSON.stringify(ds) },
	        data: JSON.stringify({}),
	        success: function (response, status, request) {
	            if (response == 0) {
	                $scope.MessageAlert('Sorry, an error occurred while updating Logo / Authorized signature. Use the edit function to update Portal information if Logo / Authorized signature doesnt display correctly', 'error');
	                HideBusyMode();
	            }
	            else {
	                $scope.MessageAlert('Logo / Signaure upload ok.');
	                HideBusyMode();
	                //}
	            }
	            $scope.FinishUpAddition();
	        }, error: function () {
	            $scope.MessageAlert('Sorry, couldnot update Logo / Authorized signature. Use the edit function to update Portal information if Logo / Authorized signature doesnt display correctly', 'error');
	            $scope.FinishUpAddition();
	            HideBusyMode();
	        }
	    });
	}
   
	$scope.FinishUpAddition = function () {
	    
	    $scope.getCompanies();
	    $('#profilepic, #signature').removeAttr('src');
	    $scope.UploadedLogo.done = false;
	    $scope.UploadedSign.done = false;
	    $scope.ResetData();
	    ApplyViewChanges($scope);
	    $scope.MessageAlert('New company added successfully.', 'success');
	}

        $scope.$on('CountriesListed', function (event) {
            ApplyViewChanges($scope);
            $scope.updateChosenList();
            $scope.getCompanies();
        });
        $scope.$on('CompaniesListed', function (event) {
            if ($scope.ImmediatelyEdit.Logo || $scope.ImmediatelyEdit.Signature) {
                $scope.EditCompany = $.grep($scope.Companies, function (e) { return e.Id == $scope.ImmediatelyEdit.PortalId; })[0];
                if ($scope.ImmediatelyEdit.Logo) {
                    $scope.EditCompany.CompanyLogoUrl = $scope.ImmediatelyEdit.LogoPath;
                }
                if ($scope.ImmediatelyEdit.Signature) {
                    $scope.EditCompany.AuthorizedSignUrl = $scope.ImmediatelyEdit.SignaturePath;
                }
                $scope.SubmitEditCompany(true, true);
                $scope.ImmediatelyEdit = {
                    Logo: false, Signature: false, PortalId: 0, LogoPath: "", SignaturePath: ""
                }
            }
            else {
                $scope.fixDataCompany();
                ApplyViewChanges($scope);
            }
        });
       
        $scope.ListCountries();
        
        $scope.BindDeleteFunction = function () {
            $('.ParentControls.Delete').click(function () {
                var MyId = $(this).attr('ref');
                $scope.DeleteCompany(MyId);
            });

            $('.ParentControls.Edit').click(function () {
                var MyId = $(this).attr('ref');
                $scope.PrepareEdit(MyId);
            });


        }
        $scope.EditCompany = {};

        $scope.PrepareEdit = function (ref) {
           

            $('#MainView').slideUp();
            $scope.EditCompany = $.grep($scope.Companies, function (e) { return e.Id == ref; })[0];
            //reset dropzones
            $('#EditDropzoneContainerLogo').empty();
            $('#EditDropzoneContainerLogo').append('<img alt="" id="editLogo" style="margin-left: 0px; float: left !important" class="sane-image">');
            $scope.MakeDropZone('#editLogo', $scope.LogoFile, 'AIMS/CompanyLogos', '/CompanyLogos/', $scope.EditedLogo, [{PortalId: $scope.EditCompany.Id}], true );

            $('#EditDropzoneContainerSign').empty();
            $('#EditDropzoneContainerSign').append('<img alt="" id="editSign" style="margin-left: 0px; width: 200px; float: left !important; " class="sane-image">');
            $scope.MakeDropZone('#editSign', $scope.SignFile, 'AIMS/CompanySignatures', '/CompanySignatures/', $scope.EditedSign, [{ PortalId: $scope.EditCompany.Id }], true);
            //end reset dropzones

            $('#selEditCompany').val($scope.EditCompany.CountryId);
            $('#editLogo').attr('src', $scope.PictureRoot + $scope.EditCompany.CompanyLogoUrl);
            $('#editLogo').css('width', 'auto');
            $('#editSign').attr('src', $scope.PictureRoot + $scope.EditCompany.AuthorizedSignUrl);
            $scope.updateChosenList();
            $('#EditView').css('display', 'block');
            $scope.ScrollPageUp();
        }
 
        $scope.ExitEdit = function () {
            $scope.EditCompany = {};
            $('#MainView').slideDown();
            $('#EditView').css('display', 'none');
        }

        $scope.SubmitEditCompany = function (confirmed, silent) {
            if (!confirmed) {
                $scope.ConfirmBeforeAction('Confirm Update!', 'Are you sure you want to update this organisation record?<br>' + //
                    'You action will have system wide implications.<br><br>' +//
                    '<b>Do you want to continue?</b>',
                    function () { $scope.SubmitEditCompany(true) });
                return;
            }
            if (!silent) {
                if ($scope.EditCompany.CompanyName == undefined || $scope.EditCompany.CompanyName.toString().trim() == "") {
                    $scope.MessageAlert('Fill in all company details before submitting.', 'error');
                    return;
                }
                if ($scope.EditedLogo.done) {
                    $scope.EditCompany.CompanyLogoUrl = '/CompanyLogos/' + $scope.EditCompany.Id + "/" + $scope.LogoFile.filename;
                }
                if ($scope.EditedSign.done) {
                    $scope.EditCompany.AuthorizedSignUrl = '/CompanySignatures/' + $scope.EditCompany.Id + "/" + $scope.SignFile.filename;
                }

                if ($('#selEditCompany').val() == '-') {
                    $scope.MessageAlert('You must select a Country before you can continue.', 'error');
                    return;
                }
                else {
                    $scope.EditCompany.CountryId = $('#selEditCompany').val();
                }
            }
            $scope.EditCompany.DateCreated = new Date("October 13, 2014 11:13:00"); //arbitrary date, not to be used
            $scope.EditCompany.CreatedBy = $scope.user.Id;
            
            //delete $scope.EditCompany.__type;
            //delete $scope.EditCompany.SignImage;
            //delete $scope.EditCompany.LogoImage; //Controls.Delete.Edit.CountryName
            //delete $scope.EditCompany.Controls;
            //delete $scope.EditCompany.Delete;
            //delete $scope.EditCompany.Edit;
            //delete $scope.EditCompany.CountryName;
            
            //ds.push($scope.EditCompany);
            $.support.cors = true;
            AjaxOptions.data = JSON.stringify({ tInfo: $scope.EditCompany });
            AjaxOptions.url = $scope.serviceURL + "/CompanyUpdate";
            $.ajax(AjaxOptions).done(function (results) {
                console.log(results);
                if (results.d > 0) {
                    $scope.EditCompany = {};
                    $scope.getCompanies();
                    if (!silent) { //silent allows us to do an update without returning feedback to the user
                                    //used when a new company is created due to the complexities of logo and signature urls
                        $('#editLogo, #ediSign').removeAttr('src');
                        $scope.EditedLogo.done = false;
                        $scope.EditedSign.done = false;
                        if ($scope.user.IsSuperUser) {
                            $scope.ExitEdit();
                        }

                        ApplyViewChanges($scope);
                        $scope.MessageAlert('Record update was successful.', 'success');
                    }
                }
                else {
                    $scope.MessageAlert('Request did not complete successfully. Please try again later.', 'error');
                }
            }
            ).fail(AjaxFail);

        }
        
    ///------------------------------------
        var Companytable;
        var CompanytableFormatted = true; //false = enable custom drop down
        $scope.fixDataCompany = function () {
            Companytable = $scope.DoDataTable(CompanytableFormatted, 'tblCompanies', $scope.Companies, $scope.BindDeleteFunction, //
             ["LogoImage", "CompanyName", "CompanyAddress", "CompanyEmail", "MobileNo", "ContactPersonName", "SignImage", "CountryName"],//
             false, true, "CompanyName", $scope.PrepareEdit);

            if (!$scope.user.IsSuperUser) {
                $scope.PrepareEdit($scope.user.PortalId);
            }
        }
}