package com.tannpdev.backend.controller.v1;

import com.tannpdev.backend.common.api.CommonResult;
import com.tannpdev.backend.mbg.model.Category;
import com.tannpdev.backend.service.CategoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/category")
@Tag(name = "Category V1", description = "Các API quản lý danh mục (Phiên bản v1)")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @GetMapping("/list-all")
    @Operation(summary = "Lấy toàn bộ danh sách danh mục", description = "Lấy toàn bộ danh mục đang hoạt động")
    public CommonResult<List<Category>> listAll() {
        return CommonResult.success(categoryService.listAll());
    }
}
