app.controller('contentController',function ($scope,contentService) {

    $scope.contentList=[];//广告集合

    $scope.findByCategory=function (categoryId) {
        contentService.findByCategoryId(categoryId).success(
            function (response) {
                $scope.contentList[categoryId]=response;
            }
        );
    }
});