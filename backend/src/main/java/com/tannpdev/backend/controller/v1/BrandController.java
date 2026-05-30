package com.tannpdev.backend.controller.v1;

import com.tannpdev.backend.common.api.CommonResult;
import com.tannpdev.backend.mbg.model.Brand;
import com.tannpdev.backend.service.BrandService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/brand")
@Tag(name = "Brand V1", description = "Các API quản lý thương hiệu (Phiên bản v1)")
public class BrandController {

    @Autowired
    private BrandService brandService;

    @GetMapping("/list-all")
    @Operation(summary = "Lấy toàn bộ danh sách thương hiệu", description = "Lấy toàn bộ thương hiệu đang hoạt động")
    public CommonResult<List<Brand>> listAll() {
        return CommonResult.success(brandService.listAll());
    }
}
