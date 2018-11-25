app.controller("loginController",function ($scope, loginService) {
    $scope.getName=function () {
        loginService.getName().success(
            function (response) {
                $scope.name=response.name;
                alert($scope.name);
            }
        );
    }
});