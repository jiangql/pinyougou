//brandService
app.service("brandService",function ($http) {
    //新建
    this.add = function (entity) {
        return $http.post("../brand/add.do", entity);
    };

    //更新
    this.update=function (entity) {
        return $http.post("../brand/update.do",entity);
    };
    //查询修改项
    this.findOne = function (id) {
        return $http.get("../brand/findOne.do?id="+ id);
    };
    //删除
    this.delSelected =function (ids) {
        return $http.get("../brand/delete.do?ids=" +ids);
    };
    //查询
    this.search =function (page,rows,searchEntity) {
        return $http.post('../brand/search.do?page=' + page + '&rows=' + rows, searchEntity);
    };
    //品牌下拉
    this.selectOptionList=function () {
        return $http.get("../brand/selectOptionList.do");
    }

});