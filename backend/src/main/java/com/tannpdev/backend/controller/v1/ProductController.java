package com.tannpdev.backend.controller.v1;
import com.tannpdev.backend.common.api.CommonPage;
import com.tannpdev.backend.common.api.CommonResult;
import com.tannpdev.backend.dto.ProductDetailResult;
import com.tannpdev.backend.dto.ProductParam;
import com.tannpdev.backend.dto.ProductQueryParam;
import com.tannpdev.backend.mbg.model.Product;
import com.tannpdev.backend.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@Validated
@RestController
@RequestMapping("/api/v1/product")
@Tag(name = "Product V1", description = "API quản lý sản phẩm (CRUD) - Phiên bản v1")
public class ProductController {

    @Autowired
    private ProductService productService;

    @GetMapping("/list")
    @Operation(summary = "Lấy danh sách sản phẩm", description = "Phân trang, tìm kiếm theo keyword, lọc theo danh mục, thương hiệu, trạng thái")
    public CommonResult<CommonPage<Product>> list(
            ProductQueryParam productQueryParam,
            @Parameter(description = "Trang hiện tại")
            @RequestParam(value = "pageNum", defaultValue = "1") int pageNum,
            @Parameter(description = "Số lượng mỗi trang")
            @RequestParam(value = "pageSize", defaultValue = "10") int pageSize) {

        List<Product> list = productService.list(productQueryParam, pageNum, pageSize);
        return CommonResult.success(CommonPage.restPage(list));
    }
    @PostMapping("/create")
    @Operation(summary = "Tạo mới sản phẩm", description = "Tạo sản phẩm mới cùng danh sách ảnh và biến thể")
    public CommonResult<Integer> create(
            @Valid @RequestBody ProductParam request){
        int count = productService.create(request);
        if (count > 0) {
            return CommonResult.success(count);
        } else {
            return CommonResult.failed("Tạo sản phẩm thất bại");
        }
    }


    @DeleteMapping("/delete/{id}")
    @Operation(summary = "Xóa sản phẩm", description = "Xóa sản phẩm")
    public CommonResult<Integer> delete(
            @Parameter(description = "ID sản phẩm") @PathVariable Long id) {
        int count = productService.delete(id);
        if (count > 0) {
            return CommonResult.success(count);
        } else {
            return CommonResult.failed("Xóa sản phẩm thất bại");
        }
    }

    @GetMapping("/detail/{id}")
    @Operation(summary = "Chi tiết sản phẩm", description = "Chi tiết sản phẩm")
    public CommonResult<ProductDetailResult> detail(
            @Parameter(description = "ID sản phẩm") @PathVariable Long id) {
        ProductDetailResult result = productService.detail(id);
        return CommonResult.success(result);
    }

    @GetMapping("/check-sku")
    @Operation(summary = "Kiểm tra mã SKU", description = "Kiểm tra xem mã SKU đã tồn tại hay chưa. Trả về true nếu đã tồn tại.")
    public CommonResult<Boolean> checkSku(
            @Parameter(description = "Mã SKU cần kiểm tra") @RequestParam String sku) {
        boolean exists = productService.checkSkuExists(sku);
        return CommonResult.success(exists);
    }
}
