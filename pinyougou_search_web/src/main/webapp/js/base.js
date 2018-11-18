var app = angular.module("pinyougou", []);

/**
 * $sce过滤器，放行html
 */
app.filter('trustHtml',['$sce',function ($sce) {
    return function (data) {
        return $sce.trustAsHtml(data);
    }

}]);