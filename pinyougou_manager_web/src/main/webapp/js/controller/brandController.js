app.controller("brandController", function($scope,brandService,$controller) {

    $controller('baseController',{$scope:$scope});

    //新建与更新
    $scope.save = function () {
        var serviceObject;
        if ($scope.entity.id != null) {
            serviceObject = brandService.update($scope.entity);
        } else {
            serviceObject = brandService.add($scope.entity);
        }
        serviceObject.success(
            function (response) {
                if (response.success) {
                    $scope.reloadList();
                } else {
                    alert(response.message);
                }
            }
        );
    };

    //查询修改项
    $scope.findOne = function (id) {
        brandService.findOne(id).success(
            function (result) {
                $scope.entity = result;
            }
        );
    };


    //删除选中
    $scope.delSelected = function () {
        if (confirm("是否删除选中项？")) {
            brandService.delSelected($scope.selectIds).success(
                function (response) {
                    if (response.success) {
                        $scope.reloadList();
                    } else {
                        alert(response.message);
                    }
                }
            );
        }
    };
    //条件模糊查询
    $scope.searchEntity={};
    $scope.search = function(page, rows) {
        brandService.search(page,rows,$scope.searchEntity).success(function(response) {
            $scope.list = response.rows;
            $scope.paginationConf.totalItems = response.total;
        });
    }


});