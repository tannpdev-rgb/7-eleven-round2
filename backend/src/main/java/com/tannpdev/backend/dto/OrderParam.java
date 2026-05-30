package com.tannpdev.backend.dto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;
import lombok.EqualsAndHashCode;
import java.util.List;

@Data
@EqualsAndHashCode
public class OrderParam {

    @NotBlank(message = "Tên khách hàng không được để trống")
    @Schema(description = "Tên khách hàng", requiredMode = Schema.RequiredMode.REQUIRED, example = "Nguyễn Văn A")
    private String customerName;

    @NotBlank(message = "Email không được để trống")
    @Email(message = "Email không hợp lệ")
    @Schema(description = "Email khách hàng", requiredMode = Schema.RequiredMode.REQUIRED, example = "nva@example.com")
    private String customerEmail;

    @NotBlank(message = "Số điện thoại không được để trống")
    @Schema(description = "Số điện thoại khách hàng", requiredMode = Schema.RequiredMode.REQUIRED, example = "0987654321")
    private String customerPhone;

    @NotBlank(message = "Địa chỉ giao hàng không được để trống")
    @Schema(description = "Địa chỉ giao hàng", requiredMode = Schema.RequiredMode.REQUIRED, example = "123 Đường ABC, Quận 1, TP. HCM")
    private String shippingAddress;

    @Schema(description = "Địa chỉ thanh toán (có thể trống)", example = "123 Đường ABC, Quận 1, TP. HCM")
    private String billingAddress;

    @NotBlank(message = "Phương thức thanh toán không được để trống")
    @Schema(description = "Phương thức thanh toán", requiredMode = Schema.RequiredMode.REQUIRED, example = "COD")
    private String paymentMethod;

    @Schema(description = "Ghi chú đơn hàng", example = "Giao vào buổi sáng")
    private String note;

    @NotEmpty(message = "Danh sách sản phẩm không được để trống")
    @Valid
    @Schema(description = "Danh sách sản phẩm mua", requiredMode = Schema.RequiredMode.REQUIRED)
    private List<OrderItemParam> items;
}
