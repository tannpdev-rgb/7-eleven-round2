package com.tannpdev.backend.service.impl;

import com.github.pagehelper.PageHelper;
import com.tannpdev.backend.common.Constants;
import com.tannpdev.backend.common.api.CommonResult;
import com.tannpdev.backend.common.api.ResultCode;
import com.tannpdev.backend.dao.OrderItemDao;
import com.tannpdev.backend.dao.ProductVariantDao;
import com.tannpdev.backend.dto.OrderItemParam;
import com.tannpdev.backend.dto.OrderItemResult;
import com.tannpdev.backend.dto.OrderParam;
import com.tannpdev.backend.dto.OrderQueryParam;
import com.tannpdev.backend.dto.OrderResult;
import com.tannpdev.backend.exception.ApiException;
import com.tannpdev.backend.mbg.mapper.OrderMapper;
import com.tannpdev.backend.mbg.model.Order;
import com.tannpdev.backend.mbg.model.OrderExample;
import com.tannpdev.backend.mbg.model.OrderItem;
import com.tannpdev.backend.mbg.model.ProductVariant;
import com.tannpdev.backend.mbg.model.ProductVariantExample;
import com.tannpdev.backend.mbg.mapper.ProductVariantMapper;
import com.tannpdev.backend.mbg.mapper.ProductMapper;
import com.tannpdev.backend.mbg.model.Product;
import com.tannpdev.backend.mbg.model.ProductExample;
import com.tannpdev.backend.service.OrderService;
import com.tannpdev.backend.common.enums.OrderStatusEnum;
import com.tannpdev.backend.mbg.model.OrderItemExample;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private ProductVariantMapper productVariantMapper;

    @Autowired
    private ProductVariantDao productVariantDao;

    @Autowired
    private OrderMapper orderMapper;

    @Autowired
    private OrderItemDao orderItemDao;

    @Autowired
    private com.tannpdev.backend.mbg.mapper.OrderItemMapper orderItemMapper;

    @Autowired
    private ProductMapper productMapper;

    @Autowired
    private com.tannpdev.backend.dao.ProductDao productDao;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public OrderResult createOrder(OrderParam orderParam) {


        /** ===================== FLOW =================

         * 1. Validation

         * 2. Kiểm tra tồn kho và tính toán giá

         * 3. Trừ kho DB-level

         * 4. Tạo Order

         * 5. Tạo OrderItem

         * 6. Map dữ liệu trả về

         ================================================*/

        if (orderParam.getItems() == null || orderParam.getItems().isEmpty()) {
            throw new ApiException(ResultCode.VALIDATE_FAILED,"Danh sách sản phẩm không được để trống");
        }

        // 1. Lấy danh sách sku từ request
        List<String> skuList = orderParam.getItems().stream()
                .map(OrderItemParam::getSku)
                .collect(Collectors.toList());

        // 2. Truy vấn ProductVariant từ DB bằng sku
        ProductVariantExample example = new ProductVariantExample();
        example.createCriteria().andSkuIn(skuList).andIsDeletedEqualTo(false);
        List<ProductVariant> variants = productVariantMapper.selectByExample(example);
        Map<String, ProductVariant> variantMap = variants.stream()
                .collect(Collectors.toMap(ProductVariant::getSku, v -> v));

        // 2.1 Truy vấn Product từ DB bằng productCode cho các sku không tìm thấy trong variant
        List<String> missingSkus = skuList.stream()
                .filter(sku -> !variantMap.containsKey(sku))
                .collect(Collectors.toList());
        Map<String, Product> productMap = new HashMap<>();
        if (!missingSkus.isEmpty()) {
            ProductExample pExample = new ProductExample();
            pExample.createCriteria().andProductCodeIn(missingSkus).andIsDeletedEqualTo(false);
            List<Product> products = productMapper.selectByExample(pExample);
            productMap = products.stream()
                    .collect(Collectors.toMap(Product::getProductCode, p -> p));
        }

        // 3. Khởi tạo tính toán
        BigDecimal totalAmount = BigDecimal.ZERO;
        List<OrderItem> orderItemsToSave = new ArrayList<>();
        List<OrderItemResult> itemResults = new ArrayList<>();
        Date now = new Date();

        for (OrderItemParam itemParam : orderParam.getItems()) {
            ProductVariant variant = variantMap.get(itemParam.getSku());
            Product product = productMap.get(itemParam.getSku());
            
            if (variant == null && product == null) {
                throw new ApiException(ResultCode.VALIDATE_FAILED,"Sản phẩm với SKU/Mã " + itemParam.getSku() + " không tồn tại");   
            }

            Integer stockQuantity = variant != null ? variant.getStockQuantity() : product.getStockQuantity();
            String title = variant != null ? variant.getTitle() : product.getName();
            
            if (stockQuantity < itemParam.getQuantity()) {
                throw new ApiException(ResultCode.VALIDATE_FAILED,"Sản phẩm " + title + " không đủ số lượng tồn kho (Còn lại: " + stockQuantity + ")");
            }

            // Tính giá ưu tiên salePrice
            BigDecimal salePrice = variant != null ? variant.getSalePrice() : product.getSalePrice();
            BigDecimal regularPrice = variant != null ? variant.getPrice() : product.getPrice();
            
            BigDecimal price = salePrice != null && salePrice.compareTo(BigDecimal.ZERO) > 0
                    ? salePrice
                    : regularPrice;
            
            BigDecimal quantityBD = new BigDecimal(itemParam.getQuantity());
            BigDecimal itemTotalPrice = price.multiply(quantityBD);
            totalAmount = totalAmount.add(itemTotalPrice);

            // Trừ kho DB-level
            if (variant != null) {
                int updatedRows = productVariantDao.deductStockBySku(itemParam.getSku(), itemParam.getQuantity());
                if (updatedRows == 0) {
                    throw new ApiException(ResultCode.FAILED,"Đã có lỗi hệ thống xảy ra khi trừ kho.");
                }
            } else {
                int updatedRows = productDao.deductStockByProductCode(itemParam.getSku(), itemParam.getQuantity());
                if (updatedRows == 0) {
                    throw new ApiException(ResultCode.FAILED,"Đã có lỗi hệ thống xảy ra khi trừ kho.");
                }
            }

            // Chuẩn bị OrderItem
            OrderItem orderItem = new OrderItem();
            if (variant != null) {
                orderItem.setProductVariantId(variant.getId());
            }
            orderItem.setProductName(title);
            orderItem.setSku(itemParam.getSku());
            orderItem.setPrice(price);
            orderItem.setQuantity(itemParam.getQuantity());
            orderItem.setTotalPrice(itemTotalPrice);
            orderItem.setCreatedAt(now);
            orderItem.setUpdatedAt(now);
            orderItemsToSave.add(orderItem);

            // Chuẩn bị OrderItemResult
            OrderItemResult itemResult = new OrderItemResult();
            itemResult.setSku(itemParam.getSku());
            itemResult.setProductName(title);
            itemResult.setPrice(price);
            itemResult.setQuantity(itemParam.getQuantity());
            itemResult.setTotalPrice(itemTotalPrice);
            itemResults.add(itemResult);
        }

        // 4. Khởi tạo Order
        BigDecimal shippingFee = BigDecimal.ZERO;
        BigDecimal discountAmount = BigDecimal.ZERO;
        BigDecimal finalAmount = totalAmount.add(shippingFee).subtract(discountAmount);
        
        String orderCode = generateOrderCode();

        Order order = new Order();
        order.setOrderCode(orderCode);
        order.setCustomerName(orderParam.getCustomerName());
        order.setCustomerEmail(orderParam.getCustomerEmail());
        order.setCustomerPhone(orderParam.getCustomerPhone());
        order.setShippingAddress(orderParam.getShippingAddress());
        order.setBillingAddress(orderParam.getBillingAddress());
        order.setPaymentMethod(orderParam.getPaymentMethod());
        order.setNote(orderParam.getNote());
        order.setTotalAmount(totalAmount);
        order.setShippingFee(shippingFee);
        order.setDiscountAmount(discountAmount);
        order.setFinalAmount(finalAmount);
        order.setOrderStatus("PENDING");
        order.setPaymentStatus("PENDING");
        order.setCreatedAt(now);
        order.setUpdatedAt(now);
        order.setIsDeleted(false);

        // Lưu Order để lấy id
        orderMapper.insertSelective(order);

        // 5. Cập nhật orderId cho danh sách OrderItem và lưu xuống DB
        for (OrderItem item : orderItemsToSave) {
            item.setOrderId(order.getId());
        }
        orderItemDao.insertList(orderItemsToSave);

        // 6. Map dữ liệu trả về OrderResult
        OrderResult result = new OrderResult();
        result.setOrderCode(orderCode);
        result.setCustomerName(order.getCustomerName());
        result.setCustomerEmail(order.getCustomerEmail());
        result.setCustomerPhone(order.getCustomerPhone());
        result.setShippingAddress(order.getShippingAddress());
        result.setTotalAmount(order.getTotalAmount());
        result.setShippingFee(order.getShippingFee());
        result.setDiscountAmount(order.getDiscountAmount());
        result.setFinalAmount(order.getFinalAmount());
        result.setPaymentMethod(order.getPaymentMethod());
        result.setPaymentStatus(order.getPaymentStatus());
        result.setOrderStatus(order.getOrderStatus());
        result.setCreatedAt(order.getCreatedAt());
        result.setItems(itemResults);

        return result;
    }

    @Override
    public List<Order> list(OrderQueryParam queryParam, int pageNum, int pageSize) {
        PageHelper.startPage(pageNum, pageSize);
        OrderExample example = new OrderExample();
        example.setOrderByClause("created_at DESC");
        OrderExample.Criteria criteria = example.createCriteria();
        criteria.andIsDeletedEqualTo(false);

        if (queryParam.getOrderStatus() != null && !queryParam.getOrderStatus().isEmpty()) {
            criteria.andOrderStatusEqualTo(queryParam.getOrderStatus());
        }
        if (queryParam.getPaymentStatus() != null && !queryParam.getPaymentStatus().isEmpty()) {
            criteria.andPaymentStatusEqualTo(queryParam.getPaymentStatus());
        }
        if (queryParam.getCustomerPhone() != null && !queryParam.getCustomerPhone().isEmpty()) {
            criteria.andCustomerPhoneLike("%" + queryParam.getCustomerPhone() + "%");
        }
        if (queryParam.getCustomerEmail() != null && !queryParam.getCustomerEmail().isEmpty()) {
            criteria.andCustomerEmailLike("%" + queryParam.getCustomerEmail() + "%");
        }
        if (queryParam.getFromDate() != null) {
            criteria.andCreatedAtGreaterThanOrEqualTo(queryParam.getFromDate());
        }
        if (queryParam.getToDate() != null) {
            criteria.andCreatedAtLessThanOrEqualTo(queryParam.getToDate());
        }

        return orderMapper.selectByExample(example);
    }

    private String generateOrderCode() {
        return Constants.PREFIX_ORDER + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    @Override
    public OrderResult detail(String orderCode) {
        OrderExample orderExample = new OrderExample();
        orderExample.createCriteria().andOrderCodeEqualTo(orderCode).andIsDeletedEqualTo(false);
        List<Order> orders = orderMapper.selectByExample(orderExample);
        if (orders == null || orders.isEmpty()) {
            throw new ApiException(ResultCode.NOT_FOUND, "Không tìm thấy đơn hàng");
        }
        Order order = orders.get(0);

        OrderItemExample orderItemExample = new OrderItemExample();
        orderItemExample.createCriteria().andOrderIdEqualTo(order.getId());
        List<OrderItem> items = orderItemMapper.selectByExample(orderItemExample);

        List<OrderItemResult> itemResults = items.stream().map(item -> {
            OrderItemResult ir = new OrderItemResult();
            ir.setSku(item.getSku());
            ir.setProductName(item.getProductName());
            ir.setPrice(item.getPrice());
            ir.setQuantity(item.getQuantity());
            ir.setTotalPrice(item.getTotalPrice());
            return ir;
        }).collect(Collectors.toList());

        OrderResult result = new OrderResult();
        result.setOrderCode(order.getOrderCode());
        result.setCustomerName(order.getCustomerName());
        result.setCustomerEmail(order.getCustomerEmail());
        result.setCustomerPhone(order.getCustomerPhone());
        result.setShippingAddress(order.getShippingAddress());
        result.setTotalAmount(order.getTotalAmount());
        result.setShippingFee(order.getShippingFee());
        result.setDiscountAmount(order.getDiscountAmount());
        result.setFinalAmount(order.getFinalAmount());
        result.setPaymentMethod(order.getPaymentMethod());
        result.setPaymentStatus(order.getPaymentStatus());
        result.setOrderStatus(order.getOrderStatus());
        result.setCreatedAt(order.getCreatedAt());
        result.setItems(itemResults);

        return result;
    }

    @Override
    public int updateStatus(String orderCode, OrderStatusEnum status) {
        OrderExample orderExample = new OrderExample();
        orderExample.createCriteria().andOrderCodeEqualTo(orderCode).andIsDeletedEqualTo(false);
        List<Order> orders = orderMapper.selectByExample(orderExample);
        if (orders == null || orders.isEmpty()) {
            throw new ApiException(ResultCode.NOT_FOUND, "Không tìm thấy đơn hàng");
        }
        Order order = orders.get(0);
        order.setOrderStatus(status.name());
        order.setUpdatedAt(new Date());
        return orderMapper.updateByPrimaryKeySelective(order);
    }
}
