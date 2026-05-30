package com.tannpdev.backend.service;

import com.tannpdev.backend.dto.ProductDetailResult;
import com.tannpdev.backend.dto.ProductParam;
import com.tannpdev.backend.dto.ProductQueryParam;
import com.tannpdev.backend.dto.client.ClientProductDetailResult;
import com.tannpdev.backend.dto.client.ClientProductQueryParam;
import com.tannpdev.backend.dto.client.ClientProductResult;
import com.tannpdev.backend.mbg.model.Product;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface ProductService {
    @Transactional
    int create(ProductParam productParam);
    @Transactional
    int update();
    List<Product> list(ProductQueryParam productQueryParam, Integer pageNum, Integer pageSize);

    @Transactional
    int delete(Long productId);

    ProductDetailResult detail(Long productId);

    ClientProductDetailResult detailForClient(String slug);
    List<ClientProductResult> listForClient(ClientProductQueryParam queryParam, Integer pageNum, Integer pageSize);

    boolean checkSkuExists(String sku);
}
