package com.tannpdev.backend.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.Date;
import java.util.List;

@Data
@EqualsAndHashCode
public class ProductDetailResult {
    private Long id;

    private String name;

    private String slug;

    private String productCode;

    private String shortDescription;

    private String description;

    private Boolean isActive;

    private Long categoryId;

    private Long brandId;

    private String categoryName;

    private String brandName;

    private String thumbnailUrl;

    private Date createdAt;

    private Date updatedAt;

    private Long createdBy;

    private Long updatedBy;

    private Boolean isDeleted;

    private java.math.BigDecimal price;

    private java.math.BigDecimal salePrice;

    private Integer stockQuantity;

    // list images
    private List<ProductImageResult> images;

    // list variants
    private List<ProductVariantResult> variants;
}
