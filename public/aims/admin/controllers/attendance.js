function attendanceCtrl($scope, $http) {
    TweakSkin();
    /// ---------------------------------------------------
    $scope.NewAllAttendance = { PortalId: $scope.user.PortalId, date1: "", date2: "" };
    $scope.NewSingleAttendance = { date1: "", date2: "", staffId: 0 };

    $scope.ResetSourceAll = function () {
        $scope.NewAllAttendance = { PortalId: $scope.user.PortalId, date1: "", date2: "" };
    }
    $scope.ResetSourceSingle = function () {
        $scope.NewSingleAttendance = { date1: "", date2: "", staffId: 0 };
    }
    
    
    $scope.$on('UsersListed', function (event) {
        ApplyViewChanges($scope);
        $scope.updateChosenList();
    });

    $scope.MyAttendanceAll = {};
    $scope.$on('AttendanceAllListed', function (event) {
        $scope.MyAttendanceAll = $scope.AttendanceAll;
        for (var i = 0; i < $scope.MyAttendanceAll.length; i++) {
            $scope.MyAttendanceAll[i].Fullname = $scope.MyAttendanceAll[i].SurName + ' ' + $scope.MyAttendanceAll[i].OtherNames;
        }
        $scope.AddReadableDate($scope.MyAttendanceAll, "RecordedTime");
        $scope.FixAttendanceAll($scope.MyAttendanceAll);
    });

    $scope.MyAttendanceSingle = {};
    $scope.$on('AttendanceSingleListed', function (event) {
        $scope.MyAttendanceSingle = $scope.AttendanceSingle;
        $scope.AddReadableDate($scope.MyAttendanceSingle, "RecordedTime");
        $scope.FixAttendanceSingle($scope.MyAttendanceSingle);
        $scope.FixAttendanceSingle($scope.MyAttendanceSingle);
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

    
    $scope.ShowAttendanceAll = function () {
        try {
            $scope.NewAllAttendance.date1 = $scope.computedate($scope.NewAllAttendance.date1str, "00:01 AM");;
            $scope.NewAllAttendance.date2 = $scope.computedate($scope.NewAllAttendance.date2str, "11:59 PM");;
            $scope.ListAttendanceAll($scope.NewAllAttendance);
        }
        catch (exception) {
            $scope.MessageAlert('An error occurred. Ensure you have filled form properly and retry.', 'error');
        }
    }

    $scope.ShowAttendanceSingle = function () {
        try {
            $scope.NewSingleAttendance.date1 = $scope.computedate($scope.NewSingleAttendance.date1str, "00:01 AM");;
            $scope.NewSingleAttendance.date2 = $scope.computedate($scope.NewSingleAttendance.date2str, "11:59 PM");;
            $scope.NewSingleAttendance.staffId = $('#SelEmployee').val();
            $scope.ListAttendanceSingle($scope.NewSingleAttendance);
        }
        catch (exception) {
            $scope.MessageAlert('An error occurred. Ensure you have filled form properly and retry.', 'error');
        }
    }

   
   

    $('#EditView').slideUp();
    $scope.BindDeleteFunctionAll = function () {
        
    }
    $scope.EditStock = {};
    $scope.PrepareEditAll = function (ref) {
        $('#DisplayAreaAll').slideUp();

        $scope.EditAttendanceAll = $.grep($scope.AttendanceAll, function (e) { return e.Id == ref; })[0];
        $('#imgPhotoIn').attr('src', $scope.EditAttendanceAll.PhotoIn);
        $('#imgPhotoOut').attr('src', $scope.EditAttendanceAll.PhotoOut);
        $('#PhotoAreaAll').css('display', 'block');
        $scope.ScrollPageUp();
    }

    $scope.ExitEdit = function () {
        $scope.EditStock = {};
        $('#MainView').slideDown();
        $('#EditView').css('display', 'none');
        AttendanceAlltable.columns.adjust().draw();
    }

  
    ///------------------------------------
    var AttendanceAlltable;
    var AttendanceAlltableFormatted = true; //false = enable custom drop down
    $scope.FixAttendanceAll = function (TableData) {
        AttendanceAlltable = $scope.DoDataTable(AttendanceAlltableFormatted, 'tblAttendanceAll', TableData, $scope.BindDeleteFunctionAll, //
           ["RecordedTimeReadable", "Fullname", "TimeIn", "TimeOut"], true, true, "Fullname", $scope.PrepareEditAll);
    }

    ///------------------------------------
    var AttendanceSingletable;
    var AttendanceSingletableFormatted = true; //false = enable custom drop down
    $scope.FixAttendanceSingle = function (TableData) {
        AttendanceSingletable = $scope.DoDataTable(AttendanceSingletableFormatted, 'tblAttendanceSingle', TableData, $scope.BindDeleteFunction, //
           ["RecordedTimeReadable", "TimeIn", "TimeOut"], true, true, "RecordedTimeReadable", $scope.PrepareEdit);
    }

   
    $scope.getallusers();
}