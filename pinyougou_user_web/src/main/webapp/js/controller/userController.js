app.controller('userController',function ($scope,$interval,$timeout,userService) {

    $scope.regist=function () {
        //比较两次输入的密码
        if($scope.entity.password!=$scope.password){
            alert("两次密码不一致，请重新输入");
            $scope.password="";
            return;
        }
        //判断验证码是否输入正确
        if($scope.smsCode.length!=6){
            alert("验证码输入格式错误，请重新输入");
            $scope.inputMessage="";
            return;
        }
        //新增
        userService.add($scope.entity,$scope.smsCode).success(
            function (response) {
                if(response.success){
                    alert("注册成功");
                    location.href="https://www.taobao.com"
                }else {
                    alert(response.message);
                }
            }
        );
    };

    //发送验证码
    $scope.sendCode=function () {
        if ($scope.entity.phone==null||$scope.entity.phone.length==0){
            alert("请输入电话号码");
            return;
        }
        userService.sendCode($scope.entity.phone).success(
            function (response) {
                if (response.success){
                    startTimer();
                }else {
                    alert(response.message);
                }
            }
        );
    };

    //短信重发倒计时
    $scope.timer = false;
    $scope.timeout = 60000;
    $scope.timerCount = $scope.timeout / 1000;
    $scope.text = "点击获取验证码";
    startTimer= function() {
        $scope.showTimer = true;
        $scope.timer = true;
        $scope.text = "秒后重新获取";
        var counter = $interval(function () {
            $scope.timerCount = $scope.timerCount - 1;
        }, 1000);
        $timeout(function () {
            $scope.text = "点击重新获取验证码";
            $scope.timer = false;
            $interval.cancel(counter);
            $scope.showTimer = false;
            $scope.timerCount = $scope.timeout / 1000;
        }, $scope.timeout);
    }
});