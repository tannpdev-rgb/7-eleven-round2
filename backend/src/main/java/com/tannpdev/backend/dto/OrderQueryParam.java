package com.tannpdev.backend.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;

@Data
@EqualsAndHashCode
public class OrderQueryParam {

    @Schema(description = "Trạng thái đơn hàng", example = "PENDING")
    private String orderStatus;

    @Schema(description = "Trạng thái thanh toán", example = "PENDING")
    private String paymentStatus;

    @Schema(description = "Số điện thoại khách hàng (tìm kiếm gần đúng)", example = "0987")
    private String customerPhone;

    @Schema(description = "Email khách hàng (tìm kiếm gần đúng)", example = "nva@")
    private String customerEmail;

    @Schema(description = "Lọc từ ngày (yyyy-MM-dd)", example = "2026-01-01")
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date fromDate;

    @Schema(description = "Lọc đến ngày (yyyy-MM-dd)", example = "2026-12-31")
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date toDate;
}
