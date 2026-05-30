package com.tannpdev.backend.controller.v1.client;

import com.tannpdev.backend.common.api.CommonPage;
import com.tannpdev.backend.common.api.CommonResult;
import com.tannpdev.backend.dto.client.ClientProductDetailResult;
import com.tannpdev.backend.dto.client.ClientProductQueryParam;
import com.tannpdev.backend.dto.client.ClientProductResult;
import com.tannpdev.backend.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/client/product")
@Tag(name = "Client Product", description = "API sản phẩm dành cho khách hàng")
public class ClientProductController {

    @Autowired
    private ProductService productService;

    @GetMapping("/list")
    @Operation(summary = "Lấy danh sách sản phẩm", description = "Tìm kiếm và lọc theo danh mục, từ khóa")
    public CommonResult<CommonPage<ClientProductResult>> list(
            ClientProductQueryParam queryParam,
            @Parameter(description = "Trang hiện tại")
            @RequestParam(value = "pageNum", defaultValue = "1") int pageNum,
            @Parameter(description = "Số lượng mỗi trang")
            @RequestParam(value = "pageSize", defaultValue = "12") int pageSize) {

        List<ClientProductResult> list = productService.listForClient(queryParam, pageNum, pageSize);
        return CommonResult.success(CommonPage.restPage(list));
    }

    @GetMapping("/detail/{slug}")
    @Operation(summary = "Chi tiết sản phẩm", description = "Lấy chi tiết sản phẩm bằng slug")
    public CommonResult<ClientProductDetailResult> detail(
            @Parameter(description = "Slug sản phẩm") @PathVariable String slug) {
        ClientProductDetailResult result = productService.detailForClient(slug);
        return CommonResult.success(result);
    }
}
