package com.tannpdev.backend.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;
import java.util.Date;

@Data
@EqualsAndHashCode
public class ProductVariantResult {
    private Long id;

    private Long productId;

    private String sku;

    private String title;

    private BigDecimal price;

    private BigDecimal salePrice;

    private Integer stockQuantity;

    private String imageUrl;

    private Date createdAt;

    private Date updatedAt;

    private Long createdBy;

    private Long updatedBy;

    private Boolean isDeleted;
}
