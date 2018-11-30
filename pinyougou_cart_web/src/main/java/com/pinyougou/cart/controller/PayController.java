package com.pinyougou.cart.controller;

import com.alibaba.dubbo.config.annotation.Reference;
import com.jql.util.IdWorker;
import com.pinyougou.order.service.OrderService;
import com.pinyougou.pay.service.WeixinPayService;
import com.pinyougou.pojo.TbPayLog;
import entity.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/pay")
public class PayController {
    @Reference
    private WeixinPayService weixinPayService;

    @Reference
    private OrderService orderService;

    @Autowired
    private IdWorker idWorker;

    /**
     * 生成二维码
     * @return
     */
    @RequestMapping("/createNative")
    public Map createNative(){
        //获取当前用户
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
        //查询redis的支付日志
        TbPayLog payLog = orderService.searchPayLogFromRedis(userId);
        if (payLog!=null){
            return weixinPayService.createNative(idWorker.nextId()+"","1");
        }else {
            return new HashMap();
        }
    }

    @RequestMapping("/queryPayStatus")
    public Result queryPayStatus(String out_trade_no){
        Result result=null;
        int i = 0;
        while (true){
            Map map = weixinPayService.queryPayStatus(out_trade_no);
            if (map==null){//出错
                result=new Result(false,"支付出错");
                break;
            }
            if (map.get("trade_state").equals("SUCCESS")){//支付成功
                result= new Result(true,"支付成功");
                //修改订单状态
                orderService.updateOrderStatus(out_trade_no, (String) map.get("transaction_id"));
                break;
            }

            try {
                Thread.sleep(3000L);//间隔三秒，发送一次请求
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            i++;
            if (i>=100){
                result=new Result(false,"二维码超时");
                break;
            }
        }
        return result;
    }

}
