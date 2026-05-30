package com.tannpdev.backend.mbg.mapper;

import com.tannpdev.backend.mbg.model.ProductVariant;
import com.tannpdev.backend.mbg.model.ProductVariantExample;
import java.util.List;
import org.apache.ibatis.annotations.Param;

public interface ProductVariantMapper {
    long countByExample(ProductVariantExample example);

    int deleteByExample(ProductVariantExample example);

    int deleteByPrimaryKey(Long id);

    int insert(ProductVariant row);

    int insertSelective(ProductVariant row);

    List<ProductVariant> selectByExample(ProductVariantExample example);

    ProductVariant selectByPrimaryKey(Long id);

    int updateByExampleSelective(@Param("row") ProductVariant row, @Param("example") ProductVariantExample example);

    int updateByExample(@Param("row") ProductVariant row, @Param("example") ProductVariantExample example);

    int updateByPrimaryKeySelective(ProductVariant row);

    int updateByPrimaryKey(ProductVariant row);
}