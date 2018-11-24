package com.pinyougou.search.service.impl;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.pinyougou.pojo.TbItem;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jms.core.JmsTemplate;
import org.springframework.stereotype.Component;

import javax.jms.*;
import java.util.List;
import java.util.Map;

@Component
public class ItemSearchListener implements MessageListener {
    @Autowired
    private ItemSearchServiceImpl itemSearchService;

    @Override
    public void onMessage(Message message) {
        TextMessage textMessage = (TextMessage) message;
        try {
            String text = textMessage.getText();
            List<TbItem> list = JSON.parseArray(text, TbItem.class);
            for (TbItem item : list) {
                Map specMap = JSON.parseObject(item.getSpec());
                item.setSpecMap(specMap);
            }
            itemSearchService.importList(list);
            System.out.println("成功导入索引库");
        } catch (JMSException e) {
            e.printStackTrace();
        }


    }
}
