package com.tannpdev.backend.dao;

import com.tannpdev.backend.mbg.model.OrderItem;
import org.apache.ibatis.annotations.Param;
import java.util.List;

public interface OrderItemDao {
    int insertList(@Param("list") List<OrderItem> orderItemList);
}
