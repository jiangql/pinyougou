package com.pinyougou.manager.controller;

import com.alibaba.dubbo.config.annotation.Reference;

import com.pinyougou.pojo.TbBrand;
import com.pinyougou.sellergoods.service.BrandService;
import entity.PageResult;
import entity.ResultMsg;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/brand")
public class BrandController {
    @Reference
    private BrandService brandService;

    @RequestMapping("/search")
    public PageResult findPage(Integer page, Integer rows,@RequestBody TbBrand brand) {
        return brandService.findPage(page, rows,brand);
    }

    @RequestMapping("/add")
    public ResultMsg add(@RequestBody TbBrand brand) {
        try {
            brandService.save(brand);
            return new ResultMsg(true, "新建成功");
        } catch (Exception e) {
            e.printStackTrace();
            return new ResultMsg(false, "新建失败");
        }
    }

    @RequestMapping("/findOne")
    public TbBrand findOne(Long id){
        return brandService.findOne(id);
    }

    @RequestMapping("/update")
    public ResultMsg update(@RequestBody TbBrand brand){
        try {
            brandService.update(brand);
            return new ResultMsg(true, "更新成功");
        } catch (Exception e) {
            e.printStackTrace();
            return new ResultMsg(false, "更新失败");
        }
    }

    @RequestMapping("/delete")
    public ResultMsg delete(Long[] ids){
        try {
            brandService.delete(ids);
            return new ResultMsg(true, "删除成功");
        } catch (Exception e) {
            e.printStackTrace();
            return new ResultMsg(false, "删除失败");
        }
    }
}
