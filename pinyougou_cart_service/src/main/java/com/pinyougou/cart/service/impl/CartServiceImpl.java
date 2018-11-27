package com.pinyougou.cart.service.impl;

import com.alibaba.dubbo.config.annotation.Service;
import com.pinyougou.cart.service.CartService;
import com.pinyougou.mapper.TbItemMapper;
import com.pinyougou.pojo.TbItem;
import com.pinyougou.pojo.TbOrderItem;
import com.pinyougou.pojogroup.Cart;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
@Service
public class CartServiceImpl implements CartService {

    @Autowired
    private TbItemMapper itemMapper;

    @Autowired
    private RedisTemplate redisTemplate;
    @Override
    public List<Cart> addGoodsCartList(List<Cart> cartList, Long itemId, Integer num) {
        //1.根据商品SKU ID查询SKU商品信息
        //2.获取商家ID
        //3.根据商家ID判断购物车列表中是否存在该商家的购物车
        //4.如果购物车列表中不存在该商家的购物车
        //4.1 新建购物车对象
        //4.2 将新建的购物车对象添加到购物车列表
        //5.如果购物车列表中存在该商家的购物车
        // 查询购物车明细列表中是否存在该商品
        //5.1. 如果没有，新增购物车明细
        //5.2. 如果有，在原购物车明细上添加数量，更改金额


        //1.根据商品SKU ID查询SKU商品信息
        TbItem item = itemMapper.selectByPrimaryKey(itemId);

        //判断商品状态
        if (item==null){
            throw new RuntimeException("该商品不存在");
        }
        if (!item.getStatus().equals("1")){
            throw new RuntimeException("该商品状态异常");
        }
        //2.获取商家ID
        String sellerId = item.getSellerId();
        //3.根据商家ID判断购物车列表中是否存在该商家的购物车
        //调用方法查询是否存在
        Cart cart = searchCartBySellerId(sellerId, cartList);

        //4.如果购物车列表中不存在该商家的购物车
        if (cart==null){
            //4.1 新建购物车对象
            cart= new Cart();
            cart.setSellerId(sellerId);
            cart.setSellerName(item.getSeller());

            //创建购物订单明细
            TbOrderItem orderItem = createOrderItem(item, num);
            List<TbOrderItem> orderItemList =new ArrayList<>();
            orderItemList.add(orderItem);
            cart.setOrderItemList(orderItemList);
            //4.2 将新建的购物车对象添加到购物车列表
            cartList.add(cart);
        }else {  //5.如果购物车列表中存在该商家的购物车
            // 查询购物车明细列表中是否存在该商品
            TbOrderItem orderItem = searchOrderItemByItemId(cart.getOrderItemList(), itemId);
            if (orderItem==null){
                //5.1. 如果没有，新增购物车明细
                orderItem = createOrderItem(item, num);
                cart.getOrderItemList().add(orderItem);
            }else {
                //5.2. 如果有，在原购物车明细上添加数量，更改金额

                orderItem.setNum(orderItem.getNum()+num);
                orderItem.setTotalFee(new BigDecimal(orderItem.getNum()).multiply(orderItem.getPrice()));
                //如果更改数量后，小于等于0，则移除
                if (orderItem.getNum()<=0){
                    cart.getOrderItemList().remove(orderItem);

                }
                //如果移除后的明细数为0，则移除整个cart
                if (cart.getOrderItemList().size()<=0){
                    cartList.remove(cart);
                }
            }
        }


        return cartList;
    }



    /**
     * 根据商家ID查询购物车对象
     * @param sellerId
     * @param cartList
     * @return
     */
    public Cart searchCartBySellerId(String sellerId,List<Cart> cartList){
        for (Cart cart : cartList) {
            if (cart.getSellerId().equals(sellerId)){
                return cart;
            }
        }
        return null;
    }

    /**
     * 创建订单明细
     * @param item
     * @param num
     * @return
     */
    public TbOrderItem createOrderItem(TbItem item,Integer num){
        if (num<=0){
            throw new RuntimeException("商品数量不合法");
        }
        TbOrderItem orderItem = new TbOrderItem();
        orderItem.setNum(num);
        orderItem.setItemId(item.getId());
        orderItem.setGoodsId(item.getGoodsId());
        orderItem.setPicPath(item.getImage());
        orderItem.setSellerId(item.getSellerId());
        orderItem.setTitle(item.getTitle());
        orderItem.setPrice(item.getPrice());
        orderItem.setTotalFee(new BigDecimal(num).multiply(item.getPrice()));
        return orderItem;
    }

    /**
     * 根据商品Id查询
     * @param orderItemList
     * @param itemId
     * @return
     */
    public TbOrderItem searchOrderItemByItemId(List<TbOrderItem> orderItemList ,Long itemId){
        for (TbOrderItem orderItem : orderItemList) {
            if (orderItem.getItemId().longValue()==itemId.longValue()){
                return orderItem;
            }
        }
        return null;
    }

    /**
     * 从redis中查询购物车列表
     * @param username
     * @return
     */
    @Override
    public List<Cart> findCartListFromRedis(String username) {

        List<Cart> cartList = (List<Cart>) redisTemplate.boundHashOps("cartList").get(username);
        if (cartList==null){
            cartList=new ArrayList<>();
        }
        System.out.println("从redis中获取信息");
        return cartList;
    }

    /**
     * 保存购物车信息到缓存
     * @param username
     * @param cartList
     */
    @Override
    public void saveCartListToRedis(String username, List<Cart> cartList) {
        System.out.println("将信息存入redis");
        redisTemplate.boundHashOps("cartList").put(username,cartList);
    }

    @Override
    public List<Cart> mergeCartList(List<Cart> list1, List<Cart> list2) {
        System.out.println("合并购物车");
        for (Cart cart : list2) {
            for (TbOrderItem orderItem : cart.getOrderItemList()) {
                list1 = addGoodsCartList(list1, orderItem.getItemId(), orderItem.getNum());
            }
        }
        return list1;
    }

}
