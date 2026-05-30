package com.tannpdev.backend.dao;

import com.tannpdev.backend.mbg.model.ProductImage;
import com.tannpdev.backend.mbg.model.ProductVariant;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface ProductVariantDao {
    int insertList(@Param("list")List<ProductVariant> productVariantList);

    int deductStockBySku(@Param("sku") String sku, @Param("quantity") Integer quantity);
}
