package com.tannpdev.backend.common.api;

import com.github.pagehelper.PageInfo;
import lombok.Data;

import java.util.List;

@Data
public class CommonPage<T> {
    private int page;
    private int size;
    private int totalPage;
    private long total;
    private List<T> list;

    public static <T> CommonPage<T> restPage(List<T> list) {
        CommonPage<T> result = new CommonPage<T>();
        PageInfo<T> pageInfo = new PageInfo<T>(list);
        result.setPage(pageInfo.getPageNum());
        result.setSize(pageInfo.getPageSize());
        result.setTotalPage(pageInfo.getPages());
        result.setTotal(pageInfo.getTotal());
        result.setList(pageInfo.getList());
        return result;
    }
}
