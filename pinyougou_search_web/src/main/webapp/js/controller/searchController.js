app.controller("searchController",function ($scope,$location,searchService) {
    //定义初始搜索对象的格式
    $scope.searchMap={keywords:'',category:'',brand:'',spec:{},price:'',pageNo:1,pageSize:20,sort:'',sortField:''};

    $scope.search=function () {
        $scope.searchMap.pageNo= parseInt($scope.searchMap.pageNo) ;
        searchService.search($scope.searchMap).success(
            function (response) {
                $scope.resultMap=response;
                buildPageLabel();//调用分页
            }
        );
    };
    //在增加和删除搜索条件之后调用搜索方法实现时时条件搜索
    //增加属性
    $scope.addSearchItem=function (key, value) {
        if(key=='category'||key=='brand'||key=='price'||key=='pageNo'){
            $scope.searchMap[key]=value;
        }else {
            $scope.searchMap.spec[key]=value;
        }
        $scope.search();
    };
    //移除属性
    $scope.removeSearchItem=function (key) {
        if (key=="category"||key=="brand"||key=="price"){
            $scope.searchMap[key]='';
        }else {
            delete $scope.searchMap.spec[key];
        }
        $scope.search();
    }
    //构建页码展示
    buildPageLabel=function () {
        $scope.pageLabel=[];//新增分页栏属性
        var maxPageNo= $scope.resultMap.totalPages;//得到最后页码
        var firstPage;//开始页码
        var lastPage;//截止页码
        //页码展示的规则
        if (maxPageNo>5){
            if($scope.searchMap.pageNo<=3){
                firstPage=1;
                lastPage=5;
            }else if ($scope.searchMap.pageNo>=maxPageNo-2){
                firstPage=maxPageNo-4;
                lastPage=maxPageNo;
            }else {
                firstPage=$scope.searchMap.pageNo-2;
                lastPage=$scope.searchMap.pageNo+2;
            }
        }
        //将页码放入数组
        for (var i = firstPage;i<=lastPage;i++){
            $scope.pageLabel.push(i);
        }
    }
    //查询页码对应内容
    $scope.queryByPage=function (pageNo) {
        if(pageNo<1||pageNo>$scope.resultMap.totalPages){
           return;
        }
        $scope.searchMap.pageNo=pageNo;
        $scope.search();
        $scope.searchNo='';
    }
    //设置排序规则
    $scope.sortSearch=function (sortField, sort) {
        $scope.searchMap.sortField=sortField;
        $scope.searchMap.sort=sort;
        $scope.search();
    }
    //搜索关键字是否包含品牌
    $scope.isContainBrand=function () {
        for(var i=0;i<$scope.resultMap.brandList.length;i++){
            if ($scope.searchMap.keywords.indexOf($scope.resultMap.brandList[i].text)>=0){
                return true;
            }
        }
        return false;
    }
    //加载查询字符串
    $scope.loadkeywords=function(){
        $scope.searchMap.keywords=  $location.search()['keywords'];
        $scope.search();
    }

});