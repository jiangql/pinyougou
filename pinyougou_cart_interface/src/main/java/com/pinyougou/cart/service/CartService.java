package com.pinyougou.cart.service;

import com.pinyougou.pojogroup.Cart;

import java.util.List;

public interface CartService {

    /**
     * 添加商品到购物车
     * @param cartList
     * @param itemId
     * @param num
     * @return
     */
    List<Cart> addGoodsCartList(List<Cart> cartList,Long itemId,Integer num);

    /**
     * 根据用户名从redis中获取购物车列表
     * @param username
     * @return
     */
    List<Cart> findCartListFromRedis(String username);

    /**
     * 保存购物车列表到redis
     * @param username
     * @param cartList
     */
    void saveCartListToRedis(String username,List<Cart> cartList);

    /**
     * 合并来源不同的购物车
     * @param list1
     * @param list2
     * @return
     */
    List<Cart> mergeCartList(List<Cart> list1,List<Cart> list2);
}
