app.controller('cartController',function ($scope,cartService) {

    var num=[];
    //查询购物车列表
    $scope.findCartList=function () {
        cartService.findCartList().success(
            function (response) {
                $scope.cartList=response;

                $scope.sum=cartService.getSum(response);
            }

        );

    };
    //添加商品到购物车列表
    $scope.addGoodsToCartList=function(itemId,num){
        cartService.addGoodsToCartList(itemId,num).success(
            function (response) {
                if (response.success){
                    $scope.findCartList();
                }
            }
        );
    };
    //获取当前登录用户名
    $scope.getName=function () {
        cartService.getName().success(
            function (response) {
                $scope.loginname=response.loginname;
            }
        );
    };

    //获取收货地址列表
    $scope.findAddressList=function () {
        cartService.findAddressList().success(
            function (response) {
                $scope.addressList=response;

                //设置默认地址
                for (var i=0;i<response.length;i++){
                    if (response[i].isDefault=='1'){
                        $scope.address=response[i];
                        break;
                    }
                }
            }
        );
    };

    //选择地址
    $scope.selectAddress=function (address) {
        $scope.address=address;
    };
    //判断是否是当前选中的地址
    $scope.isSelectedAddress=function (address) {
        if (address==$scope.address){
            return true;
        }else {
            return false;
        }
    };

    $scope.order={paymentType:'1'};
    //选择支付方式
    $scope.selectPayType=function (type) {
        $scope.order.paymentType=type;
    }

    //保存订单
    $scope.submitOrder=function () {
        $scope.order.receiverAreaName=$scope.address.address;//地址
        $scope.order.receiverMobile=$scope.address.mobile;//电话
        $scope.order.receiver=$scope.address.contact;//收件人
        cartService.submitOrder($scope.order).success(
            function (response) {
                if (response.success){
                    if ($scope.order.paymentType=='1'){
                        //若是微信支付，跳转支付页面
                        location.href="pay.html";
                    }else {
                        //若是货到付款，跳转到提示页面
                        location.href="paysuccess.html";
                    }
                }else {
                    //提交失败，提示错误消息
                    alert(response.message);
                }
            }
        );
    }


});