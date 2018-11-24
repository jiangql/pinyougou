app.service("userService",function ($http) {
    //注册
    this.add=function (entity,smsCode) {
        return $http.post("user/add.do?smsCode="+smsCode,entity);
    };
    //发送验证码
    this.sendCode=function (phone) {
        return $http.get("user/sendCode.do?phone="+phone);
    };
});
