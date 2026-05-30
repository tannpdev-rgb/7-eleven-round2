package com.tannpdev.backend.dto.client;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;

@Data
@EqualsAndHashCode
public class ClientProductVariantResult {
    private Long id;
    private Long productId;
    private String sku;
    private String title;
    private BigDecimal price;
    private BigDecimal salePrice;
    private Integer stockQuantity;
    private String imageUrl;
}
