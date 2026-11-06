package com.projectkit.controller;

import com.projectkit.dto.request.CreateOrderRequest;
import com.projectkit.dto.response.ApiResponse;
import com.projectkit.dto.response.OrderResponse;
import com.projectkit.dto.response.PagedResponse;
import com.projectkit.security.UserPrincipal;
import com.projectkit.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
@SecurityRequirement(name = "BearerAuth")
@Tag(name = "Orders", description = "Order placement and order history endpoints")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    @Operation(summary = "Create project kit order", description = "Calculates total amount directly from database and creates Razorpay order")
    public ResponseEntity<ApiResponse<OrderResponse>> createOrder(
            @Valid @RequestBody CreateOrderRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        OrderResponse orderResponse = orderService.createOrder(request, currentUser.getId());
        return ResponseEntity.status(HttpStatus.CREATED)
                .cacheControl(CacheControl.noStore().mustRevalidate())
                .body(ApiResponse.success("Order created successfully", orderResponse));
    }

    @GetMapping
    @Operation(summary = "Get user order history", description = "Retrieves paginated order history for the current authenticated user")
    public ResponseEntity<ApiResponse<PagedResponse<OrderResponse>>> getUserOrders(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        PagedResponse<OrderResponse> orders = orderService.getUserOrders(currentUser.getId(), page, size);
        return ResponseEntity.ok()
                .cacheControl(CacheControl.noStore().mustRevalidate())
                .body(ApiResponse.success(orders));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get order by ID", description = "Retrieves order details for specified ID")
    public ResponseEntity<ApiResponse<OrderResponse>> getOrderById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        OrderResponse order = orderService.getOrderById(id, currentUser.getId());
        return ResponseEntity.ok()
                .cacheControl(CacheControl.noStore().mustRevalidate())
                .body(ApiResponse.success(order));
    }

    @GetMapping("/number/{orderNumber}")
    @Operation(summary = "Get order by order number", description = "Retrieves order details by unique order reference number")
    public ResponseEntity<ApiResponse<OrderResponse>> getOrderByNumber(
            @PathVariable String orderNumber,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        OrderResponse order = orderService.getOrderByNumber(orderNumber, currentUser.getId());
        return ResponseEntity.ok()
                .cacheControl(CacheControl.noStore().mustRevalidate())
                .body(ApiResponse.success(order));
    }
}
