package com.tannpdev.backend.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.Date;

@Data
@EqualsAndHashCode
public class ProductImageParam {
    private Long productId;
    @NotBlank(message = "Ảnh sản phẩm không được để trống")
    // @Pattern(regexp = "^(https?|ftp|file)://[-a-zA-Z0-9+&@#/%?=~_|!:,.;]*[-a-zA-Z0-9+&@#/%=~_|]$", message = "Sai định dạng URL")
    @Schema(description = "URL ảnh", requiredMode = Schema.RequiredMode.REQUIRED, example = "https://example.com/image.jpg")
    private String imageUrl;
    //is_thumbnail
    @NotNull(message = "Ảnh đại diện không được để trống")
    @Schema(description = "Ảnh đại diện", requiredMode = Schema.RequiredMode.REQUIRED, example = "true")
    private Boolean isThumbnail;
    private Integer displayOrder;
}
