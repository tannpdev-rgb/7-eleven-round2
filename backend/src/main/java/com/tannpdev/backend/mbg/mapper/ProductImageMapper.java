package com.tannpdev.backend.mbg.mapper;

import com.tannpdev.backend.mbg.model.ProductImage;
import com.tannpdev.backend.mbg.model.ProductImageExample;
import java.util.List;
import org.apache.ibatis.annotations.Param;

public interface ProductImageMapper {
    long countByExample(ProductImageExample example);

    int deleteByExample(ProductImageExample example);

    int deleteByPrimaryKey(Long id);

    int insert(ProductImage row);

    int insertSelective(ProductImage row);

    List<ProductImage> selectByExample(ProductImageExample example);

    ProductImage selectByPrimaryKey(Long id);

    int updateByExampleSelective(@Param("row") ProductImage row, @Param("example") ProductImageExample example);

    int updateByExample(@Param("row") ProductImage row, @Param("example") ProductImageExample example);

    int updateByPrimaryKeySelective(ProductImage row);

    int updateByPrimaryKey(ProductImage row);
}