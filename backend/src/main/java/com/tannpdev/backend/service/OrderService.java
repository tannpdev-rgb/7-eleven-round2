package com.tannpdev.backend.service;

import com.tannpdev.backend.dto.OrderParam;
import com.tannpdev.backend.dto.OrderQueryParam;
import com.tannpdev.backend.dto.OrderResult;
import com.tannpdev.backend.mbg.model.Order;

import java.util.List;
import com.tannpdev.backend.common.enums.OrderStatusEnum;

public interface OrderService {
    OrderResult createOrder(OrderParam orderParam);
    List<Order> list(OrderQueryParam queryParam, int pageNum, int pageSize);
    OrderResult detail(String orderCode);
    int updateStatus(String orderCode, OrderStatusEnum status);
}
