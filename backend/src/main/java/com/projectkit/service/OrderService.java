package com.projectkit.service;

import com.projectkit.dto.request.CreateOrderRequest;
import com.projectkit.dto.response.OrderResponse;
import com.projectkit.dto.response.PagedResponse;

public interface OrderService {

    OrderResponse createOrder(CreateOrderRequest request, Long userId);

    OrderResponse getOrderById(Long orderId, Long userId);

    OrderResponse getOrderByNumber(String orderNumber, Long userId);

    PagedResponse<OrderResponse> getUserOrders(Long userId, int page, int size);
}
