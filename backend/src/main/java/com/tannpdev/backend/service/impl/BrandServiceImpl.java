package com.tannpdev.backend.service.impl;

import com.tannpdev.backend.mbg.mapper.BrandMapper;
import com.tannpdev.backend.mbg.model.Brand;
import com.tannpdev.backend.mbg.model.BrandExample;
import com.tannpdev.backend.service.BrandService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BrandServiceImpl implements BrandService {

    @Autowired
    private BrandMapper brandMapper;

    @Override
    public List<Brand> listAll() {
        BrandExample example = new BrandExample();
        example.createCriteria().andIsDeletedEqualTo(false);
        return brandMapper.selectByExample(example);
    }
}
