package com.tannpdev.backend.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

@Data
@EqualsAndHashCode
public class OrderResult {
    @Schema(description = "Mã đơn hàng", example = "ORD711-A1B2C3D4")
    private String orderCode;

    @Schema(description = "Tên khách hàng", example = "Nguyễn Văn A")
    private String customerName;

    @Schema(description = "Email khách hàng", example = "nva@example.com")
    private String customerEmail;

    @Schema(description = "Số điện thoại", example = "0987654321")
    private String customerPhone;

    @Schema(description = "Địa chỉ giao hàng", example = "123 Đường ABC, Quận 1, TP. HCM")
    private String shippingAddress;

    @Schema(description = "Tổng tiền hàng", example = "34990000.0")
    private BigDecimal totalAmount;

    @Schema(description = "Phí giao hàng", example = "0.0")
    private BigDecimal shippingFee;

    @Schema(description = "Số tiền giảm giá", example = "0.0")
    private BigDecimal discountAmount;

    @Schema(description = "Tổng tiền thanh toán", example = "34990000.0")
    private BigDecimal finalAmount;

    @Schema(description = "Phương thức thanh toán", example = "COD")
    private String paymentMethod;

    @Schema(description = "Trạng thái thanh toán", example = "PENDING")
    private String paymentStatus;

    @Schema(description = "Trạng thái đơn hàng", example = "PENDING")
    private String orderStatus;

    @Schema(description = "Thời gian tạo", example = "2026-05-30T10:00:00.000Z")
    private Date createdAt;

    @Schema(description = "Danh sách sản phẩm")
    private List<OrderItemResult> items;
}
