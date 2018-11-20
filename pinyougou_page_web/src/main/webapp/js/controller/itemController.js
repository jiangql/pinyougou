app.controller("itemController",function($scope){
	//页面更新商品件数
	$scope.updateNum=function(num){
		$scope.num +=num;
		if($scope.num<1){
			$scope.num=1;
		}
	}
	
	$scope.specificationItems={};//记录用户选择的规格
	//用户选择规格
	$scope.selectSpecification=function(name,value){	
		$scope.specificationItems[name]=value;
		searchSku();//读取sku
	}	
	//判断某规格选项是否被用户选中
	$scope.isSelected=function(name,value){
		if($scope.specificationItems[name]==value){
			return true;
		}else{
			return false;
		}	
	}
	
	$scope.sku={};
	//加载默认的SKU
	$scope.loadSku=function(){
		$scope.sku=skuList[0];
		$scope.specificationItems=JSON.parse(JSON.stringify($scope.sku.spec));
	}
	
	//匹配两个对象
	matchObject=function(obj1,obj2){
		for(var key in obj1){
			if(obj1[key] != obj2[key]){
				return false;
			}
		}
		for(var key in obj2){
			if(obj2[key] != obj1[key]){
				return false;
			}
		}
		return true;
	}
	
	//查询SKU
	searchSku=function(){
		for(var i=0;i<skuList.length;i++ ){
			if( matchObject(skuList[i].spec ,$scope.specificationItems ) ){
				$scope.sku=skuList[i];
				return ;
			}			
		}	
		$scope.sku={id:0,title:'--------',price:0};//如果没有匹配的		
	}
		//添加商品到购物车
	$scope.addToCart=function(){
		alert('skuid:'+$scope.sku.id);				
	}

});