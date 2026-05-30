package com.tannpdev.backend.service.impl;

import com.tannpdev.backend.dto.client.ClientCategoryResult;
import com.tannpdev.backend.mbg.mapper.CategoryMapper;
import com.tannpdev.backend.mbg.model.Category;
import com.tannpdev.backend.mbg.model.CategoryExample;
import com.tannpdev.backend.service.CategoryService;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryServiceImpl implements CategoryService {

    @Autowired
    private CategoryMapper categoryMapper;

    @Override
    public List<Category> listAll() {
        CategoryExample example = new CategoryExample();
        example.createCriteria().andIsDeletedEqualTo(false);
        return categoryMapper.selectByExample(example);
    }

    @Override
    public List<ClientCategoryResult> listForClient() {
        CategoryExample example = new CategoryExample();
        example.createCriteria().andIsDeletedEqualTo(false);
        List<Category> categories = categoryMapper.selectByExample(example);
        return categories.stream().map(cat -> {
            ClientCategoryResult dto = new ClientCategoryResult();
            BeanUtils.copyProperties(cat, dto);
            return dto;
        }).collect(Collectors.toList());
    }
}
