package com.pinyougou.search.service.impl;

import com.alibaba.dubbo.config.annotation.Service;
import com.pinyougou.pojo.TbItem;
import com.pinyougou.search.service.ItemSearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.solr.core.SolrTemplate;
import org.springframework.data.solr.core.query.*;
import org.springframework.data.solr.core.query.result.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
@Service(timeout = 5000)
public class ItemSearchServiceImpl implements ItemSearchService {
    @Autowired
    private SolrTemplate solrTemplate;
    @Autowired
    private RedisTemplate redisTemplate;
    @Override
    public Map<String, Object> search(Map searchMap) {
        Map<String,Object> map=new HashMap<>();
        //1.关键字查询
        map.putAll(searchList(searchMap));
        //2.根据关键字查询商品分类
        List<String> categoryList = searchCategoryList(searchMap);
        map.put("categoryList",categoryList);
        //3.调用方法查询品牌和规格
        String categoryName=(String)searchMap.get("category");
        if(!"".equals(categoryName)){//如果有分类名称
            map.putAll(searchBrandAndSpecList(categoryName));
        }else{//如果没有分类名称，按照第一个查询
            if(categoryList.size()>0){
                map.putAll(searchBrandAndSpecList(categoryList.get(0)));
            }
        }

        return map;
    }

    /**
     * 根据category分类名从缓存中获取brand和spec列表
     * @param category
     * @return
     */
    private Map searchBrandAndSpecList(String category){
        Map map = new HashMap();
        //从缓存中根据模板名获取模板ID
        Long typeId = (Long) redisTemplate.boundHashOps("itemCat").get(category);
        //根据模板id从缓存中获取brandList和specList
        if (typeId!=null){
            List brandList = (List) redisTemplate.boundHashOps("brandList").get(typeId);

            List specList = (List) redisTemplate.boundHashOps("specList").get(typeId);

            map.put("brandList",brandList);

            map.put("specList",specList);
        }

        return map;
    }

    /**
     * 查询分类列表
     * @param searchMap
     * @return
     */
    private List searchCategoryList(Map searchMap){
        List<String> list = new ArrayList();
        Query query = new SimpleQuery();
        //按关键字查询
        Criteria criteria = new Criteria("item_keywords").is(searchMap.get("keywords"));
        query.addCriteria(criteria);
        //设置分组选项
        GroupOptions groupOptions = new GroupOptions().addGroupByField("item_category");
        query.setGroupOptions(groupOptions);
        //获取分组页
        GroupPage<TbItem> page = solrTemplate.queryForGroupPage(query, TbItem.class);
        //根据列得到分组结果集
        GroupResult<TbItem> groupResult = page.getGroupResult("item_category");
        //获取分组入口页
        Page<GroupEntry<TbItem>> groupEntries = groupResult.getGroupEntries();
        //获取分组入口集
        List<GroupEntry<TbItem>> content = groupEntries.getContent();
        for (GroupEntry<TbItem> entry : content) {
            list.add(entry.getGroupValue());
        }
        return list;

    }

    /**
     * 查询关键字高亮设置
     * @param searchMap
     * @return
     */
    private Map searchList(Map searchMap){
        Map map= new HashMap();
        HighlightQuery query = new SimpleHighlightQuery();

        HighlightOptions highlightOptions = new HighlightOptions().addField("item_title");//设置高亮的域
        //高亮域设置前缀和后缀，搜索条件显示红色
        highlightOptions.setSimplePrefix("<em style='color:red'>");
        highlightOptions.setSimplePostfix("</em>");
        //设置高亮选项
        query.setHighlightOptions(highlightOptions);

        //处理搜索栏空格
        String keywords = (String) searchMap.get("keywords");
        searchMap.put("keywords", keywords.replace(" ", ""));

        //1.1添加关键字查询条件
        Criteria criteria = new Criteria("item_keywords").is(searchMap.get("keywords"));
        query.addCriteria(criteria);


        //1.2按照商品分类过滤
        if (!"".equals(searchMap.get("category"))){
            FilterQuery filterQuery = new SimpleFilterQuery();
            Criteria filterCriteria = new Criteria("item_category").is(searchMap.get("category"));
            filterQuery.addCriteria(filterCriteria);
            query.addFilterQuery(filterQuery);
        }
        //1.3按照品牌过滤
        if (!"".equals(searchMap.get("brand"))){
            FilterQuery filterQuery= new SimpleFilterQuery();
            Criteria filterCriteria = new Criteria("item_brand").is(searchMap.get("brand"));
            filterQuery.addCriteria(filterCriteria);
            query.addFilterQuery(filterQuery);
        }
        //1.4按照规格过滤
        if (searchMap.get("spec")!=null){
            Map<String,String> specMap= (Map<String, String>) searchMap.get("spec");
            for (String key : specMap.keySet()) {
                FilterQuery filterQuery = new SimpleFilterQuery();
                Criteria filterCriteria = new Criteria("item_spec_" + key).is(searchMap.get(key));
                filterQuery.addCriteria(filterCriteria);
                query.addFilterQuery(filterQuery);
            }
        }
        //1.5按照价格过滤
        if(!"".equals(searchMap.get("price"))){
            String priceStr = (String) searchMap.get("price");
            String[] price = priceStr.split("-");
            String minPrice = price[0];
            String maxPrice = price[1];
            if (!"0".equals(minPrice)){
                FilterQuery filterQuery= new SimpleFilterQuery();
                Criteria fiterCriteria = new Criteria("item_price").greaterThanEqual(minPrice);
                filterQuery.addCriteria(fiterCriteria);
                query.addFilterQuery(filterQuery);
            }
            if (!"*".equals(maxPrice)){
                FilterQuery filterQuery= new SimpleFilterQuery();
                Criteria fiterCriteria = new Criteria("item_price").lessThanEqual(maxPrice);
                filterQuery.addCriteria(fiterCriteria);
                query.addFilterQuery(filterQuery);
            }
        }

        //1.6添加分页条件过滤
        Integer pageNo = (Integer) searchMap.get("pageNo");
        if (pageNo==null){
            pageNo=1;
        }
        Integer pageSize = (Integer) searchMap.get("pageSize");
        if (pageSize==null){
            pageSize=20;
        }
        query.setOffset((pageNo-1)*pageSize);//从第几条记录查询
        query.setRows(pageSize);

        //1.7 按照价格排序
        String sortStr = (String) searchMap.get("sort");
        String sortFieldStr = (String) searchMap.get("sortField");
        if (sortStr!=null&&!"".equals(sortStr)){
            if ("ASC".equals(sortStr)){
                Sort sort = new Sort(Sort.Direction.ASC, "item_" + sortFieldStr);
                query.addSort(sort);
            }
            if ("DESC".equals(sortStr)){
                Sort sort = new Sort(Sort.Direction.DESC, "item_" + sortFieldStr);
                query.addSort(sort);
            }
        }

        HighlightPage<TbItem> page = solrTemplate.queryForHighlightPage(query, TbItem.class);
        //遍历高亮入口集
        for (HighlightEntry<TbItem> highlightEntry : page.getHighlighted()) {
            TbItem item = highlightEntry.getEntity();//获取原实体类
            if (highlightEntry.getHighlights().size()>0&&highlightEntry.getHighlights().get(0).getSnipplets().size()>0){
                item.setTitle(highlightEntry.getHighlights().get(0).getSnipplets().get(0));
            }
        }

        map.put("rows",page.getContent());
        map.put("totalPages", page.getTotalPages());//返回总页数
        map.put("total", page.getTotalElements());//返回总记录数

        return map;
    }
}
