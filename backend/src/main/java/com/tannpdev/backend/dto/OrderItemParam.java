package com.tannpdev.backend.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode
public class OrderItemParam {
    @NotBlank(message = "SKU không được để trống")
    @Schema(description = "Mã SKU của sản phẩm", requiredMode = Schema.RequiredMode.REQUIRED, example = "IPHONE15PM")
    private String sku;

    @NotNull(message = "Số lượng không được để trống")
    @Min(value = 1, message = "Số lượng phải lớn hơn hoặc bằng 1")
    @Schema(description = "Số lượng mua", requiredMode = Schema.RequiredMode.REQUIRED, example = "1")
    private Integer quantity;
}
