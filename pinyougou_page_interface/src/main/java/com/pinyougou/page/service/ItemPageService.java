package com.pinyougou.page.service;

public interface ItemPageService {
    /**
     * 生成商品详情
     * @param goodsId
     * @return
     */
    Boolean genItemHtml(Long goodsId);


    /**
     * 删除生成页面
     * @param goodsIds
     * @return
     */
    Boolean deleteItemHtml(Long[] goodsIds);
}
