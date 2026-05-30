package com.tannpdev.backend.dto.client;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;
import java.util.List;

@Data
@EqualsAndHashCode
public class ClientProductDetailResult {
    private Long id;
    private String name;
    private String slug;
    private String productCode;
    private String shortDescription;
    private String description;
    private BigDecimal price;
    private BigDecimal salePrice;
    private Integer stockQuantity;
    private Long categoryId;
    private Long brandId;
    private String categoryName;
    private String brandName;
    private String thumbnailUrl;
    
    // list images
    private List<ClientProductImageResult> images;

    // list variants
    private List<ClientProductVariantResult> variants;
}
