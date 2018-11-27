app.controller('cartController',function ($scope,cartService) {

    var num=[];
    $scope.findCartList=function () {
        cartService.findCartList().success(
            function (response) {
                $scope.cartList=response;

                $scope.sum=cartService.getSum(response);
            }

        );

    };
    $scope.addGoodsToCartList=function(itemId,num){
        cartService.addGoodsToCartList(itemId,num).success(
            function (response) {
                if (response.success){
                    $scope.findCartList();
                }
            }
        );
    };
    $scope.getName=function () {
        cartService.getName().success(
            function (response) {
                $scope.loginname=response.loginname;
            }
        );
    }

});