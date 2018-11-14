app.controller('baseController', function ($scope) {

    /* 分页控件配置:
        currentPage 当前页
        totalItems 总记录数
        itemPerPage 每页记录数
        perPageOptions 分页选项
        onchange 分页触发方法 */
    $scope.paginationConf = {
        currentPage: 1,
        totalItems: 10,
        itemsPerPage: 10,
        perPageOptions: [10, 20, 30],
        onChange: function () {
            $scope.reloadList();//重新加载
        }
    };

    //刷新列表
    $scope.reloadList = function () {
        $scope.search($scope.paginationConf.currentPage,
            $scope.paginationConf.itemsPerPage)
    };

    //删除
    //定义一个集合装id
    $scope.selectIds = [];
    //更新（增删）集合中的元素
    $scope.updateIds = function ($event, id) {
        if ($event.target.checked) {
            $scope.selectIds.push(id);
        } else {
            var index = $scope.selectedIds.indexOf(id);
            $scope.selectIds.splice(index, 1);
        }
    };

    $scope.jsonToString = function (jsonString, key) {
        var json = JSON.parse(jsonString);//将 json 字符串转换为 json 对象
        var value = "";
        for (var i = 0; i < json.length; i++) {
            if (i > 0) {
                value += ","
            }
            value += json[i][key];
        }
        return value;
    };
    //从集合中按照key查询对象
    $scope.searchObjectByKey=function(list,key,keyValue){
        for(var i=0;i<list.length;i++){
            if(list[i][key] == keyValue){
                return list[i];
            }
        }
        return null;
    }

});