/// <reference path="../partials/items/assign.html" />

function AppCtrl($scope, $http)
{
    $scope.serviceURL = baseUrl + "AssetManagerServices.asmx";
	$scope.serviceURL2 = "";
	$scope.pictureHost = "uploads"; //
    $scope.pictureHostMain = "http://localhost:56700/";
	$scope.PageRoot = AngularPath;
	$scope.Uploader = FileUploader;
	$scope.PictureRoot = PictureHostRoot;
	$scope.guid = function() {
		function s4() {
			return Math.floor((1 + Math.random()) * 0x10000)
			  .toString(16)
			  .substring(1);
		}
		return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
		  s4() + '-' + s4() + s4() + s4();
	}

	if (!Object.keys) Object.keys = function (o) {
		if (o !== Object(o))
			return [];
		var ret = [], p;
		for (p in o) if (Object.prototype.hasOwnProperty.call(o, p)) ret.push(p);
		return ret;
	}

	$scope.GoBack = function () {
		window.history.back();
	}

	$scope.PassKey =  $scope.guid();
	$scope.Encrypt = function (str) {
		var ciphertext = Aes.Ctr.encrypt(str, $scope.PassKey, 256);
		return ciphertext;
	}

	$scope.Decrypt = function (str) {
		var origtext = Aes.Ctr.decrypt(str, $scope.PassKey, 256);
		return origtext;
	}
	$scope.tran = {};
	
	$scope.selectedcategory = {};
	$scope.selectedcategory.items = {}
	$scope.selectedcategory.Id = 0;
	$scope.CurrentCompany = {};
	$scope.transportCompanyArray = [];
	$scope.selectedCompany = {};
	$scope.newCompany = {};
	
	$scope.states = {};
	
	
	
	$scope.IdAvailable = false;
	$scope.AvailableIDCards = {};
	$scope.FreshUser = {};

	//because of Piping, user implementation has to be examined
	$scope.PipingMode = false;
	if (window.location.href.indexOf('pipe') > -1) {
		//passthrough piping
		$scope.PipingMode = true;
	}
    try {
        $scope.user = JSON.parse(localStorage.getItem('user'));
        //$scope.user = $scope.user[0];
        localStorage.setItem('userid', $scope.user.Id);
		$scope.userid = $scope.user.Id;

	}
	catch (e) {
		//user not logged in so, there will be an error.
		//we need to check here if user's remember me cookie is still valid
		var SavedUser = Cookies.get('user');
		if (SavedUser != undefined) {
			SavedUser = JSON.parse(SavedUser);
            $scope.user = SavedUser;
            localStorage.setItem('userid', $scope.user.Id);
			$scope.userid = $scope.user.Id;
		}
		else {
			
		}
		
		if (window.location.href.indexOf('pipe') > -1) {
			//passthrough piping
			$scope.PipingMode = true;
		}
		else {
			if (SavedUser == undefined) { //send the user out only if its not in piping mode.
				window.location.href = "../logout.html";
			}
		}

	}

	$scope.ThrowPageError = function (ErrorTitle, ErrorMessage) {
		ThrowPageError(ErrorTitle, ErrorMessage);
	}

	$scope.ScrollPageUp = function () {
		$("html, body").animate({ scrollTop: 0 }, "slow");
	}

	$scope.DataTableFormatDrop = function (d, Processor) {
		// `d` is the original data object for the row
		if (Processor) {
			return Processor(d);
		}
		else {
			return '';
		}

	}
	///------------------------------------
	$scope.DoDataTable = function (DataTableFormatted, HTMLTableName, HTMLTableData, BindMethod, //
		DataHeaders, DontDropDown, Ordering, FieldToWrap, RowClickMethod) {
		if (HTMLTableData == null) HTMLTableData = {};
		if (FieldToWrap) {
			for (var i = 0; i < HTMLTableData.length; i++) {
				HTMLTableData[i][FieldToWrap +'Wrapped'] = "<a class='edit-wrapper' ref='" + HTMLTableData[i].Id + "'>" + HTMLTableData[i][FieldToWrap] + "</a>";
			}
			for (var i = 0; i < DataHeaders.length; i++) {
				if (DataHeaders[i] == FieldToWrap) {
					DataHeaders[i] = FieldToWrap + 'Wrapped';
					break;
				}
			}
		}
		var DataTableObject;
		try {
			DataTableObject.destroy();
		} catch (e) {

		}
		if (!Ordering) Ordering = false;
		var cols = [];
		if (!DontDropDown) {
			cols.push({
				"class": 'details-control',
				"orderable": false,
				"data": null,
				"defaultContent": ''
			});
		}
		for (var i = 0; i < DataHeaders.length; i++) {
			cols.push({"data": DataHeaders[i] });
		}
		for (var i = 0; i < HTMLTableData.length; i++) {
			HTMLTableData[i].DT_RowId = HTMLTableData[i].Id;
		}
		DataTableObject = $('#' + HTMLTableName).DataTable({"destroy": true,
			responsive: true, 
			"ordering": Ordering, "pageLength": 50,
			dom: 'T<"clear">lfrtip',
			tableTools: {
				"sSwfPath": "resources/copy_csv_xls_pdf.swf"
			},
			data: HTMLTableData,
			columns: cols,
			order: [[1, 'asc']]
		});
		DataTableObject.columns.adjust().draw();
		DataTable_LastRecord_Id = 0;
		//row clicks should trigger edit
		if (RowClickMethod) {
			
			$('#' + HTMLTableName + ' tbody').on('click', 'td:not(.details-control)', function () {
				var tr = $(this).parents('tr');
				var row = DataTableObject.row(tr);
				if (DataTable_LastRecord_Id == tr[0].id) { //RowClickMethod runs twice. For whatever reason, the click event binds twice
					DataTable_LastRecord_Id = 0;            //DataTable_LastRecord_Id helps to prevent double execution of RowClickMethod
					return;                                 // on assumption that it would never run more than twice
				} else {
					DataTable_LastRecord_Id = tr[0].id;
					if (!$scope.Booleanfy(tr[0].id)) return;
					RowClickMethod(tr[0].id);
				}
				//RowClickMethod(DataTableObject.row(this).data().Id);
			});
		}

		if (!DataTableFormatted) {

			// Add event listener for opening and closing details
			$('#' + HTMLTableName + ' tbody').on('click', 'td.details-control', function () {
				var tr = $(this).parents('tr');
				var row = DataTableObject.row(tr);

				if (row.child.isShown()) {
					// This row is already open - close it
					row.child.hide();
					tr.removeClass('shown');
				}
				else {
					// Open this row
					row.child($scope.DataTableFormatDrop(row.data())).show();
					tr.addClass('shown');
				}
				//$scope.BindRoomTypeDelete();
			});
			TesttableFormatted = true;
		}
		//ensure that the reorder buttons can work
		if (BindMethod) {
			setTimeout(function () { BindMethod(); }, 200);
			$('#' + HTMLTableName).on('page.dt', function () {
				setTimeout(function () { BindMethod(); }, 200);
			});
			$('#' + HTMLTableName).on('order.dt', function () {
				setTimeout(function () { BindMethod(); }, 200);
			});
			$('#' + HTMLTableName).on('search.dt', function () {
				setTimeout(function () { BindMethod(); }, 200);
			});

			$('#' + HTMLTableName).on('length.dt', function (e, settings, len) {
				setTimeout(function () { BindMethod(); }, 200);
			});
		}

		return DataTableObject;
	}

	$scope.ConfirmBeforeAction = function (HeaderTitle, HeaderContent, ActionMethod, CancelText, OkText) {
		if (CancelText) {
			$('#MainModalCancelButton').text(CancelText);
		}
		if (OkText) {
			$('#MainModalActionButton').text(OkText);
		}
		$('#MainModalTitle').empty();
		$('#MainModalBody').empty();
		$('#MainModalTitle').append(HeaderTitle);
		$('#MainModalBody').append(HeaderContent);
		$('#MainModalActionButton').unbind('click');
		$('#MainModalActionButton').click(function () { ActionMethod(); $scope.HideModal();});
		$('#MainModal').modal('show');
	}

	$scope.HideModal = function () {
		$('#MainModal').modal('hide');
	}

	$scope.Booleanfy = function(IntorStringVal)
	{
		if (IntorStringVal == undefined) return false;
		if (IntorStringVal >= 1) {
			return true;
		}
		else if (IntorStringVal <= 0) {
			return false;
		}
		else if (IntorStringVal.toLowerCase().trim() == 'true') {
			return true;
		}
		else if (IntorStringVal.toLowerCase().trim() == 'false') {
			return false;
		}
		else if (IntorStringVal == true) {
			return true;
		}
		else if (IntorStringVal == false) {
			return false;
		}
		else {
			return false;
		}
	}

	$scope.Bitfy = function (boolVal) {
		if (boolVal) {
			return 1;
		}
		else {
			return 0;
		}
	}

	$scope.MessageAlert = function (message, type, autoclose) {
		var closeWith = [];
		var timeout = 10000;
		if (!autoclose) {
			closeWith = ['click'];
		}
		else {
			if (autoclose === true) {
				closeWith = ['click'];
			}
			else {
				closeWith = ['hover'];
				timeout = false;
			}
		}
		var n = noty({
			layout: 'topRight',
			text: message, theme: 'relax', type: type, timeout: timeout, animation: {
				open: 'animated bounceInRight', // Animate.css class names
				close: 'animated bounceOutRight', // Animate.css class names
				easing: 'swing', // unavailable - no need
				speed: 500 // unavailable - no need
			},
			closeWith: closeWith
		});
		return;

	}

	$scope.MakeDropZone = function (targetelement, filenameOnServer, folderPathOnServer, folderRightPart, successfactor,
		ExtraDatas, UsePortalId) {
		var PortalId;
		d = new Date();
        folderPathOnServer = RootFolder + folderRightPart;
        filenameOnServer.filename = localStorage.getItem('userid') + '_' + d.getTime();
		var mydropzone = $(targetelement).dropzone({
			url: $scope.Uploader, headers: { "myfilename": filenameOnServer.filename, "folderpath": folderPathOnServer },
			dragover: function (event) {
				$(targetelement).css('border-color', '#e1003a');
			}, drop: function () {
				$(targetelement).css('border-color', '#f1f2f7');
			}, dragleave: function () {
				$(targetelement).css('border-color', '#f1f2f7');
			}, uploadprogress: function (file, progress, bytesSent) {
				$(targetelement).removeAttr('src');
				$(targetelement).addClass('manualspinner');
            }, sending: function (file, xhr, formData) {
                filenameOnServer.filename = localStorage.getItem('userid') + '_';
				formData.append("MyRealName", filenameOnServer.filename);
				if (ExtraDatas) {
					for (var i = 0; i < ExtraDatas.length; i++) {
						var thisKey = Object.keys(ExtraDatas[i])[0];
						formData.append(thisKey, ExtraDatas[i][thisKey]);
						if (thisKey.toLowerCase() == 'portalid') PortalId = ExtraDatas[i][thisKey];
					}
				}
			}, success: function (file, response) {
				console.log(response);
				if (response == "0") {
					$scope.MessageAlert('Upload was not successful, try again', 'warning');
					successfactor.done = false;
				}
				else {
					filenameOnServer.filename = response;
					successfactor.done = true;
					d2 = new Date();
					if (!UsePortalId) {
						$(targetelement).attr("src", $scope.PictureRoot + folderRightPart + filenameOnServer.filename + "?i=" + d2.getTime());
					}
					else {
						$(targetelement).attr("src", $scope.PictureRoot + folderRightPart + PortalId+ "/" +filenameOnServer.filename + "?i=" + d2.getTime());
					}
					$scope.$broadcast('UploadComplete');
					setTimeout(function () {
						$(targetelement).removeClass('manualspinner');

					}, 3000);
				}
			}
		});

		return mydropzone;
	}

	$scope.CollapseSection = function (SectionId) {
		$(SectionId).next('.panel-body').slideUp();
		$(SectionId).addClass('up');
	}

	$scope.getUrlParameter = function (sParam) {
		// var sPageURL = window.location.hash.substring(1);
		var sPageURL2 = "";
		if ($.browser.mozilla) {
			sPageURL2 = window.location.href.split('?');
		}
		else {
			sPageURL2 = window.location.hash.split('?');
		}

		var sPageURL = sPageURL2[1];
		var sURLVariables = sPageURL.split('&');
		for (var i = 0; i < sURLVariables.length; i++) {
			var sParameterName = sURLVariables[i].split('=');
			if (sParameterName[0] == sParam) {
				return SanitizeAll(sParameterName[1]);
			}
		}
	}
  
	$scope.encode = function(obj) {
		var unencoded = obj;
		return encodeURIComponent(unencoded).replace(/'/g,"%27").replace(/"/g,"%22");	
	}

	$scope.decode = function(obj) {
		var encoded = obj;
		return decodeURIComponent(encoded.replace(/\+/g,  " "));
	}
	
	$scope.gettime = function (raw) {
		var d1_hour = raw.toString().substring(0, 2);
		var d1_minute = raw.toString().substring(3, 5);
		var d1_meridian = raw.toString().substring(6, 8);
		if (d1_meridian.toLowerCase() == 'pm') {
			d1_hour = parseInt(d1_hour, 10) + 12;
		}
		return d1_hour.toString() + ":" + d1_minute;
	}

	$scope.computedate = function (datepart, timepart) {
		var d2 = new Date();
		d2 = Date.parseExact(datepart, 'd/M/yyyy');
		var d2_hour = timepart.toString().substring(0, 2);
		var d2_minute = timepart.toString().substring(3, 5);
		var d2_meridian = timepart.toString().substring(6, 8);
		if (d2_meridian.toLowerCase() == 'pm') {
			d2_hour = parseInt(d2_hour, 10) + 12;
		}
		d2.setHours(d2_hour, d2_minute);
		return d2;
	}

	$scope.CurrentDate = function () {
		var today = new Date(); var dd = today.getDate();
		var mm = today.getMonth() + 1; //January is 0!
		var yyyy = today.getFullYear();

		if (dd < 10) {
			dd = '0' + dd
		}

		if (mm < 10) {
			mm = '0' + mm
		}

		today = mm + '/' + dd + '/' + yyyy;
		return Date.parseExact(today, "d/M/yyyy");

	}
	
	$scope.AddReadableDate = function (target, member, format) {
		if (!format) {
			format = "d/M/yyyy";
		}
		for (var i = 0; i < target.length; i++) {
			if (target[i][member]) {
				target[i][member + "Readable"] = new Date(parseInt(target[i][member].substr(6))).toString(format);
			}
			else {
				target[i][member + "Readable"] = "";
			}
		}
	}

	$scope.AddSelector = function (target) {
		for (var i = 0; i < target.length; i++) {
			target[i]["Selector"] = '<input class="selector" type="checkbox" ref="'+ target[i].Id +'" />';
		}
	}

	

	$scope.RegularizeDate = function (datestr) {
		try {
			return new Date(parseInt(datestr.substr(6)));
		} catch (e) {
			return "";
		}
	}

	$scope.StripObjectOfNulls = function (v) {
			if (typeof v == "object") {
				for (var kp in v) {
					if (Object.hasOwnProperty.call(v, kp)) {
						if (v[kp] === null) {
							v[kp] = "";
						}
					}
				}
			} else {
				//console.log(k + ":" + v);
			}
		
	}
	/// ---------------------------------------------------
	$scope.getCompanyInfo = function (companyid) {

		$.support.cors = true;
		var searchUrl = $scope.serviceURL + "/CompanyByIdGet";
		var ds = {CompanyId: companyid};
		$.ajax({
			url: searchUrl, type: "POST",
			dataType: "json",
			crossDomain: true,
			ifModified: true,
			cache: true,
			data: JSON.stringify(ds),
			contentType: "application/json; charset=utf-8",
			beforeSend: function () {
				return true;
			}
		}).done(function (results) {
			$scope.CurrentCompany = results.d;
			SanitizeAll($scope.CurrentCompany);
		}
		).fail(function (jpXHR, textStatus, thrownError) {
			console.log("--------------------");
			console.log(textStatus);
			console.log(jpXHR);
			console.log(thrownError);
			console.log("--------------------");
			
		}
		);
	}
	
	$scope.Companies = {};
	$scope.getCompanies = function () {
	  
	$.support.cors = true;
	var searchUrl = $scope.serviceURL + "/CompanyList"
	   $.ajax({
		   url : searchUrl, type: "POST",
		   dataType : "json",
		   crossDomain:true,
		   ifModified: true,
		   cache:true, 
		   data: "{}",
		   contentType: "application/json; charset=utf-8",
		   beforeSend: function () {
			   return true;
		   }
	   }).done(function(results){
				console.log(results);
				$scope.Companies={};
				$scope.Companies = results.d;
				SanitizeAll($scope.Companies);
				for (var i = 0; i < $scope.Companies.length; i++) {
					var CurrentID = $scope.Companies[i].Id;
					$scope.Companies[i].Edit = "<img src='images/edit.png' ref='" + CurrentID + "' class='ParentControls Edit'/>";
					$scope.Companies[i].Delete = "<img src='images/close.png' ref='" + CurrentID + "' class='ParentControls Delete'/>";
					$scope.Companies[i].Controls = $scope.Companies[i].Delete + $scope.Companies[i].Edit;

					$scope.Companies[i].LogoImage = '<img class="table-inner-image" src="' + $scope.PictureRoot + $scope.Companies[i].CompanyLogoUrl + '" />';
					$scope.Companies[i].SignImage = '<img class="table-inner-image" src="' + $scope.PictureRoot + $scope.Companies[i].AuthorizedSignUrl + '" />';
				}
				$scope.$broadcast('CompaniesListed');
		   }
	   ).fail(function(jpXHR, textStatus, thrownError){
			   console.log("--------------------");
			   console.log(textStatus);
			   console.log(jpXHR);
			   console.log(thrownError);
			   console.log("--------------------");
		   }
	   );
	}	

	$scope.allusers = {};
	$scope.getallusers = function (PortalId) {

		var ds;
		if (PortalId) {
			ds = { PortalId: PortalId };
		}
		else {
			ds = { PortalId: $scope.user.PortalId };
		}
		$.support.cors = true;
		AjaxOptions.data = JSON.stringify(ds);
		AjaxOptions.url = $scope.serviceURL + "/UsersByPortalIdList";
		$.ajax(AjaxOptions).done(function (results) {
			console.log(results);
			$scope.allusers = results.d;
			SanitizeAll($scope.allusers);
			$scope.AddEditDeleteControls($scope.allusers);
			for (var i = 0; i < $scope.allusers.length; i++) {
				if ($scope.allusers[i].PhotoUrl == "") {
					$scope.allusers[i].PassportImage = '<img class="table-inner-image" src="images/user-avatar.png" />';
				} else {
					$scope.allusers[i].PassportImage = '<img class="table-inner-image" src="' + $scope.PictureRoot + $scope.allusers[i].PhotoUrl + '" />';
				}
			}
			$scope.$broadcast('UsersListed');
		}
		).fail(AjaxFail);

	}
	

	$scope.allitems = {};
	$scope.getallitems = function (PortalId) {

		var ds;
		if (PortalId) {
			ds = { PortalId: PortalId };
		}
		else {
			ds = { PortalId: $scope.user.PortalId };
		}
		$.support.cors = true;
		AjaxOptions.data = JSON.stringify(ds);
		AjaxOptions.url = $scope.serviceURL + "/ItemsByPortalIdList";
		$.ajax(AjaxOptions).done(function (results) {
			console.log(results);
			$scope.allitems = results.d;
			SanitizeAll($scope.allitems);
			$scope.AddEditDeleteControls($scope.allitems);
			$scope.$broadcast('ItemsListed');
		}
		).fail(AjaxFail);
	}

	$scope.CategoryItems = {};
	$scope.getitemsbycategory = function (catid, PortalId) {
		var ds;
		if (PortalId) {
			ds = { PortalId: PortalId, CategoryId: catid };
		}
		else {
			ds = { PortalId: $scope.user.PortalId, CategoryId: catid };
		}
		$.support.cors = true;
		AjaxOptions.data = JSON.stringify(ds);
		AjaxOptions.url = $scope.serviceURL + "/ItemsByCatIdGet";
		$.ajax(AjaxOptions).done(function (results) {
			console.log(results);
			SanitizeAll($scope.selectedcategory.items);
			$scope.selectedcategory.items = results.d;
			$scope.CategoryItems = results.d;
			SanitizeAll($scope.CategoryItems);
			$scope.selectedcategory.Id = catid;
			
			$scope.AddEditDeleteControls($scope.CategoryItems);
			$scope.$broadcast('CategoryItemsListed');
		}
		).fail(AjaxFail);
	}

	$scope.ExplainCategoryType = function (TypeId) {
		if (TypeId == 0) {
			return 'Identification Material';
		}
		else if (TypeId == 1) {
			return 'Standard Items';
		}
		else if (TypeId == 2) {
			return 'Consumables';
		}
	}

	$scope.categories = {};
	$scope.getcategories = function (PortalId) {
		var ds;
		if (PortalId) {
			ds = { PortalId: PortalId };
		}
		else {
			ds = { PortalId: $scope.user.PortalId };
		}
		$.support.cors = true;
		AjaxOptions.data = JSON.stringify(ds);
		AjaxOptions.url = $scope.serviceURL + "/ItemsCategoryByPortalId";
		$.ajax(AjaxOptions).done(function (results) {
			console.log(results);
			$scope.categories = results.d;
			SanitizeAll($scope.categories);
			$scope.AddEditDeleteControls($scope.categories);
			for (var i = 0; i < $scope.categories.length; i++) {
				
				$scope.categories[i].TypeMeaning = $scope.ExplainCategoryType($scope.categories[i].CategoryType);
			}
			$scope.$broadcast('CategoriesListed');
		}
		).fail(AjaxFail);


	}	

	$scope.Positions = {};
	$scope.getpositions = function (PortalId) {

		var ds;
		if (PortalId) {
			ds = { PortalId: PortalId };
		}
		else {
			ds = { PortalId: $scope.user.PortalId };
		}
		$.support.cors = true;
		AjaxOptions.data = JSON.stringify(ds);
		AjaxOptions.url = $scope.serviceURL + "/PositionByPortalIdList";
		$.ajax(AjaxOptions).done(function (results) {
			console.log(results);
			$scope.Positions = results.d;
			SanitizeAll($scope.Positions);
			$scope.AddEditDeleteControls($scope.Positions);
			for (var i = 0; i < $scope.Positions.length; i++) {
				$scope.Positions[i].MemberList = "<img src='images/userlist.png' class='ParentControls List'/>";;
			}
			$scope.$broadcast('PositionsListed');
		}
		).fail(AjaxFail);
	}
	// ---------------------------- RFIDTagsByItemIdIdList
	$scope.TagsListed = {};
	$scope.getItemsbyItemid = function (itemid) {

		$.support.cors = true;
		var ds = { ItemId: itemid};
		var searchUrl = $scope.serviceURL + "/RFIDTagsByItemIdIdGet"
		$.ajax({ url: searchUrl, type: "POST", dataType: "json", crossDomain: true, ifModified: true, cache: true,
			data: JSON.stringify(ds), contentType: "application/json; charset=utf-8", beforeSend: function () {return true; }
		}).done(function (results) {
			console.log(results);
			$scope.TagsListed = results.d;
			SanitizeAll($scope.TagsListed);
			$scope.$apply();
			$scope.updateChosenList();
		}
		).fail(function (jpXHR, textStatus, thrownError) { console.log("--------------------"); console.log(textStatus);console.log(jpXHR);
			console.log(thrownError); console.log("--------------------"); } );
	}
 
	$scope.getAvailableIDCard = function () {
		returnobj2 = {};
		if ($scope.categories.length <= 0) {
			$scope.IdAvailable = false;
			window.location.href = "#printid";
		}
		for (var i = 0; i < $scope.categories.length; i++) {
			if ($scope.categories[i].IsIDCard == true) {
				$.support.cors = true;
				var searchUrl = $scope.serviceURL + "/RFIDTagsByCategoryIdStatusList";
				var ds = { CategoryId: $scope.categories[i].Id, isAssigned: false };
				$.ajax({
					url: searchUrl, type: "POST",
					dataType: "json",
					crossDomain: true,
					ifModified: true,
					cache: true,
					data: JSON.stringify(ds),
					contentType: "application/json; charset=utf-8",
					beforeSend: function () {
						return true;
					}
				}).done(function (results) {
					console.log(results);
					$scope.AvailableIDCards = results.d;
					if ($scope.AvailableIDCards.length <= 0) {
						//no available 
						$scope.IdAvailable = false;
					}
					else {
						$scope.IdAvailable = true;

					}
					window.location.href = "#printid";
					$scope.$apply();
				}
				).fail(function (jpXHR, textStatus, thrownError) {
					
					console.log("--------------------");
					console.log(textStatus);
					console.log(jpXHR);
					console.log(thrownError);
					console.log("--------------------");
				   // returnobj2 = -1;
				}
				);
			}
		}
	   
	}

	$scope.getStates = function (CountryId) {
		$.support.cors = true;
		AjaxOptions.data = JSON.stringify({CountryCode: CountryId});
		AjaxOptions.url = $scope.serviceURL + "/StatesGetByCountryCode";
		$.ajax(AjaxOptions).done(function (results) {
			console.log(results);
			$scope.states = results.d;
			$scope.$broadcast('StatesListed');
		}
		).fail(AjaxFail);
	}	

	$scope.getItembyId = function (itemid) {
		
		$.support.cors = true; var ds = {Id: itemid};
	var searchUrl = $scope.serviceURL + "/RFIDTagsByIdGet";
	   $.ajax({
		   url : searchUrl, type: "POST",
		   dataType : "json",
		   crossDomain:true,
		   ifModified: true,
		   cache:true, 
		   data: JSON.stringify(ds),
		   contentType: "application/json; charset=utf-8",
		   beforeSend: function () {
			   return true;
		   }
	   }).done(function(results){
				console.log(results);
				return results.d;
		
		   }
	   ).fail(function(jpXHR, textStatus, thrownError){
				console.log("--------------------");
			   console.log(textStatus);
			   console.log(jpXHR);
			   console.log(thrownError);
			   console.log("--------------------");
			   return {};
		   }
	   );
	}	
		//---------------------------------------------------
	$scope.AddEditDeleteControls = function (target, determinant) {
		if (!target) return;
		for (var i = 0; i < target.length; i++) {
			var CurrentID = target[i].Id;
			if (target[i][determinant]) {
				target[i].Edit = "";
				target[i].Delete = "";
				target[i].Controls = "<img src='images/locked.png' class='ParentControls' title='No operations permitted on this record'/>";;
			}
			else {
				target[i].Edit = "<img src='images/edit.png' ref='" + CurrentID + "' class='ParentControls Edit' title='Edit'/>";
				target[i].Delete = "<span ref='" + CurrentID + "' class='label label-danger ParentControls Delete' title='Delete/Cancel'>Remove</span>";
				target[i].Controls = target[i].Delete + target[i].Edit;
			}

		}
	}

	$scope.AddCustomControls = function (target, ControlClass, ControlText, determinant, determinantVal) {
		if (!target) return;
		for (var i = 0; i < target.length; i++) {
			var CurrentID = target[i].Id;

			if ((!determinantVal && target[i][determinant]) || (determinantVal && target[i][determinant] == determinantVal)) {
				target[i].Controls = "<img src='images/locked.png' class='ParentControls' title='No operations permitted on this record'/>";;
			}
			else {
				target[i].Controls = "";
				for (var j = 0; j < ControlText.length; j++) {
					target[i].Controls += "<span ref='" + CurrentID + "' class='label ParentControls " + ControlClass[j] + "' title='" + ControlText[j] + "'>" + ControlText[j] + "</span>";;
				}

			}
		}
	}

	//
	//---------------------------------
	$scope.branches = {};
	$scope.getBranches = function (PortalId) {
		var ds;
		if (PortalId) {
			ds = { PortalId: PortalId };
		}
		else {
			ds = { PortalId: $scope.user.PortalId };
		}
		$.support.cors = true;
		AjaxOptions.data = JSON.stringify(ds);
		AjaxOptions.url = $scope.serviceURL + "/CompanyBranchByPortalIdListAll";
		$.ajax(AjaxOptions).done(function (results) {
			console.log(results);
			$scope.branches = results.d;
			$scope.AddEditDeleteControls($scope.branches);
			$scope.$broadcast('BranchesListed');
		}
		).fail(AjaxFail);

	}
	//--------------------------------------------
	$scope.Departments = {}
	$scope.ListDepartments = function (BranchId, CompanyId) {
		if (!CompanyId) {
			CompanyId = $scope.user.PortalId;
		}
		if (!BranchId) {
			AjaxOptions.url = $scope.serviceURL + "/DepartmentByPortalIdList";
			AjaxOptions.data = JSON.stringify({ PortalId: CompanyId });
		}
		else {
			AjaxOptions.url = $scope.serviceURL + "/DepartmentByCompanyBranchIdList";
			AjaxOptions.data = JSON.stringify({ PortalId: CompanyId, CompanyBranchId: BranchId });
		}
		
		$.support.cors = true;
		$.ajax(AjaxOptions).done(function (results) {
			console.log(results);
			$scope.Departments = results.d;
			$scope.AddEditDeleteControls($scope.Departments);
			$scope.$broadcast('DepartmentsListed');
		}
		).fail(AjaxFail);
	}
	$scope.updateChosenList = function()
	{
		$('.chosen-select').trigger('chosen:updated');
		$scope.$apply();
	}

	$(document).ready(function (e) {
		if ($scope.user) { //piping mode represents direct entry from email or other methods
			$("#profilepic, .profilepics").attr("src", $scope.PictureRoot + $scope.user.PhotoUrl);
			$('span.usernamelabel').text($scope.user.SurName + ' ' + $scope.user.OtherNames);
			$scope.ListUserAccessMenus();
		}
	});

	if (!$scope.PipingMode) {
		//$scope.getStates();
		$scope.getBranches();
		//$scope.getcategories();
		$scope.getCompanyInfo($scope.user.PortalId);
	}

	$scope.UserAccessMenusListed = false;
	UserAccessMenusListed = false;
	$scope.$on('UserAccessMenusListed', function (event) {
		$scope.UserAccessMenusListed = true;
		UserAccessMenusListed = true;
	});

	$scope.ParentMenusSorted = {};
	$scope.ParentMenusToDisplay = [];
	$scope.ParentMenusDisplayed = false;
	$scope.$on('ParentMenusListed', function (event) {
		$scope.ParentMenusSorted = $scope.ParentMenus;
		$scope.ParentMenusSorted.sort(function (a, b) {
			if (a.ListOrder < b.ListOrder) return -1;
			if (a.ListOrder > b.ListOrder) return 1;
			return 0;
		})

		if (!$scope.ParentMenusDisplayed) {
			var SetMenuWait = setInterval(function () {
				if ($scope.UserAccessMenusListed) {
					for (var i = 0; i < $scope.ParentMenusSorted.length; i++) {
						if (isInArray($scope.ParentMenusSorted[i].Id, $scope.ParentMenusIHaveAccessTo)) {
							$scope.ParentMenusToDisplay.push($scope.ParentMenusSorted[i]);
						}
					}
					$scope.ParentMenusDisplayed = true;
					ApplyViewChanges($scope);
					clearInterval(SetMenuWait);
				}
			}, 500);
		}
	});

	$scope.ParentMenus = {};
	$scope.ListParentMenus = function () {
	   
			$.support.cors = true;
			AjaxOptions.url = $scope.serviceURL + "/PagesParentByPortalIdList";
			$.ajax(AjaxOptions).done(function (results) {
				console.log(results);
				$scope.ParentMenus = results.d;
				for (var i = 0; i < $scope.ParentMenus.length; i++) {
					var CurrentID = $scope.ParentMenus[i].Id;
					if (!$scope.ParentMenusDisplayed) {
						$scope.ParentMenus[i].ViewId = encodeURIComponent($scope.Encrypt($scope.ParentMenus[i].Id));
					}
					else {
						var samepid = $.grep($scope.ParentMenusToDisplay, function (e) { return e.Id == $scope.ParentMenus[i].Id });
						if (samepid.length > 0) {
							$scope.ParentMenus[i].ViewId = samepid[0].ViewId;
						}
						else {
							$scope.ParentMenus[i].ViewId = encodeURIComponent($scope.Encrypt($scope.ParentMenus[i].Id));
						}
					}
					$scope.ParentMenus[i].Edit = "<img src='images/edit.png' ref='" + CurrentID + "' class='ParentControls EditParent'/>";
					$scope.ParentMenus[i].MoveUp = "<img src='images/up.png' ref='" + CurrentID + "' class='ParentControls ReOrderUp'/>";
					$scope.ParentMenus[i].MoveDown = "<img src='images/down.png' ref='" + CurrentID + "' class='ParentControls ReOrderDown'/>";
					$scope.ParentMenus[i].Controls = $scope.ParentMenus[i].MoveDown + $scope.ParentMenus[i].MoveUp + $scope.ParentMenus[i].Edit;
				}
				$scope.$broadcast('ParentMenusListed');
			}
			).fail(AjaxFail);
		}

	$scope.ChildMenus = {};
	$scope.ListChildMenus = function () {
		$.support.cors = true;
		AjaxOptions.data = JSON.stringify({PortalId: 0});
		AjaxOptions.url = $scope.serviceURL + "/PagesAssetByPortalIdList";
		$.ajax(AjaxOptions).done(function (results) {
			console.log(results);
			$scope.ChildMenus = results.d;
			//for (var i = 0; i < $scope.ParentMenus.length; i++) {
			//    var CurrentID = $scope.ParentMenus[i].Id;
			//    $scope.ParentMenus[i].MoveUp = "<img src='images/up.png' ref='" + CurrentID + "' class='ReOrderUp'/>";
			//    $scope.ParentMenus[i].MoveDown = "<img src='images/down.png' ref='" + CurrentID + "' class='ReOrderDown'/>";
			//}
			$scope.$broadcast('ChildMenusListed');
		}
		).fail(AjaxFail);
	}

	$scope.ParentChildMenus = {}
	$scope.ListParentChildMenus = function (ParentId) {
		$.support.cors = true;
		AjaxOptions.data = JSON.stringify({ PageParentId: ParentId });
		AjaxOptions.url = $scope.serviceURL + "/PagesAssetByParentIdList";
		$.ajax(AjaxOptions).done(function (results) {
			console.log(results);
			$scope.ParentChildMenus = results.d;
			for (var i = 0; i < $scope.ParentChildMenus.length; i++) {
				var CurrentID = $scope.ParentChildMenus[i].Id;
				$scope.ParentChildMenus[i].Edit = "<img src='images/edit.png' ref='" + CurrentID + "' class='EditChild'/>";
				$scope.ParentChildMenus[i].Delete = "<img src='images/close.png' ref='" + CurrentID + "' class='DeleteChild'/>";
				$scope.ParentChildMenus[i].MoveUp = "<img src='images/up.png' ref='" + CurrentID + "' class='ReOrderUpChild'/>";
				$scope.ParentChildMenus[i].MoveDown = "<img src='images/down.png' ref='" + CurrentID + "' class='ReOrderDownChild'/>";
				$scope.ParentChildMenus[i].Controls = $scope.ParentChildMenus[i].MoveDown + $scope.ParentChildMenus[i].MoveUp + $scope.ParentChildMenus[i].Delete + $scope.ParentChildMenus[i].Edit;
			}
			$scope.$broadcast('ParentChildMenusListed');
		}
		).fail(AjaxFail);
	}
	$scope.ListParentMenus();

	$scope.UserAccessMenus = {}
	$scope.ParentMenusIHaveAccessTo = [];
	$scope.PageURLsIHaveAccessTo = [];
	PageURLsIHaveAccessTo = []; //global variable so that tweaks.js can access it
	$scope.PageIdsIHaveAccessTo = [];
	$scope.ListUserAccessMenus = function (UserId, IsAdmin) {
		var uid;
		if (!UserId) {
			uid = $scope.user.Id;
			IsAdmin = $scope.user.IsPortalAdmin;
		}
		else {
			uid = UserId;
		}
		$.support.cors = true;

		if (!IsAdmin) {
			AjaxOptions.url = $scope.serviceURL + "/PagesRolesMappingByUserIdList";
			AjaxOptions.data = JSON.stringify({ UserId: uid });
		}
		else {
			AjaxOptions.data = JSON.stringify({ PortalId: 0 });
			AjaxOptions.url = $scope.serviceURL + "/PagesAssetByPortalIdList";
		}
		$.ajax(AjaxOptions).done(function (results) {
			console.log(results);
			$scope.UserAccessMenus = results.d;
			$scope.ParentMenusIHaveAccessTo = [];
			for (var i = 0; i < $scope.UserAccessMenus.length; i++) {
				if (!isInArray($scope.UserAccessMenus[i].ParentId, $scope.ParentMenusIHaveAccessTo)) {
					$scope.ParentMenusIHaveAccessTo.push($scope.UserAccessMenus[i].ParentId);
				}
				$scope.PageURLsIHaveAccessTo.push($scope.UserAccessMenus[i].PageURL);
				PageURLsIHaveAccessTo.push($scope.UserAccessMenus[i].PageURL);
				$scope.PageIdsIHaveAccessTo.push($scope.UserAccessMenus[i].Id);
            }
            localStorage.setItem('PageURLsIHaveAccessTo', JSON.stringify(PageURLsIHaveAccessTo));
            localStorage.setItem('ParentMenusIHaveAccessTo', JSON.stringify($scope.ParentMenusIHaveAccessTo))
			$scope.$broadcast('UserAccessMenusListed');
		}
		).fail(AjaxFail);
	}

	$scope.Countries = {};
	$scope.ListCountries = function () {
		$.support.cors = true;
		AjaxOptions.data = JSON.stringify({});
		AjaxOptions.url = $scope.serviceURL + "/NationalityList";
		$.ajax(AjaxOptions).done(function (results) {
			console.log(results);
			$scope.Countries = results.d;
			$scope.$broadcast('CountriesListed');
		}
		).fail(AjaxFail);
	}

	$scope.Roles = {};
	$scope.ListRoles = function (PortalId) {
		var ds;
		if (PortalId) {
			ds = { PortalId: PortalId };
		}
		else {
			ds = { PortalId: $scope.user.PortalId };
		}
		$.support.cors = true;
		AjaxOptions.data = JSON.stringify(ds);
		AjaxOptions.url = $scope.serviceURL + "/RolesAsssetByPortalIdList";
		$.ajax(AjaxOptions).done(function (results) {
			console.log(results);
			$scope.Roles = results.d;
			$scope.AddEditDeleteControls($scope.Roles);
			for (var i = 0; i < $scope.Roles.length; i++) {
				if ($scope.Roles[i].IsFixed) {
					$scope.Roles[i].Controls = "<img src='images/locked.png' class='ParentControls'/>";;
				}
				$scope.Roles[i].MemberList = "<img src='images/userlist.png' ref='" + $scope.Roles[i].Id + "' class='ParentControls List'/>";;
			}
			$scope.$broadcast('RolesListed');
		}
		).fail(AjaxFail);


	}
	
	$scope.RoleMappings = {};
	$scope.ListRoleMappings = function (RoleId) {
		$.support.cors = true;
		AjaxOptions.data = JSON.stringify({RolesAssetId: RoleId});
		AjaxOptions.url = $scope.serviceURL + "/PagesRolesMappingByRolesAssestIdList";
		$.ajax(AjaxOptions).done(function (results) {
			
			$scope.RoleMappings = results.d;
			for (var i = 0; i < $scope.RoleMappings.length; i++) {
				var MenuDetail = $.grep($scope.ChildMenus, function (e) { return e.Id == $scope.RoleMappings[i].PagesAssetId; })[0];
				$scope.RoleMappings[i].ChildDetails = MenuDetail;

			}
			console.log($scope.RoleMappings);
			$scope.$broadcast('RoleMappingsListed');
		}
		).fail(AjaxFail);
	}

	$scope.UserRoles = {};
	$scope.ListUserRoles = function (UserId) {
		var ds;
		if (UserId) {
			ds = { UserId: UserId };
		}
		else {
			ds = { UserId: $scope.user.Id };
		}
		$.support.cors = true;
		AjaxOptions.data = JSON.stringify(ds);
		AjaxOptions.url = $scope.serviceURL + "/RolesAssetUsersByUserIdList";
		$.ajax(AjaxOptions).done(function (results) {
			$scope.UserRoles = results.d;
			console.log($scope.UserRoles);
			$scope.$broadcast('UserRolesListed');
		}
		).fail(AjaxFail);
	}

	$scope.RoleMembers = {};
	$scope.ListRoleMembers = function (RoleId) {
		$.support.cors = true;
		AjaxOptions.data = JSON.stringify({RolesAssetId: RoleId});
		AjaxOptions.url = $scope.serviceURL + "/RolesAssetAllMembersList";
		$.ajax(AjaxOptions).done(function (results) {
			$scope.RoleMembers = results.d;
			//target, ControlClass, ControlText, determinant, determinantVal
			$scope.AddCustomControls($scope.RoleMembers, ["label-danger"], ['Remove'], 'RoleName', 'STAFF');
			console.log($scope.RoleMembers);
			$scope.$broadcast('RoleMembersListed');
		}
		).fail(AjaxFail);
	}

	$scope.AttendanceAll = {};
	$scope.ListAttendanceAll = function (params) {
		$.support.cors = true;
		AjaxOptions.data = JSON.stringify(params);
		AjaxOptions.url = $scope.serviceURL + "/AttendanceByPortalIdList";
		$.ajax(AjaxOptions).done(function (results) {
			$scope.AttendanceAll = results.d;
			console.log($scope.AttendanceAll);
			$scope.$broadcast('AttendanceAllListed');
		}
		).fail(AjaxFail);
	}

	$scope.AttendanceSingle = {};
	$scope.ListAttendanceSingle = function (params) {
		$.support.cors = true;
		AjaxOptions.data = JSON.stringify(params);
		AjaxOptions.url = $scope.serviceURL + "/AttendanceByStaffDateList";
		$.ajax(AjaxOptions).done(function (results) {
			$scope.AttendanceSingle = results.d;
			console.log($scope.AttendanceSingle);
			$scope.$broadcast('AttendanceSingleListed');
		}
		).fail(AjaxFail);
	}

	$scope.RequisitionNA = {};
	$scope.ListRequisitionNA = function (CreatedBy, PortalId) {
		var ds;
		if (PortalId) {
			ds = { PortalId: PortalId, CreatedBy: CreatedBy };
		}
		else {
			ds = { PortalId: $scope.user.PortalId, CreatedBy: CreatedBy};
		}
		$.support.cors = true;
		AjaxOptions.data = JSON.stringify(ds);
		AjaxOptions.url = $scope.serviceURL + "/RequisitionsNotAvailableByCreatedByList";
		$.ajax(AjaxOptions).done(function (results) {
			console.log(results);
			$scope.RequisitionNA = results.d;
			$scope.AddEditDeleteControls($scope.RequisitionNA, 'IsIncluded');
			$scope.$broadcast('RequisitionNAListed');
		}
		).fail(AjaxFail);
	}

	$scope.PortalRequisitionNAs = {};
	$scope.ListPortalRequisitionNAs = function (PortalId) {
		var ds;
		if (PortalId) {
			ds = { PortalId: PortalId };
		}
		else {
			ds = { PortalId: $scope.user.PortalId};
		}
		$.support.cors = true;
		AjaxOptions.data = JSON.stringify(ds);
		AjaxOptions.url = $scope.serviceURL + "/RequisitionsNotAvailableByPortalIdList";
		$.ajax(AjaxOptions).done(function (results) {
			console.log(results);
			$scope.PortalRequisitionNAs = results.d;
			$scope.AddCustomControls($scope.PortalRequisitionNAs, ['Approve'], ['approve'], ['Approve request'], 'IsIncluded');
			$scope.AddReadableDate($scope.PortalRequisitionNAs, 'DateCreated');
			$scope.$broadcast('PortalRequisitionNAListed');
		}
		).fail(AjaxFail);
	}

	$scope.$on('TemplateIdGotten', function (event) {
	   // ApplyViewChanges($scope);
	});

	$scope.TemplateId = 0;
	$scope.TemplateRow = {};
	$scope.GetTemplateId = function (PortalId) {
		var ds;
		if (PortalId) {
			ds = { PortalId: PortalId, UtilityName: 'TemplateId' };
		}
		else {
			ds = { PortalId: $scope.user.PortalId, UtilityName: 'TemplateId' };
		}
		$.support.cors = true;
		AjaxOptions.data = JSON.stringify(ds);
		AjaxOptions.url = $scope.serviceURL + "/UtilityByNameGet";
		$.ajax(AjaxOptions).done(function (results) {
			console.log(results);
			$scope.TemplateRow = results.d;
			$scope.TemplateId = results.d.UtilityValue;
			$scope.$broadcast('TemplateIdGotten');
		}
		).fail(AjaxFail);
	}
	if ($scope.user) { //because of piting piping mode represents direct entry from email or other methods
		$scope.GetTemplateId();
	}

	$scope.Workflows = {};
	$scope.ListWorkflows = function (PortalId) {
		var ds;
		if (PortalId) {
			ds = { PortalId: PortalId};
		}
		else {
			ds = { PortalId: $scope.user.PortalId};
		}
		$.support.cors = true;
		AjaxOptions.data = JSON.stringify(ds);
		AjaxOptions.url = $scope.serviceURL + "/RolesWorkFlowByPortalIdList";
		$.ajax(AjaxOptions).done(function (results) {
			console.log(results); //:
			$scope.Workflows = $.grep(results.d, function (e) { return e.TemplateId == $scope.TemplateId; });
			//$scope.AddEditDeleteControls($scope.Workflows);
			for (var i = 0; i < $scope.Workflows.length; i++) {
				if ($scope.Workflows[i].CanBeSkipped) {
					$scope.Workflows[i].OptionalBadge = '<span class="label label-default">optional</span>';
				}
				else {
					$scope.Workflows[i].OptionalBadge = '<span class="label label-danger">mandatory</span>';
				}
				if ($scope.Workflows[i].OrderId == 1) {
					$scope.Workflows[i].Function = '<span class="label label-default">initiator</span>';
				}
				else {
					if ($scope.Workflows[i].IsFinalApproval) {
						$scope.Workflows[i].Function = '<span class="label label-danger">approval</span>';
					}
					else {
						$scope.Workflows[i].Function = '<span class="label label-warning">concurrence</span>';
					}
				}
				if ($scope.TemplateId != 0) {
					var CurrentID = $scope.Workflows[i].Id;
					if ($scope.Workflows[i].OrderId == 1) {
						$scope.Workflows[i].Controls = "<img src='images/locked.png' class='ParentControls' title='This item is fixed'/>";
						continue;
					}
					$scope.Workflows[i].Delete = "<img src='images/close.png' ref='" + CurrentID + "' class='ParentControls Delete' title='Delete/Cancel'/>";
					$scope.Workflows[i].MoveUp = "<img src='images/up.png' ref='" + CurrentID + "' class='ParentControls ReOrderUp'/>";
					$scope.Workflows[i].MoveDown = "<img src='images/down.png' ref='" + CurrentID + "' class='ParentControls ReOrderDown'/>";
					$scope.Workflows[i].Controls = $scope.Workflows[i].Delete+ $scope.Workflows[i].MoveUp + $scope.Workflows[i].MoveDown;
				}
				else {
					$scope.Workflows[i].Controls = "<img src='images/locked.png'  class='ParentControls' title='Data not editable with currently selected workflow type' />";
				}
			}
			
			$scope.$broadcast('WorkflowsListed');
		}
		).fail(AjaxFail);
	}

	$scope.Requisition = {};
	$scope.ListRequisition = function (UserId) {
		var ds;
		if (!UserId) {
			ds = { CreatedBy: $scope.user.Id };
		}
		else {
			ds = { CreatedBy: UserId };
		}
		$.support.cors = true;
		AjaxOptions.data = JSON.stringify(ds);
		AjaxOptions.url = $scope.serviceURL + "/StaffRequisitionsByCreatedByList";
		$.ajax(AjaxOptions).done(function (results) {
			console.log(results);
			$scope.Requisition = results.d;
			$scope.AddEditDeleteControls($scope.Requisition);
			$scope.AddReadableDate($scope.Requisition, "DeliveryDate", "d/M/yyyy");
			$scope.$broadcast('RequisitionListed');
		}
		).fail(AjaxFail);
	}

	$scope.AssistedRequisition = {};
	$scope.ListAssistedRequisition = function (UserId) {
		var ds;
		if (!UserId) {
			ds = { ForSaffId: $scope.user.Id };
		}
		else {
			ds = { ForSaffId: UserId };
		}
		$.support.cors = true;
		AjaxOptions.data = JSON.stringify(ds);
		AjaxOptions.url = $scope.serviceURL + "/StaffRequisitionsByForStaffIdList";
		$.ajax(AjaxOptions).done(function (results) {
			console.log(results);
			$scope.AssistedRequisition = results.d;
			$scope.AddEditDeleteControls($scope.AssistedRequisition);
			$scope.AddReadableDate($scope.AssistedRequisition, "DeliveryDate", "d/M/yyyy");
			$scope.$broadcast('AssistedRequisitionListed');
		}
		).fail(AjaxFail);

	}

	$scope.Stock = {};
	$scope.StockIssued = {};
	$scope.StockInStore = {};
	$scope.ListStock = function (PortalId) {
		var ds;
		if (!PortalId) {
			ds = { PortalId: $scope.user.PortalId };
		}
		else {
			ds = { PortalId: PortalId };
		}
		$.support.cors = true;
		AjaxOptions.data = JSON.stringify(ds);
		AjaxOptions.url = $scope.serviceURL + "/RFIDTagsByPortalIdStatusList";
		$.ajax(AjaxOptions).done(function (results) {
			console.log(results);
			$scope.Stock = results.d;
			$scope.AddReadableDate($scope.Stock, "ItemPurchaseDate", "d/M/yyyy");
			$scope.AddEditDeleteControls($scope.Stock);
			$scope.AddSelector($scope.Stock);
			$scope.StockIssued = $.grep($scope.Stock, function (e) { return e.IsAssigned == true; });
			$scope.StockInStore = $.grep($scope.Stock, function (e) { return e.IsAssigned == false; });
			
			$scope.$broadcast('StockListed');
		}
		).fail(AjaxFail);
	}

	$scope.Approvals = {};
	$scope.ListApprovals = function (UserId, forupdate) {
		var ds;
		if (!UserId) {
			ds = { LoggedInUserId: $scope.user.Id };
		}
		else {
			ds = { LoggedInUserId: UserId };
		}
		$.support.cors = true;
		AjaxOptions.data = JSON.stringify(ds);
		AjaxOptions.url = $scope.serviceURL + "/StaffRequisitionsPendingList";
		if (forupdate) {
			AjaxOptions.beforeSend=  function () {
				return true;
			}
		}
		$.ajax(AjaxOptions).done(function (results) {
			if (forupdate) {
				if (results.d == null) return;
				$scope.$broadcast('ApprovalsUpdateListed', results.d.length);
				AjaxOptions.beforeSend = function () {
					ShowBusyMode();
					return true;
				}
				return;
			}
			$scope.Approvals = results.d;
			$scope.AddReadableDate($scope.Approvals, "DeliveryDate", "d/M/yyyy");
			$scope.AddReadableDate($scope.Approvals, "DateCreated", "d/M/yyyy");
			//target, ControlClass, ControlText, determinant, determinantVal
			//$scope.AddCustomControls($scope.Approvals, ['label-danger'], ['Process'],  undefined);
			//$scope.StockIssued = $.grep($scope.Stock, function (e) { return e.IsAssigned == true; });
			//$scope.StockInStore = $.grep($scope.Stock, function (e) { return e.IsAssigned == false; });
			$scope.$broadcast('ApprovalsListed');
		}
		).fail(AjaxFail);
	}

	$scope.ApprovalsHistory = {};
	$scope.ListApprovalsHistory = function (UserId) {
		var ds;
		if (!UserId) {
			ds = { LoggedInUserId: $scope.user.Id };
		}
		else {
			ds = { LoggedInUserId: UserId };
		}
		$.support.cors = true;
		AjaxOptions.data = JSON.stringify(ds);
		AjaxOptions.url = $scope.serviceURL + "/StaffRequisitionsHistoryList";
		$.ajax(AjaxOptions).done(function (results) {
			$scope.ApprovalsHistory = results.d;
			$scope.AddReadableDate($scope.ApprovalsHistory, "DeliveryDate", "d/M/yyyy");
			$scope.AddReadableDate($scope.ApprovalsHistory, "DateCreated", "d/M/yyyy");
			$scope.$broadcast('ApprovalsHistoryListed');
		}
		).fail(AjaxFail);
	}


	$scope.WorkflowHistory = {};
	$scope.ListWorkflowHistory = function (RequisitionId, IsApprover, SourceObject) {
		$.support.cors = true;
		AjaxOptions.data = JSON.stringify({RequisitionId: RequisitionId});
		AjaxOptions.url = $scope.serviceURL + "/StaffRequisitionsWorkFlowByRequisitionsIdList";
		$.ajax(AjaxOptions).done(function (results) {
			console.log(results);
			$scope.WorkflowHistory = results.d;
			$scope.AddReadableDate($scope.WorkflowHistory, "DateCreated", "d/M/yyyy");
			for (var i = 0; i < $scope.WorkflowHistory.length; i++) {
				if ($scope.WorkflowHistory[i].FeedBack == 'Rejected') {
					$scope.WorkflowHistory[i].FeedBackLabel = '<span class="label label-danger">' + $scope.WorkflowHistory[i].FeedBack + '</span>';
				}
				else {
					$scope.WorkflowHistory[i].FeedBackLabel = '<span class="label label-default">' + $scope.WorkflowHistory[i].FeedBack + '</span>';
				}

				if ($scope.WorkflowHistory[i].ToRoleName == 'STAFF') {
					if (IsApprover) {
						$scope.WorkflowHistory[i].ToRoleNameLabel = '<span class="label label-default">initiator</span>';
					}
					else {
						$scope.WorkflowHistory[i].ToRoleNameLabel = '<span class="label label-warning">YOU</span>';
					}
				}
				else {
					$scope.WorkflowHistory[i].ToRoleNameLabel = '<span class="label label-default">' + $scope.WorkflowHistory[i].ToRoleName + '</span>';
				}

				if ($.grep(SourceObject, function (e) { return e.Id == RequisitionId })[0].Status.toLowerCase() == 'approved') {
					if (i == ($scope.WorkflowHistory.length - 1)) {
						$scope.WorkflowHistory[i].ToRoleNameLabel = '<span class="label label-success">processor</span>';
						$scope.WorkflowHistory[i].FeedBackLabel = '<span class="label label-success">Approved</span>';
					}
				}

			}
			
			//$scope.AddCustomControls($scope.Approvals, ['Approve', 'Reject', 'Notes'], ['approve', 'reject', 'notes'], ['Approve', 'Reject', 'Approve / Reject with comments'], undefined);
			$scope.$broadcast('WorkflowHistoryListed');
		}
		).fail(AjaxFail);
	}

	$scope.ProcessWorkflowRequest = function (requisitionid, comment, feedback) {
	   var WI = {
			PortalId: $scope.user.PortalId, StaffRequisitionsId: null, Comment: "", feedback: null,
			CreatedBy: $scope.user.Id
		}
		WI.StaffRequisitionsId = requisitionid;
		WI.Comment = comment;
		WI.feedback = feedback;

		$.support.cors = true;
		AjaxOptions.data = JSON.stringify(WI);
		AjaxOptions.url = $scope.serviceURL + "/StaffRequisitionsWorkFlowAdd";
		$.ajax(AjaxOptions).done(function (results) {
			if (results.d > 0) {
				$scope.MessageAlert('Request was transferred for approval', 'success');
				console.log(results);
			}
			else {
				$scope.MessageAlert('An error occurred while sending this request for approval. Please try again later.', 'warning');
				console.log(results);
			}
		}
		).fail(AjaxFail);
	}

	$scope.GiveUserRolesGlobal = function (UserId, RoleIds, CallBack) {
		var RT = {
			Id: 0, PortalId: $scope.user.PortalId, UsersId: null, RolesAssetId: null,
			Email: "", DepartmentId: 0, CreatedBy: $scope.user.Id, DateCreated: new Date("October 13, 2014 11:13:00"), //arbitrary date, not to be used
			SurName: "", OtherNames: ""
		}
		if (!RoleIds) return;
		var ds = [];
		for (var i = 0; i < RoleIds.length; i++) {
			var newObject = jQuery.extend(true, {}, RT);
			newObject.UsersId = UserId;
			newObject.RolesAssetId = RoleIds[i];
			ds.push(newObject);
		}

		$.support.cors = true;
		AjaxOptions.data = JSON.stringify({ arrauInfo: ds });
		AjaxOptions.url = $scope.serviceURL + "/RolesAssetUsersAdd";
		$.ajax(AjaxOptions).done(function (results) {
			console.log(results);
			if (results.d > 0) {
				$scope.MessageAlert('Roles granted successfully.', 'success');
				if (CallBack) CallBack(); 
			}
			else {
				$scope.MessageAlert('Roles were not granted to user.', 'error');
			}
		}
		).fail(AjaxFail);
	}

	$scope.DenyUserRoleGlobal = function (MappingId, CallBack) {
		$.support.cors = true;
		AjaxOptions.data = JSON.stringify({ Id: MappingId });
		AjaxOptions.url = $scope.serviceURL + "/RolesAssetUsersByIdDelete";
		$.ajax(AjaxOptions).done(function (results) {
			console.log(results);
			if (results.d > 0) {
				$scope.MessageAlert('Role denied successfully.', 'warning');
				if (CallBack) CallBack();
			}
			else {
				$scope.MessageAlert('An error occurred. Request was not completed.', 'error');
			}
		}
		).fail(AjaxFail);
	}

	$scope.ItemsToIssue = {};
	$scope.ListItemsToIssue = function (PortalId) {
			var ds;
			if (!PortalId) {
				ds = { PortalId: $scope.user.PortalId };
			}
			else {
				ds = { PortalId: PortalId };
			}
			$.support.cors = true;
			AjaxOptions.data = JSON.stringify(ds);
			AjaxOptions.url = $scope.serviceURL + "/StaffRequisitionsApprovalsPendingIssuanceList";
			$.ajax(AjaxOptions).done(function (results) {
				console.log(results);
				$scope.ItemsToIssue = results.d;
				$scope.AddReadableDate($scope.ItemsToIssue, "DeliveryDate", "d/M/yyyy");
				$scope.AddReadableDate($scope.ItemsToIssue, "DateCreated", "d/M/yyyy");
				$scope.AddCustomControls($scope.ItemsToIssue, ['Notes'], ['notes'], ['Process this request'], undefined);
				//$scope.StockIssued = $.grep($scope.Stock, function (e) { return e.IsAssigned == true; });
				//$scope.StockInStore = $.grep($scope.Stock, function (e) { return e.IsAssigned == false; });
				$scope.$broadcast('ItemsToIssueListed');
			}
			).fail(AjaxFail);
	}

	$scope.ItemTags = {};
	$scope.ListItemTags = function (ItemId) {
		$.support.cors = true;
		AjaxOptions.data = JSON.stringify({ItemId: ItemId});
		AjaxOptions.url = $scope.serviceURL + "/RFIDTagsByItemIdIdList";
		$.ajax(AjaxOptions).done(function (results) {
			console.log(results);
			$scope.ItemTags = results.d;
			$scope.AddSelector($scope.ItemTags);
			$scope.AddReadableDate($scope.ItemTags, "ItemPurchaseDate");
			$scope.$broadcast('ItemTagsListed');
		}
		).fail(AjaxFail);
	}


	$scope.UnassignedItemTags = {};
	$scope.ListUnassignedItemTags = function (ItemId) {
		$.support.cors = true;
		AjaxOptions.data = JSON.stringify({ ItemId: ItemId, isAssigned: false });
		AjaxOptions.url = $scope.serviceURL + "/RFIDTagsByItemIdStatusList";
		$.ajax(AjaxOptions).done(function (results) {
			console.log(results);
			$scope.UnassignedItemTags = results.d;
			$scope.AddSelector($scope.UnassignedItemTags);
			$scope.AddReadableDate($scope.UnassignedItemTags, "ItemPurchaseDate");
			$scope.$broadcast('UnassignedItemTagsListed');
		}
		).fail(AjaxFail);
	}

	$scope.StaffItems = {};
	$scope.ListStaffItems = function (StaffId) {
		$.support.cors = true;
		AjaxOptions.data = JSON.stringify({ StaffId: StaffId});
		AjaxOptions.url = $scope.serviceURL + "/StaffRequisitesByStaffIdList";
		$.ajax(AjaxOptions).done(function (results) {
			console.log(results);
			$scope.StaffItems = results.d;
			$scope.AddReadableDate($scope.StaffItems, "DateIssued");
			$scope.$broadcast('StaffItemsListed');
		}
		).fail(AjaxFail);
	}

	$scope.DepartmentNamesList = {};
	$scope.ListDepartmentNamesList = function (PortalId) {
		//ArrayList DepartmentByPortalIdList(int PortalId)
		if (!PortalId) {
			PortalId = $scope.user.PortalId;
		}
		$.support.cors = true;
		AjaxOptions.data = JSON.stringify({ PortalId: PortalId });
		AjaxOptions.url = $scope.serviceURL + "/DepartmentByPortalIdList";
		$.ajax(AjaxOptions).done(function (results) {
			console.log(results);
			$scope.DepartmentNamesList = results.d;
			$scope.$broadcast('DepartmentNamesListed');
		}
		).fail(AjaxFail);
	}

	$scope.AssignedIDs = {};
	$scope.ListAssignedIDs = function (CategoryId) {
		$.support.cors = true;
		AjaxOptions.data = JSON.stringify({ CategoryId: CategoryId, isAssigned: true });
		AjaxOptions.url = $scope.serviceURL + "/RFIDTagsByCategoryIdStatusList";
		$.ajax(AjaxOptions).done(function (results) {
			console.log(results);
			$scope.AssignedIDs = results.d;
			$scope.AddSelector($scope.AssignedIDs);
			$scope.AddReadableDate($scope.AssignedIDs, "ItemPurchaseDate");
			$scope.$broadcast('AssignedIDsListed');
		}
		).fail(AjaxFail);
	}

	//(int CategoryId, Boolean isAssigned)

	$scope.AssignedIDsCount = 0;
	$scope.CountAssignedIDs = function (CategoryId) {
		$.support.cors = true;
		AjaxOptions.data = JSON.stringify({ CategoryId: CategoryId, isAssigned: true });
		AjaxOptions.url = $scope.serviceURL + "/RFIDTagsByCategoryIdStatusCount";
		$.ajax(AjaxOptions).done(function (results) {
			console.log(results);
			$scope.AssignedIDsCount = results.d;
			$scope.$broadcast('AssignedIDsCountListed');
		}
		).fail(AjaxFail);
	}

	$scope.ListAssignedIDsByBranch = function (CategoryId, BranchId) {
		$.support.cors = true;
		AjaxOptions.data = JSON.stringify({ CategoryId: CategoryId, BranchId: BranchId, isAssigned: true });
		AjaxOptions.url = $scope.serviceURL + "/RFIDTagsByCategoryIdandBranchIdStatusList";
		$.ajax(AjaxOptions).done(function (results) {
			console.log(results);
			$scope.AssignedIDs = results.d;
			$scope.AddSelector($scope.AssignedIDs);
			$scope.AddReadableDate($scope.AssignedIDs, "ItemPurchaseDate");
			$scope.$broadcast('AssignedIDsListed');
		}
		).fail(AjaxFail);
	}

	$scope.ListAssignedIDsTrimDept = function (CategoryId, BranchId, Dept, ForReprint) {
		//RFIDTagsByCategoryIdBranchIdFacultyStatusList
		$.support.cors = true;
		AjaxOptions.data = JSON.stringify({ CategoryId: CategoryId, BranchId: BranchId, FacultyAccr: Dept, isAssigned: true });
		if (ForReprint) {
			AjaxOptions.url = $scope.serviceURL + "/RFIDTagsByBranchIdFacultyReprintList";
		}
		else {
			AjaxOptions.url = $scope.serviceURL + "/RFIDTagsByCategoryIdBranchIdFacultyStatusList";
		}
		$.ajax(AjaxOptions).done(function (results) {
			console.log(results);
			$scope.AssignedIDs = results.d;
			$scope.AddSelector($scope.AssignedIDs);
			$scope.AddReadableDate($scope.AssignedIDs, "ItemPurchaseDate");
			$scope.$broadcast('AssignedIDsListed');
		}
		).fail(AjaxFail);
	}

	//RFIDTagsByCategoryIdBranchIdDeptLevelList(int CategoryId, int BranchId, String Department,String CurrentLevel, Boolean isAssigned)
	$scope.ListAssignedIDsTrimDeptLevel = function (CategoryId, BranchId, Dept, Level) {
		$.support.cors = true;
		AjaxOptions.data = JSON.stringify({ CategoryId: CategoryId, BranchId: BranchId, Department: Dept, CurrentLevel: Level, isAssigned: true });
		AjaxOptions.url = $scope.serviceURL + "/RFIDTagsByCategoryIdBranchIdDeptLevelList";
		$.ajax(AjaxOptions).done(function (results) {
			console.log(results);
			$scope.AssignedIDs = results.d;
			$scope.AddSelector($scope.AssignedIDs);
			$scope.AddReadableDate($scope.AssignedIDs, "ItemPurchaseDate");
			$scope.$broadcast('AssignedIDsListed');
		}
		).fail(AjaxFail);
	}

	$scope.GottenUser = {};
	$scope.GetUser = function (Id) {
		$.support.cors = true;
		if (!Id) {
			Id = $scope.user.Id;
		}
		AjaxOptions.data = JSON.stringify({ Id: Id });
		AjaxOptions.url = $scope.serviceURL + "/UsersByIdGet";
		$.ajax(AjaxOptions).done(function (results) {
			console.log(results);
			$scope.GottenUser = results.d;
			$scope.$broadcast('UserGotten');
		}
		).fail(AjaxFail);
	}

	$scope.UnsetPipingMode = function () {
		$scope.PipingMode = false;
	}

	$scope.$on('ApprovalsUpdateListed', function (event, arg) {
		if ($scope.Booleanfy(arg)) {
			$('#NotificationMenu').css('display', 'inline-block');
			$('#ApprovalCount').text(arg);
		}
		else {
			$('#NotificationMenu').css('display', 'none');
			$('#ApprovalCount').text('0');
		}
	});
	$scope.CheckPendingTasks = function () {
		if ($scope.PipingMode) return;
		$scope.ListApprovals($scope.user.Id, true);
	}
	$scope.CheckPendingTasks();
	setInterval($scope.CheckPendingTasks, 30000);
}