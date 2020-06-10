function childmenusCtrl($scope, $http) {

    TweakSkin();
    $scope.ParentChildMenusToDisplay = [];
    $scope.$on('ParentChildMenusListed', function (event) {
        if ($scope.ParentChildMenus == null || $scope.ParentChildMenus.length <= 0) {
            window.location.href = $scope.PageRoot + $scope.RealParentIdValue.PageURL;
            return;
        }
        var PageURLsToUse;
        if (localStorage.getItem('PageURLsIHaveAccessTo')) {
            PageURLsToUse = JSON.parse(localStorage.getItem('PageURLsIHaveAccessTo'));
        }
        else {
            PageURLsToUse = $scope.PageURLsIHaveAccessTo;
        }
        $scope.ParentChildMenusToDisplay = $.grep($scope.ParentChildMenus, function (e) { return isInArray(e.PageURL, PageURLsToUse);});
        
        ApplyViewChanges($scope);
        $scope.BindClicks();
    });

        $scope.ParentIdValue = $scope.getUrlParameter('ref');
        $scope.RealParentIdValue = $.grep($scope.ParentMenus, function (e) { return e.ViewId == $scope.ParentIdValue; })[0];
        if ($scope.RealParentIdValue == undefined) {
            if (localStorage.getItem('CurrentMenuParentId')) {
                $scope.RealParentIdValue = JSON.parse(localStorage.getItem('CurrentMenuParentId'));
            }
            else {
                $scope.ThrowPageError('Oops!', 'Seems we ran into some problems! You may retry what you were trying to do after sometime.');
            }
        }
        else {
            localStorage.setItem('CurrentMenuParentId', JSON.stringify($scope.RealParentIdValue));
        }

        var ParentMenusToUse;
        if (localStorage.getItem('ParentMenusIHaveAccessTo')) {
            ParentMenusToUse = JSON.parse(localStorage.getItem('ParentMenusIHaveAccessTo'));
        }
        else {
            ParentMenusToUse = $scope.ParentMenusIHaveAccessTo;
        }

        if (isInArray($scope.RealParentIdValue.Id, ParentMenusToUse)) {
            $scope.ListParentChildMenus($scope.RealParentIdValue.Id);
        }
        else {
            $scope.ThrowPageError('Access Denied!', 'Sorry, you do not have access to the page requested.');
            return;
        }
        
        $scope.BindClicks = function () {
            $('.submenus').click(function () {
                window.location.href = $scope.PageRoot + $(this).attr('ng-href');
            });
        }
}