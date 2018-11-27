app.service("cartService",function ($http) {
    //cookie中获取购物车信息
    this.findCartList=function () {
        return $http.get("cart/findCartList.do");
    };
    //添加商品
    this.addGoodsToCartList=function (itemId,num) {
        return $http.get("cart/addGoodsToCartList.do?itemId="+itemId+"&num="+num);
    };

    //获取用户名
    this.getName=function () {
        return $http.get("cart/name.do");
    };

    //获取总钱数和总数量
    this.getSum=function (cartList) {
        var sum={totalNum:0,totalMoney:0.00,itemIdandNum:[]};
        for (var i = 0;i < cartList.length;i++){

            var itemList=cartList[i].orderItemList;

                for (var j = 0;j < itemList.length;j++){

                    var orderItem=itemList[j];
                    sum.totalNum += orderItem.num;
                    sum.totalMoney += orderItem.totalFee;
                    sum.itemIdandNum[orderItem.itemId]=orderItem.num;
                }
        }
        return sum;
    }

});
