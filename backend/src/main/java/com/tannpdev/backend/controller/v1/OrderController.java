package com.tannpdev.backend.controller.v1;

import com.tannpdev.backend.common.api.CommonPage;
import com.tannpdev.backend.common.api.CommonResult;
import com.tannpdev.backend.dto.OrderParam;
import com.tannpdev.backend.dto.OrderQueryParam;
import com.tannpdev.backend.dto.OrderResult;
import com.tannpdev.backend.mbg.model.Order;
import com.tannpdev.backend.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/order")
@Tag(name = "Order V1", description = "Các API quản lý và đặt hàng (Phiên bản v1)")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping("/create")
    @Operation(summary = "Tạo đơn hàng mới", description = "Đặt hàng trực tiếp không thông qua đăng nhập")
    public CommonResult<OrderResult> createOrder(@Validated @RequestBody OrderParam orderParam) {
        return CommonResult.created(orderService.createOrder(orderParam));
    }

    @GetMapping("/list")
    @Operation(summary = "Lấy danh sách đơn hàng", description = "Phân trang, lọc theo trạng thái đơn hàng, thanh toán, SĐT, email, khoảng ngày. Sắp xếp mới nhất trước.")
    public CommonResult<CommonPage<Order>> list(
            OrderQueryParam queryParam,
            @Parameter(description = "Trang hiện tại")
            @RequestParam(value = "pageNum", defaultValue = "1") int pageNum,
            @Parameter(description = "Số lượng mỗi trang")
            @RequestParam(value = "pageSize", defaultValue = "10") int pageSize) {
        List<Order> list = orderService.list(queryParam, pageNum, pageSize);
        return CommonResult.success(CommonPage.restPage(list));
    }

    @GetMapping("/detail/{orderCode}")
    @Operation(summary = "Chi tiết đơn hàng", description = "Lấy chi tiết đơn hàng theo mã đơn hàng")
    public CommonResult<OrderResult> detail(
            @Parameter(description = "Mã đơn hàng") @PathVariable String orderCode) {
        OrderResult result = orderService.detail(orderCode);
        return CommonResult.success(result);
    }

    @PutMapping("/status/{orderCode}")
    @Operation(summary = "Cập nhật trạng thái đơn hàng", description = "Cập nhật trạng thái (PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED)")
    public CommonResult<Integer> updateStatus(
            @Parameter(description = "Mã đơn hàng") @PathVariable String orderCode,
            @Parameter(description = "Trạng thái mới") @RequestParam com.tannpdev.backend.common.enums.OrderStatusEnum status) {
        int count = orderService.updateStatus(orderCode, status);
        if (count > 0) {
            return CommonResult.success(count);
        } else {
            return CommonResult.failed("Cập nhật trạng thái thất bại");
        }
    }
}
