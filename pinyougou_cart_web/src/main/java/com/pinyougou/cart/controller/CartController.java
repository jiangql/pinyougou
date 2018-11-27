package com.pinyougou.cart.controller;

import com.alibaba.dubbo.config.annotation.Reference;
import com.alibaba.fastjson.JSON;
import com.jql.util.CookieUtil;
import com.pinyougou.cart.service.CartService;
import com.pinyougou.pojogroup.Cart;
import entity.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/cart")
public class CartController {
    //（1）从cookie中取出购物车
    //（2）向购物车添加商品
    //（3）将购物车存入cookie

    @Reference(timeout = 6000)
    private CartService cartService;

    @Autowired
    private HttpServletRequest requset;

    @Autowired
    private HttpServletResponse response;


    /**
     * 从cookie中获取购物车列表
     *
     * @return
     */
    @RequestMapping("/findCartList")
    public List<Cart> getCookieCartList() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        String cookieString = CookieUtil.getCookieValue(requset, "cartList", "UTF-8");
        if (cookieString == null || cookieString.equals("")) {
            cookieString = "[]";
        }
        List<Cart> cookie_cartList = JSON.parseArray(cookieString, Cart.class);

        if (username.equals("anonymousUser")){//未登录 从本地cookie中获取
            return cookie_cartList;
        }else {
            //登录 从redis中获取
            List<Cart> redis_cartList = cartService.findCartListFromRedis(username);
            if(cookie_cartList.size()>0){//如果本地存在购物车
                //合并购物车
                redis_cartList=cartService.mergeCartList(redis_cartList, cookie_cartList);
                //清除本地cookie的数据
                CookieUtil.deleteCookie(requset, response, "cartList");
                //将合并后的数据存入redis
                cartService.saveCartListToRedis(username, redis_cartList);
            }

            return redis_cartList;
        }


    }

    /**
     * 向购物车中添加商品，并将新的购物车列表添加至缓存
     * @param itemId
     * @param num
     * @return
     */
    @RequestMapping("/addGoodsToCartList")
    @CrossOrigin(origins="http://localhost:9105",allowCredentials="true")
    public Result addGoodsToCartList(Long itemId,Integer num){
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        System.out.println("当前登录用户:"+username);
        try {
            List<Cart> cartList = cartService.addGoodsCartList(getCookieCartList(), itemId, num);
            if (username.equals("anonymousUser")){//未登录 保存至cookie
                CookieUtil.setCookie(requset,response,"cartList",JSON.toJSONString(cartList),24*3600,"UTF-8");
                System.out.println("向缓cookie中获取数据");
            }else {//已登录 保存至redis
                cartService.saveCartListToRedis(username,cartList);
                System.out.println("保存至redis");
            }

            return new Result(true,"添加商品成功");
        } catch (Exception e) {
            e.printStackTrace();
            return new Result(false,"添加商品失败");
        }

    }
    @RequestMapping("/name")
    public Map getLoginName(){
        Map map= new HashMap();
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        map.put("loginname",username);
        return map;
    }

}
