package com.tannpdev.backend.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;

@Data
@EqualsAndHashCode
public class OrderItemResult {
    @Schema(description = "Mã SKU", example = "IPHONE15PM")
    private String sku;

    @Schema(description = "Tên sản phẩm", example = "Điện thoại iPhone 15 Pro Max")
    private String productName;

    @Schema(description = "Giá sản phẩm tại thời điểm mua", example = "34990000.0")
    private BigDecimal price;

    @Schema(description = "Số lượng", example = "1")
    private Integer quantity;

    @Schema(description = "Thành tiền", example = "34990000.0")
    private BigDecimal totalPrice;
}
