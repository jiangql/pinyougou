app.controller("seckillGoodsController", function ($scope, $location, $interval, seckillGoodsService) {

    //查询秒杀商品列表
    $scope.findList = function () {
        seckillGoodsService.findList().success(
            function (response) {
                $scope.seckillList = response;
            }
        );
    };

    //查询商品详情
    $scope.findOne = function () {
        seckillGoodsService.findOne($location.search()['id']).success(
            function (response) {
                $scope.entity = response;
                //秒杀倒计时显示
                second=Math.floor((new Date($scope.entity.endTime).getTime()-new Date().getTime())/1000);
                time= $interval(function () {
                    if (second>0){
                        second--;
                        $scope.tiemString=convertTimeString(second);
                    }else {
                        $interval.cancel(time);
                        alert("秒杀活动已经结束");
                    }
                },1000)




            }
        );
    };
    //将毫秒时间转化为字符串
    convertTimeString=function (second) {
        var days= Math.floor(second/(24*3600));//天数
        var hours = Math.floor(second%(24*3600)/3600);//小时数
        var minutes =Math.floor((second%(24*3600)%3600)/60);//分钟数
        var seconds =Math.floor(second%60);
        var tiemStr ="";
        if (days>0){
            tiemStr = days+"天 ";
        }
        return tiemStr + hours+":"+minutes+":"+seconds;
    }

 /*   //倒计时
    $scope.second = 10;
    time= $interval(function(){
        if($scope.second>0){
            $scope.second =$scope.second-1;
        }else{
            $interval.cancel(time);
            alert("秒杀服务已结束");
        }
    },1000);*/

 //提交订单
    $scope.submitOrder= function () {
        seckillGoodsService.submitOrder($scope.entity.id).success(
            function (reponse) {
                if (reponse.success){
                    alert("下单成功，请在1分钟内完成支付");
                    location.href="pay.html";
                }else {
                    if (reponse.message=='未登录'){
                        alert("请登录后再进入秒杀活动");
                        location.href="login.html";
                    }else {
                        alert(reponse.message);
                    }

                }
            }
        );
    }

});