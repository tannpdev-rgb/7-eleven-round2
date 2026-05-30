package com.tannpdev.backend.dto.client;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;

@Data
@EqualsAndHashCode
public class ClientProductResult {
    private Long id;
    private String name;
    private String slug;
    private String productCode;
    private BigDecimal price;
    private BigDecimal salePrice;
    private String thumbnailUrl;
    private String categoryName;
    private String brandName;
    private Long categoryId;
    private Long brandId;
    private Integer stockQuantity;
    private Boolean hasVariants;
}
