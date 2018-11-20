app.controller("itemController",function($scope){
	//ҳ�������Ʒ����
	$scope.updateNum=function(num){
		$scope.num +=num;
		if($scope.num<1){
			$scope.num=1;
		}
	}
	
	$scope.specificationItems={};//��¼�û�ѡ��Ĺ��
	//�û�ѡ����
	$scope.selectSpecification=function(name,value){	
		$scope.specificationItems[name]=value;
		searchSku();//��ȡsku
	}	
	//�ж�ĳ���ѡ���Ƿ��û�ѡ��
	$scope.isSelected=function(name,value){
		if($scope.specificationItems[name]==value){
			return true;
		}else{
			return false;
		}	
	}
	
	$scope.sku={};
	//����Ĭ�ϵ�SKU
	$scope.loadSku=function(){
		$scope.sku=skuList[0];
		$scope.specificationItems=JSON.parse(JSON.stringify($scope.sku.spec));
	}
	
	//ƥ����������
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
	
	//��ѯSKU
	searchSku=function(){
		for(var i=0;i<skuList.length;i++ ){
			if( matchObject(skuList[i].spec ,$scope.specificationItems ) ){
				$scope.sku=skuList[i];
				return ;
			}			
		}	
		$scope.sku={id:0,title:'--------',price:0};//���û��ƥ���		
	}
		//�����Ʒ�����ﳵ
	$scope.addToCart=function(){
		alert('skuid:'+$scope.sku.id);				
	}

});