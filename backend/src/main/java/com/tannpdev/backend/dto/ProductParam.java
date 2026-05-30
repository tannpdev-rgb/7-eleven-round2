package com.tannpdev.backend.dto;

import com.tannpdev.backend.mbg.model.Product;
import com.tannpdev.backend.mbg.model.ProductImage;
import com.tannpdev.backend.mbg.model.ProductVariant;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

@Data
@EqualsAndHashCode
public class ProductParam{
    @NotEmpty(message = "Tên sản phẩm không được để trống")
    @Schema(description = "Tên sản phẩm", requiredMode = Schema.RequiredMode.REQUIRED, example = "Bánh mì")
    private String name;
    @NotEmpty(message = "Mã sản phẩm không được để trống")
    @Schema(description = "Mã sản phẩm", requiredMode = Schema.RequiredMode.REQUIRED, example = "SP123")
    private String productCode;
    @NotEmpty(message = "Mô tả ngắn không được để trống")
    @Schema(description = "Mô tả ngắn", requiredMode = Schema.RequiredMode.REQUIRED, example = "Mô tả ngắn")
    private String shortDescription;
    @NotEmpty(message = "Mô tả chi tiết không được để trống")
    @Schema(description = "Mô tả chi tiết", requiredMode = Schema.RequiredMode.REQUIRED, example = "Mô tả chi tiết")
    private String description;
    @NotNull(message = "Trạng thái hoạt động không được để trống")
    @Schema(description = "Trạng thái hoạt động", requiredMode = Schema.RequiredMode.REQUIRED, example = "true")
    private Boolean isActive;
    @NotNull(message = "Danh mục không được để trống")
    @Schema(description = "Danh mục", requiredMode = Schema.RequiredMode.REQUIRED, example = "1")
    private Long categoryId;
    @NotNull(message = "Thương hiệu không được để trống")
    @Schema(description = "Thương hiệu", requiredMode = Schema.RequiredMode.REQUIRED, example = "1")
    private Long brandId;
    // list product images
    @Schema(description = "Danh sách ảnh sản phẩm", requiredMode = Schema.RequiredMode.REQUIRED, example = "[\n  {\n    \"imageUrl\": \"https://example.com/image.jpg\",\n    \"isThumbnail\": true\n  }\n]")
    @Valid
    List<ProductImageParam> productImageList;
    // product_variants
    @Schema(description = "Danh sách biến thể sản phẩm", requiredMode = Schema.RequiredMode.NOT_REQUIRED, example = "[]")
    List<ProductVariantParam> productVariantList;

    @Schema(description = "Giá sản phẩm (nếu không có biến thể)", example = "10000")
    private BigDecimal price;

    @Schema(description = "Giá khuyến mãi (nếu không có biến thể)", example = "9000")
    private BigDecimal salePrice;

    @Schema(description = "Tồn kho (nếu không có biến thể)", example = "100")
    private Integer stockQuantity;

    @Schema(description = "Index của biến thể mặc định", example = "0")
    private Integer defaultVariantIndex;
}
