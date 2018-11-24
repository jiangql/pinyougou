//控制层
app.controller('goodsController', function ($scope, $controller,$location, goodsService, uploadService, itemCatService, typeTemplateService) {

    $controller('baseController', {$scope: $scope});//继承

    //读取列表数据绑定到表单中  
    $scope.findAll = function () {
        goodsService.findAll().success(
            function (response) {
                $scope.list = response;
            }
        );
    }

    //分页
    $scope.findPage = function (page, rows) {
        goodsService.findPage(page, rows).success(
            function (response) {
                $scope.list = response.rows;
                $scope.paginationConf.totalItems = response.total;//更新总记录数
            }
        );
    }

    //查询实体
    $scope.findOne = function () {
        var id =  $location.search()['id'];
        if (id==null){
            return;
        }
        goodsService.findOne(id).success(
            function (response) {
                $scope.entity = response;
                //html信息转换
                editor.html(response.goodsDesc.introduction);
                //商品图片转换
                $scope.entity.goodsDesc.itemImages=JSON.parse(response.goodsDesc.itemImages);
                //商品扩展属性装换
                $scope.entity.goodsDesc.customAttributeItems=JSON.parse(response.goodsDesc.customAttributeItems);
                //规格列表转换
                $scope.entity.goodsDesc.specificationItems=JSON.parse($scope.entity.goodsDesc.specificationItems);

                for( var i=0;i<$scope.entity.itemList.length;i++ ){
                    $scope.entity.itemList[i].spec = JSON.parse( $scope.entity.itemList[i].spec);
                }

            }
        );
    }


    //保存
    $scope.save=function(){
        //提取文本编辑器的值
        $scope.entity.goodsDesc.introduction=editor.html();
        var serviceObject;//服务层对象
        if($scope.entity.goods.id!=null){//如果有ID
            serviceObject=goodsService.update( $scope.entity ); //修改
        }else{
            serviceObject=goodsService.add( $scope.entity  );//增加
        }
        serviceObject.success(
            function(response){
                if(response.success){
                    alert('保存成功');
                    location.href="goods.html";//跳转到商品列表页
                    $scope.entity={};
                    editor.html("");
                }else{
                    alert(response.message);
                }
            }
        );
    }



    //批量删除
    $scope.dele = function () {
        //获取选中的复选框
        if (confirm("是否删除选中")){
            goodsService.dele($scope.selectIds).success(
                function (response) {
                    if (response.success) {
                        $scope.reloadList();//刷新列表
                        $scope.selectIds = [];
                    }
                }
            );
        }
    }

    $scope.searchEntity = {};//定义搜索对象

    //搜索
    $scope.search = function (page, rows) {
        goodsService.search(page, rows, $scope.searchEntity).success(
            function (response) {
                $scope.list = response.rows;
                $scope.paginationConf.totalItems = response.total;//更新总记录数
            }
        );
    }
    //上传图片
    $scope.uploadFile = function () {
        uploadService.uploadFile().success(function (response) {
            if (response.success) {//如果上传成功，取出url
                $scope.image_entity.url = response.message;//设置文件地址
            } else {
                alert(response.message);
            }
        }).error(function () {
            alert("上传发生错误");
        });
    };

    $scope.entity = {goods: {}, goodsDesc: {itemImages: []}};//定义页面实体结构
    //添加图片列表
    $scope.add_image_entity = function () {
        $scope.entity.goodsDesc.itemImages.push($scope.image_entity);
    }
    //列表中移除图片
    $scope.remove_image_entity = function (index) {
        $scope.entity.goodsDesc.itemImages.splice(index, 1);
    }
    //一级下拉框
    $scope.selectItemCat1List = function (parentId) {
        itemCatService.findByParentId(parentId).success(
            function (response) {
                $scope.itemCat1List = response;
            }
        );
    }

    //二级下拉框
    $scope.$watch("entity.goods.category1Id", function (newVal, oldVal) {
        itemCatService.findByParentId(newVal).success(
            function (response) {
                $scope.itemCat2List = response;
            }
        );
    });
    //三级下拉框
    $scope.$watch("entity.goods.category2Id", function (newVal, oldVal) {
        itemCatService.findByParentId(newVal).success(
            function (response) {
                $scope.itemCat3List = response;
            }
        );
    });

    //获取模板id
    $scope.$watch("entity.goods.category3Id", function (newVal, oldVal) {
        itemCatService.findOne(newVal).success(
            function (response) {
                $scope.entity.goods.typeTemplateId = response.typeId;
            }
        );
    });
    //获取模板表中的信息
    $scope.$watch("entity.goods.typeTemplateId", function (newVal, oldVal) {
        typeTemplateService.findOne(newVal).success(
            function (response) {
                $scope.typeTemplate = response;
                $scope.typeTemplate.brandIds = JSON.parse(response.brandIds);
                if($location.search()['id']==null) {
                    $scope.entity.goodsDesc.customAttributeItems = JSON.parse(response.customAttributeItems);
                }
            }
        );
        //查询规格列表
        typeTemplateService.findSpecList(newVal).success(
            function (response) {
                $scope.specList = response;
            }
        );
    });
    //[{“attributeName”:”规格名称”,”attributeValue”:[“规格选项1”,“规格选项2”.... ]  } , .... ]
    $scope.entity = {goodsDesc: {itemImages: [], specificationItems: []}};
    $scope.updateSpecAttribute = function ($event, name, value) {
        var object = $scope.searchObjectByKey($scope.entity.goodsDesc.specificationItems, 'attributeName', name);
        if (object != null) {
            if ($event.target.checked) {
                object.attributeValue.push(value);
            } else {//取消勾选
                object.attributeValue.splice(object.attributeValue.indexOf(value), 1);//移除选项
                //如果选项都取消了，将此条记录移除
                if (object.attributeValue.length == 0) {
                    $scope.entity.goodsDesc.specificationItems.splice(
                        $scope.entity.goodsDesc.specificationItems.indexOf(object), 1);
                }
            }
        } else {
            $scope.entity.goodsDesc.specificationItems.push(
                {"attributeName": name, "attributeValue": [value]});
        }

    }
    //创建SKU列表
    $scope.createItemList=function(){

        $scope.entity.itemList=[{spec:{},price:0,num:99999,status:'0',isDefault:'0'} ];//列表初始化

        var items= $scope.entity.goodsDesc.specificationItems;

        for(var i=0;i<items.length;i++){
            $scope.entity.itemList= addColumn( $scope.entity.itemList, items[i].attributeName,items[i].attributeValue );
        }

    }

    addColumn=function(list,columnName,columnValues){

        var newList=[];
        for(var i=0;i< list.length;i++){
            var oldRow=  list[i];
            for(var j=0;j<columnValues.length;j++){
                var newRow=  JSON.parse( JSON.stringify(oldRow)  );//深克隆
                newRow.spec[columnName]=columnValues[j];
                newList.push(newRow);
            }
        }
        return newList;
    };
    //审核状态转换
    $scope.statusDesc=['未审核','已审核','审核未通过','关闭'];//状态列表

    //商品分类转换
    $scope.itemCatList=[];//商品分类列表
    $scope.findItemCatList=function(){
        itemCatService.findAll().success(
            function (response) {
                for (var i = 0;i<response.length;i++){
                    $scope.itemCatList[response[i].id]=response[i].name;
                }
            }
        );
    }
    //检测规格选项是否被选中
    $scope.checkAttributeValue=function (specName,optionName) {
        var items= $scope.entity.goodsDesc.specificationItems;
        var object= $scope.searchObjectByKey(items,'attributeName',specName);
        if(object!=null){
            if (object.attributeValue.indexOf(optionName)>=0){
                return true;
            }else {
                return false;
            }
        }
        return false;
    }

});
