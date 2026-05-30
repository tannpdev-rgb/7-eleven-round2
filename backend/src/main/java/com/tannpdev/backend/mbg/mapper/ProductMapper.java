package com.tannpdev.backend.mbg.mapper;

import com.tannpdev.backend.mbg.model.Product;
import com.tannpdev.backend.mbg.model.ProductExample;
import java.util.List;
import org.apache.ibatis.annotations.Param;

public interface ProductMapper {
    long countByExample(ProductExample example);

    int deleteByExample(ProductExample example);

    int deleteByPrimaryKey(Long id);

    int insert(Product row);

    int insertSelective(Product row);

    List<Product> selectByExample(ProductExample example);

    Product selectByPrimaryKey(Long id);

    int updateByExampleSelective(@Param("row") Product row, @Param("example") ProductExample example);

    int updateByExample(@Param("row") Product row, @Param("example") ProductExample example);

    int updateByPrimaryKeySelective(Product row);

    int updateByPrimaryKey(Product row);
}