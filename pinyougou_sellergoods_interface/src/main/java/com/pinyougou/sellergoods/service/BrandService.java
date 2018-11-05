package com.pinyougou.sellergoods.service;


import com.pinyougou.pojo.TbBrand;
import entity.PageResult;

public interface BrandService {
    /**
     * 分页查询
     * @param pageNum
     * @param pageSize
     * @param brand
     * @return
     */
    PageResult findPage(Integer pageNum, Integer pageSize, TbBrand brand);

    /**
     * 新建
     * @param brand
     */
    void save(TbBrand brand);

    /**
     * 查询单个
     * @param id
     * @return
     */
    TbBrand findOne(Long id);

    /**
     * 修改信息
     * @param brand
     */
    void update(TbBrand brand);

    /**
     * 删除选中
     * @param ids
     */
    void delete(Long[] ids);


}
