package com.tannpdev.backend.dao;

import com.tannpdev.backend.dto.ProductDetailResult;
import com.tannpdev.backend.dto.client.ClientProductDetailResult;
import org.apache.ibatis.annotations.Param;

public interface ProductDao {
    ProductDetailResult getDetail(@Param("id") Long id);
    
    ClientProductDetailResult getClientDetailBySlug(@Param("slug") String slug);

    int deductStockByProductCode(@Param("productCode") String productCode, @Param("quantity") Integer quantity);
}
