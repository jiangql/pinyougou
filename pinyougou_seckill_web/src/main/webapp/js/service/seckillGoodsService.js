app.service("seckillGoodsService",function ($http) {
  //查询秒杀商品列表
   this.findList=function () {
       return $http.get("seckillGoods/findList.do");
   };

   //获取商品详情
    this.findOne=function (id) {
        return $http.get("seckillGoods/findOneFromRedis.do?id="+id);
    };

    //提交秒杀订单
    this.submitOrder=function (seckillId) {
      return $http.get("seckillOrder/submitOrder.do?seckillId="+seckillId)
    }

});