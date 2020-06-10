function SearchIdCtrl($scope, $http) {

    $scope.IDCardStatusInfo = {
        IDCardCollectedStatus: ""
    };
    $('#Details').hide();
    $('#SearchWithMatNumber').click(function () {
        if ($scope.Search == null) {
            $scope.MessageAlert('Please Enter a matric number', 'error');
        } else {
            $.support.cors = true;
            AjaxOptions.data = JSON.stringify({ PortalId: $scope.user.PortalId, regNo: $scope.Search });
            AjaxOptions.url = $scope.serviceURL + "/IDCardStudentCheck";
            $.ajax(AjaxOptions).done(function (results) {
                $('#Details').show();

                console.log(results.d);
                $scope.IDCardStatusInfo = results.d;
                ApplyViewChanges($scope);

            }
            ).fail(AjaxFail);
        }
    });
    
}