package com.tannpdev.backend.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import java.math.BigDecimal;

@Data
@EqualsAndHashCode
public class ProductVariantParam {
    private Long productId;
    @NotBlank(message = "Mã SKU không được để trống")
//    @Pattern(regexp = "^[a-zA-Z0-9]*$", message = "SKU must be alphanumeric")
    @Schema(description = "Mã SKU", requiredMode = Schema.RequiredMode.REQUIRED, example = "SKU123")
    private String sku;
    @NotBlank(message = "Tên biến thể không được để trống")
    @Schema(description = "Tên biến thể", requiredMode = Schema.RequiredMode.REQUIRED, example = "Tiêu đề")
    private String title;
    @NotNull(message = "Giá không được để trống")
    @DecimalMin(value = "0.00", inclusive = false, message = "Giá phải lớn hơn 0")
    @Schema(description = "Giá", requiredMode = Schema.RequiredMode.REQUIRED, example = "1000")
    private BigDecimal price;
    @DecimalMin(value = "0.00", inclusive = false, message = "Sale price must be greater than 0")
    @Schema(description = "Giá sale", requiredMode = Schema.RequiredMode.REQUIRED, example = "1000")
    private BigDecimal salePrice;
    @NotNull(message = "Số lượng tồn kho không được để trống")
    @Min(value = 0, message = "Số lượng tồn kho phải lớn hơn hoặc bằng 0")
    @Schema(description = "Số lượng tồn kho", requiredMode = Schema.RequiredMode.REQUIRED, example = "100")
    private Integer stockQuantity;
    // @Pattern(regexp = "^(https?:|ftp|file)://[-a-zA-Z0-9+&@#/%?=~_|!:,.;]*[-a-zA-Z0-9+&@#/%=~_|]$", message = "Invalid image URL")
    @Schema(description = "URL ảnh", requiredMode = Schema.RequiredMode.REQUIRED, example = "https://example.com/image.jpg")
    private String imageUrl;
}
