package com.tannpdev.backend.service.impl;
import com.github.pagehelper.PageHelper;
import com.github.slugify.Slugify;
import com.tannpdev.backend.common.api.ResultCode;
import com.tannpdev.backend.common.util.SlugUtil;
import com.tannpdev.backend.dao.ProductImageDao;
import com.tannpdev.backend.dao.ProductVariantDao;
import com.tannpdev.backend.dto.*;
import com.tannpdev.backend.dto.client.*;
import com.tannpdev.backend.mbg.mapper.*;
import com.tannpdev.backend.mbg.model.*;
import com.tannpdev.backend.service.ProductService;
import com.tannpdev.backend.exception.ApiException;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.lang.reflect.Method;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductServiceImpl implements ProductService {
    @Autowired
    private ProductMapper productMapper;

    @Autowired
    private ProductImageDao productImageDao;

    @Autowired
    private ProductVariantDao productVariantDao;

    @Autowired
    private CategoryMapper categoryMapper;

    @Autowired
    private BrandMapper brandMapper;

    @Autowired
    private ProductVariantMapper productVariantMapper;

    @Autowired
    private ProductImageMapper productImageMapper;

    @Autowired
    private com.tannpdev.backend.dao.ProductDao productDao;

    @Override
    public int create(ProductParam productParam) {
        int count;
        Product product = new Product();
        BeanUtils.copyProperties(productParam, product);
        String thumbnail = productParam.getProductImageList()
                .stream()
                .filter(ProductImageParam::getIsThumbnail)
                .map(ProductImageParam::getImageUrl)
                .findFirst()
                .orElse(null);
        product.setThumbnailUrl(thumbnail);
        product.setSlug(generateUniqueSlug(product.getName()));

        // check product_code in product db
       ProductExample example = new ProductExample();
       example.createCriteria().andProductCodeEqualTo(productParam.getProductCode()).andIsDeletedEqualTo(false);
        if (productMapper.countByExample(example) > 0) {
            throw new ApiException(ResultCode.VALIDATE_FAILED, "Mã sản phẩm đã tồn tại, vui lòng kiểm tra lại");
        }

        // check sku duplicate
        if (productParam.getProductVariantList() != null && !productParam.getProductVariantList().isEmpty()
                && checkListSkuExist(productParam.getProductVariantList())) {
            throw new ApiException(ResultCode.VALIDATE_FAILED, "Mã SKU đã tồn tại, vui lòng kiểm tra lại");
        }

        // find brandId and set brandName to product
        Brand brand = brandMapper.selectByPrimaryKey(productParam.getBrandId());
        if (brand == null) {
            throw new ApiException(ResultCode.NOT_FOUND, "Không tìm thấy thương hiệu");
        }
        product.setBrandName(brand.getName());

        // find categoryId and set categoryName to product
        Category category = categoryMapper.selectByPrimaryKey(productParam.getCategoryId());
        if (category == null) {
            throw new ApiException(ResultCode.NOT_FOUND, "Không tìm thấy danh mục");
        }
        product.setCategoryName(category.getName());

        if (productParam.getProductVariantList() == null || productParam.getProductVariantList().isEmpty()) {
            product.setPrice(productParam.getPrice());
            product.setSalePrice(productParam.getSalePrice());
            product.setStockQuantity(productParam.getStockQuantity());
        } else {
            int defaultIdx = productParam.getDefaultVariantIndex() != null ? productParam.getDefaultVariantIndex() : 0;
            if (defaultIdx >= 0 && defaultIdx < productParam.getProductVariantList().size()) {
                ProductVariantParam defVariant = productParam.getProductVariantList().get(defaultIdx);
                product.setPrice(defVariant.getPrice());
                product.setSalePrice(defVariant.getSalePrice());
                product.setStockQuantity(defVariant.getStockQuantity());
            }
        }

        productMapper.insertSelective(product);
        Long productId = product.getId();
        count = 1;

        // insert images
        relateAndInsertList(productImageDao,productParam.getProductImageList(),productId);

        // insert Variant
        relateAndInsertList(productVariantDao,productParam.getProductVariantList(),productId);
        return count;
    }

    private void relateAndInsertList(Object dao, List dataList, Long productId) {
        try {
            if (CollectionUtils.isEmpty(dataList)) return;
            for (Object item : dataList) {
//                Method setId = item.getClass().getMethod("setId", Long.class);
//                setId.invoke(item, (Long) null);
                Method setProductId = item.getClass().getMethod("setProductId", Long.class);
                setProductId.invoke(item, productId);
            }
            Method insertList = dao.getClass().getMethod("insertList", List.class);
            insertList.invoke(dao, dataList);
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage());
        }
    }

    @Override
    public int update() {
        return 0;
    }

    @Override
    public List<Product> list(ProductQueryParam productQueryParam, Integer pageNum, Integer pageSize) {
        PageHelper.startPage(pageNum, pageSize);
        ProductExample productExample = new ProductExample();
        ProductExample.Criteria criteria = productExample.createCriteria();
        criteria.andIsDeletedEqualTo(false);
        if (productQueryParam.getBrandId() != null){
            criteria.andBrandIdEqualTo(productQueryParam.getBrandId());
        }
        return productMapper.selectByExample(productExample);
    }

    @Override
    public int delete(Long productId) {
        Product product = productMapper.selectByPrimaryKey(productId);
        if (product == null || product.getIsDeleted()) {
            throw new ApiException(ResultCode.NOT_FOUND, "Không tìm thấy sản phẩm");
        }
        product.setIsDeleted(true);
        product.setIsActive(false);

        // set isDeleted = true for variant
        ProductVariantExample varExample = new ProductVariantExample();
        varExample.createCriteria().andProductIdEqualTo(productId).andIsDeletedEqualTo(false);
        ProductVariant softDeleteVar = new ProductVariant();
        softDeleteVar.setIsDeleted(true);
        productVariantMapper.updateByExampleSelective(softDeleteVar, varExample);

        // set isDeleted = true for image
        ProductImageExample imgExample = new ProductImageExample();
        imgExample.createCriteria().andProductIdEqualTo(productId).andIsDeletedEqualTo(false);
        ProductImage softDeleteImg = new ProductImage();
        softDeleteImg.setIsDeleted(true);
        productImageMapper.updateByExampleSelective(softDeleteImg, imgExample);

        return productMapper.updateByPrimaryKeySelective(product);
    }

    @Override
    public ProductDetailResult detail(Long productId) {
        ProductDetailResult result = productDao.getDetail(productId);
        if (result == null) {
            throw new ApiException(ResultCode.NOT_FOUND, "Không tìm thấy sản phẩm");
        }
        return result;
    }

    @Override
    public ClientProductDetailResult detailForClient(String slug) {
        ClientProductDetailResult result = productDao.getClientDetailBySlug(slug);
        if (result == null) {
            throw new ApiException(ResultCode.NOT_FOUND, "Không tìm thấy sản phẩm");
        }
        return result;
    }

    @Override
    public List<ClientProductResult> listForClient(ClientProductQueryParam queryParam, Integer pageNum, Integer pageSize) {
        PageHelper.startPage(pageNum, pageSize);
        ProductExample productExample = new ProductExample();
        ProductExample.Criteria criteria = productExample.createCriteria();
        criteria.andIsDeletedEqualTo(false);
        criteria.andIsActiveEqualTo(true);

        if (queryParam.getBrandId() != null) {
            criteria.andBrandIdEqualTo(queryParam.getBrandId());
        }

        if (queryParam.getCategoryId() != null) {
            criteria.andCategoryIdEqualTo(queryParam.getCategoryId());
        }

        if (queryParam.getCategorySlug() != null && !queryParam.getCategorySlug().isEmpty()) {
            CategoryExample categoryExample = new CategoryExample();
            categoryExample.createCriteria().andSlugEqualTo(queryParam.getCategorySlug()).andIsDeletedEqualTo(false);
            List<Category> categories = categoryMapper.selectByExample(categoryExample);
            if (!categories.isEmpty()) {
                criteria.andCategoryIdEqualTo(categories.get(0).getId());
            } else {
                return java.util.Collections.emptyList();
            }
        }

        if (queryParam.getKeyword() != null && !queryParam.getKeyword().isEmpty()) {
            criteria.andNameLike("%" + queryParam.getKeyword() + "%");
        }

        List<Product> products = productMapper.selectByExample(productExample);
        return products.stream().map(product -> {
            ClientProductResult result = new ClientProductResult();
            BeanUtils.copyProperties(product, result);
            return result;
        }).collect(Collectors.toList());
    }

    private boolean checkListSkuExist(List<ProductVariantParam> productVariantList) {
        List<String> skuList = productVariantList.stream()
                .map(ProductVariantParam::getSku)
                .collect(Collectors.toList());
        ProductVariantExample productVariantExample = new ProductVariantExample();
        ProductVariantExample.Criteria criteria = productVariantExample.createCriteria();
        criteria.andIsDeletedEqualTo(false);
        criteria.andSkuIn(skuList);
        return productVariantMapper.countByExample(productVariantExample) > 0;
    }

    // method generate slug not duplicate
    private String generateUniqueSlug(String slug) {
        ProductExample productExample = new ProductExample();
        ProductExample.Criteria criteria = productExample.createCriteria();
        criteria.andSlugLike(slug + "%" );
        long count = productMapper.countByExample(productExample);
        return SlugUtil.generateSlug(slug) + "-" + count;
    }

    @Override
    public boolean checkSkuExists(String sku) {
        if (sku == null || sku.trim().isEmpty()) {
            return false;
        }
        ProductVariantExample example = new ProductVariantExample();
        example.createCriteria().andSkuEqualTo(sku.trim()).andIsDeletedEqualTo(false);
        if (productVariantMapper.countByExample(example) > 0) {
            return true;
        }
        
        ProductExample productExample = new ProductExample();
        productExample.createCriteria().andProductCodeEqualTo(sku.trim()).andIsDeletedEqualTo(false);
        return productMapper.countByExample(productExample) > 0;
    }
}
