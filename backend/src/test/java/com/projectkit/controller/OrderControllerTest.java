package com.projectkit.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.projectkit.dto.request.CreateOrderRequest;
import com.projectkit.dto.response.OrderResponse;
import com.projectkit.dto.response.PagedResponse;
import com.projectkit.enums.OrderStatus;
import com.projectkit.security.UserPrincipal;
import com.projectkit.service.OrderService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.core.MethodParameter;
import org.springframework.http.MediaType;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
public class OrderControllerTest {

    private MockMvc mockMvc;

    @Mock
    private OrderService orderService;

    @InjectMocks
    private OrderController orderController;

    private ObjectMapper objectMapper = new ObjectMapper();
    private UserPrincipal testUser;

    @BeforeEach
    void setUp() {
        testUser = new UserPrincipal(
                100L,
                "student@college.edu",
                "hashedPass",
                "Alex Student",
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_STUDENT")),
                true
        );

        HandlerMethodArgumentResolver authPrincipalResolver = new HandlerMethodArgumentResolver() {
            @Override
            public boolean supportsParameter(MethodParameter parameter) {
                return parameter.hasParameterAnnotation(AuthenticationPrincipal.class);
            }

            @Override
            public Object resolveArgument(MethodParameter parameter,
                                          ModelAndViewContainer mavContainer,
                                          NativeWebRequest webRequest,
                                          WebDataBinderFactory binderFactory) {
                return testUser;
            }
        };

        mockMvc = MockMvcBuilders.standaloneSetup(orderController)
                .setCustomArgumentResolvers(authPrincipalResolver)
                .build();
    }

    @Test
    @DisplayName("POST /api/orders returns HTTP 201 Created with order response")
    void createOrder_ReturnsHttp201Created() throws Exception {
        CreateOrderRequest request = new CreateOrderRequest();
        request.setProjectIds(List.of(1L, 2L));

        OrderResponse response = new OrderResponse();
        response.setOrderId(55L);
        response.setOrderNumber("PK-2026-ORDER-99");
        response.setTotalAmount(new BigDecimal("1999.00"));
        response.setStatus(OrderStatus.PENDING);
        response.setRazorpayOrderId("order_rzp_mock123");

        when(orderService.createOrder(any(CreateOrderRequest.class), eq(100L))).thenReturn(response);

        mockMvc.perform(post("/api/orders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.orderNumber").value("PK-2026-ORDER-99"))
                .andExpect(jsonPath("$.data.totalAmount").value(1999.00))
                .andExpect(jsonPath("$.data.status").value("PENDING"))
                .andExpect(header().string("Cache-Control", "no-store, must-revalidate"));
    }

    @Test
    @DisplayName("GET /api/orders/number/{orderNumber} returns HTTP 200 with order details for post-payment polling")
    void getOrderByNumber_ReturnsHttp200() throws Exception {
        OrderResponse response = new OrderResponse();
        response.setOrderId(55L);
        response.setOrderNumber("PK-2026-ORDER-99");
        response.setTotalAmount(new BigDecimal("1999.00"));
        response.setStatus(OrderStatus.PAID);

        when(orderService.getOrderByNumber("PK-2026-ORDER-99", 100L)).thenReturn(response);

        mockMvc.perform(get("/api/orders/number/PK-2026-ORDER-99"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.status").value("PAID"))
                .andExpect(header().string("Cache-Control", "no-store, must-revalidate"));
    }

    @Test
    @DisplayName("GET /api/orders returns HTTP 200 with student's paginated order history")
    void getUserOrders_ReturnsHttp200() throws Exception {
        OrderResponse response = new OrderResponse();
        response.setOrderNumber("PK-2026-01");
        response.setStatus(OrderStatus.PAID);

        PagedResponse<OrderResponse> paged = new PagedResponse<>(
                List.of(response), 0, 10, 1L, 1, true
        );

        when(orderService.getUserOrders(100L, 0, 10)).thenReturn(paged);

        mockMvc.perform(get("/api/orders?page=0&size=10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.content[0].orderNumber").value("PK-2026-01"));
    }
}
