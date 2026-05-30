package com.tannpdev.backend.controller.v1.client;

import com.tannpdev.backend.common.api.CommonResult;
import com.tannpdev.backend.dto.client.ClientCategoryResult;
import com.tannpdev.backend.service.CategoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/client/category")
@Tag(name = "Client Category", description = "API danh mục dành cho khách hàng")
public class ClientCategoryController {

    @Autowired
    private CategoryService categoryService;

    @GetMapping("/list")
    @Operation(summary = "Lấy danh sách danh mục", description = "Lấy tất cả danh mục đang hoạt động")
    public CommonResult<List<ClientCategoryResult>> list() {
        List<ClientCategoryResult> list = categoryService.listForClient();
        return CommonResult.success(list);
    }
}
