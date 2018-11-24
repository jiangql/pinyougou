package com.pinyougou.search.service.impl;

import com.pinyougou.search.service.ItemSearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.jms.*;
import java.util.Arrays;

@Component
public class ItemDeleteListener implements MessageListener {
    @Autowired
    ItemSearchService itemSearchService;
    @Override
    public void onMessage(Message message) {
        ObjectMessage objectMessage= (ObjectMessage) message;
        try {
            Long[] goodsIds= (Long[]) objectMessage.getObject();
            itemSearchService.deleteByGoodsIds(Arrays.asList(goodsIds));
            System.out.println("删除索引成功");
        } catch (JMSException e) {
            e.printStackTrace();
        }
    }
}
