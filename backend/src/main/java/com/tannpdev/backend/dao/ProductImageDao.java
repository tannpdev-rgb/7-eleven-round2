package com.tannpdev.backend.dao;

import com.tannpdev.backend.mbg.model.ProductImage;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface ProductImageDao {
    int insertList(@Param("list") List<ProductImage> productImageList);
}
