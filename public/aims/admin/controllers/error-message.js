function error_messageCtrl($scope, $http) {
    $scope.ErrorMessage = {};
    if (localStorage.getItem('error-message-title') && localStorage.getItem('error-message-info')) {
        $scope.ErrorMessage = {
            Title: localStorage.getItem('error-message-title'), Info: localStorage.getItem('error-message-info')
        };
    }
    else {
        $scope.ErrorMessage = {
            Title: 'Breathe deeply, stay calm!', Info: 'An unexpected error occurred while procesing your request. You may try again later, or use the menu to gain access to other areas of the application.'
        };
    }
   

   
    //setTimeout(function () {
       // ApplyViewChanges($scope);
    //}, 1000);
}