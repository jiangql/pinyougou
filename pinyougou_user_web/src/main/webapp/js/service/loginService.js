app.service("loginService",function ($http) {
   this.getName=function () {
       return $http.get("/login/name.do");
   }
});