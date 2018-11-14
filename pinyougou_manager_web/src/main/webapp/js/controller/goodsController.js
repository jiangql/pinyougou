 //控制层 
app.controller('goodsController' ,function($scope,$controller ,$location,goodsService,itemCatService){
	
	$controller('baseController',{$scope:$scope});//继承
	
    //读取列表数据绑定到表单中  
	$scope.findAll=function(){
		goodsService.findAll().success(
			function(response){
				$scope.list=response;
			}			
		);
	}    
	
	//分页
	$scope.findPage=function(page,rows){			
		goodsService.findPage(page,rows).success(
			function(response){
				$scope.list=response.rows;	
				$scope.paginationConf.totalItems=response.total;//更新总记录数
			}			
		);
	}
	
	//查询实体 
	$scope.findOne=function(){
		var id = $location.search()['id'];
		if (id==null){
			return;
		}
		goodsService.findOne(id).success(
			function(response){
				$scope.entity= response;
			}
		);				
	}
	
	//保存 
	$scope.save=function(){				
		var serviceObject;//服务层对象  				
		if($scope.entity.id!=null){//如果有ID
			serviceObject=goodsService.update( $scope.entity ); //修改  
		}else{
			serviceObject=goodsService.add( $scope.entity  );//增加 
		}				
		serviceObject.success(
			function(response){
				if(response.success){
					//重新查询 
		        	$scope.reloadList();//重新加载
				}else{
					alert(response.message);
				}
			}		
		);				
	}
	
	 
	//批量删除 
	$scope.dele=function(){			
		//获取选中的复选框
		goodsService.dele( $scope.selectIds ).success(
			function(response){
				if(response.success){
					$scope.reloadList();//刷新列表
					$scope.selectIds=[];
				}						
			}		
		);				
	}
	
	$scope.searchEntity={};//定义搜索对象 
	
	//搜索
	$scope.search=function(page,rows){			
		goodsService.search(page,rows,$scope.searchEntity).success(
			function(response){
				$scope.list=response.rows;	
				$scope.paginationConf.totalItems=response.total;//更新总记录数
			}			
		);
	}

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

    //更改状态
    $scope.updateStatus=function(status){
        goodsService.updateStatus($scope.selectIds,status).success(
            function(response){
                if(response.success){//成功
                    $scope.reloadList();//刷新列表
                    $scope.selectIds=[];//清空ID集合
                }else{
                    alert(response.message);
                }
            }
        );
    }

    //级联下拉
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


});	
