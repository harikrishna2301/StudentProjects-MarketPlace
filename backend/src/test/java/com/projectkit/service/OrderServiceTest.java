package com.projectkit.service;

import com.projectkit.dto.request.CreateOrderRequest;
import com.projectkit.dto.response.OrderResponse;
import com.projectkit.dto.response.PagedResponse;
import com.projectkit.entity.Order;
import com.projectkit.entity.Project;
import com.projectkit.entity.User;
import com.projectkit.enums.AccountStatus;
import com.projectkit.enums.OrderStatus;
import com.projectkit.enums.Role;
import com.projectkit.exception.BadRequestException;
import com.projectkit.exception.UnauthorizedException;
import com.projectkit.repository.OrderRepository;
import com.projectkit.repository.ProjectRepository;
import com.projectkit.repository.UserRepository;
import com.projectkit.service.impl.OrderServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.test.util.ReflectionTestUtils;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private ProjectRepository projectRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private EmailService emailService;

    @InjectMocks
    private OrderServiceImpl orderService;

    private User studentUser;
    private Project project1;
    private Project project2;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(orderService, "razorpayKeyId", "rzp_test_placeholder");
        ReflectionTestUtils.setField(orderService, "razorpayKeySecret", "rzp_test_placeholder_secret");

        studentUser = new User();
        studentUser.setId(50L);
        studentUser.setEmail("student@college.edu");
        studentUser.setFullName("Arun Kumar");
        studentUser.setStatus(AccountStatus.ACTIVE);
        studentUser.setRole(Role.STUDENT);

        project1 = new Project();
        project1.setId(101L);
        project1.setTitle("Autonomous Mobile Robot");
        project1.setPrice(new BigDecimal("1200.00"));
        project1.setDiscountPrice(new BigDecimal("999.00"));
        project1.setActive(true);

        project2 = new Project();
        project2.setId(102L);
        project2.setTitle("Blockchain Land Registry");
        project2.setPrice(new BigDecimal("1500.00"));
        project2.setDiscountPrice(null);
        project2.setActive(true);
    }

    @Test
    @DisplayName("Create order calculates server-side prices accurately from database entities")
    void createOrder_CalculatesServerSidePricing() {
        CreateOrderRequest request = new CreateOrderRequest();
        request.setProjectIds(List.of(101L, 102L));

        when(userRepository.findById(50L)).thenReturn(Optional.of(studentUser));
        when(projectRepository.findById(101L)).thenReturn(Optional.of(project1));
        when(projectRepository.findById(102L)).thenReturn(Optional.of(project2));
        when(orderRepository.hasUserPurchasedProject(50L, 101L)).thenReturn(false);
        when(orderRepository.hasUserPurchasedProject(50L, 102L)).thenReturn(false);

        when(orderRepository.save(any(Order.class))).thenAnswer(invocation -> {
            Order o = invocation.getArgument(0);
            o.setId(5001L);
            return o;
        });

        OrderResponse response = orderService.createOrder(request, 50L);

        assertNotNull(response);
        // 999.00 (discounted project1) + 1500.00 (full price project2) = 2499.00
        assertEquals(new BigDecimal("2499.00"), response.getTotalAmount());
        assertEquals(OrderStatus.PENDING, response.getStatus());
        assertNotNull(response.getRazorpayOrderId());
        verify(orderRepository).save(any(Order.class));
    }

    @Test
    @DisplayName("Create order prevents re-purchasing an already owned project kit")
    void createOrder_AlreadyPurchased_ThrowsBadRequest() {
        CreateOrderRequest request = new CreateOrderRequest();
        request.setProjectIds(List.of(101L));

        when(userRepository.findById(50L)).thenReturn(Optional.of(studentUser));
        when(projectRepository.findById(101L)).thenReturn(Optional.of(project1));
        when(orderRepository.hasUserPurchasedProject(50L, 101L)).thenReturn(true);

        BadRequestException ex = assertThrows(BadRequestException.class, () ->
                orderService.createOrder(request, 50L)
        );
        assertTrue(ex.getMessage().contains("already purchased"));
        verify(orderRepository, never()).save(any(Order.class));
    }

    @Test
    @DisplayName("Get order by ID prevents IDOR by verifying customer ownership")
    void getOrderById_WrongUser_ThrowsUnauthorizedException() {
        Order foreignOrder = new Order();
        foreignOrder.setId(999L);
        foreignOrder.setOrderNumber("PK-FOREIGN-01");
        User anotherUser = new User();
        anotherUser.setId(99L); // Different user
        foreignOrder.setUser(anotherUser);

        when(orderRepository.findById(999L)).thenReturn(Optional.of(foreignOrder));

        assertThrows(UnauthorizedException.class, () ->
                orderService.getOrderById(999L, 50L) // student 50 attempting access to order of student 99
        );
    }

    @Test
    @DisplayName("Get order by orderNumber succeeds for authenticated owner (Polling flow)")
    void getOrderByNumber_Owner_Success() {
        Order order = new Order();
        order.setId(10L);
        order.setOrderNumber("PK-2026-TESTPOLL");
        order.setUser(studentUser);
        order.setStatus(OrderStatus.PAID);
        order.setTotalAmount(new BigDecimal("999.00"));

        when(orderRepository.findByOrderNumber("PK-2026-TESTPOLL")).thenReturn(Optional.of(order));

        OrderResponse res = orderService.getOrderByNumber("PK-2026-TESTPOLL", 50L);

        assertNotNull(res);
        assertEquals("PK-2026-TESTPOLL", res.getOrderNumber());
        assertEquals(OrderStatus.PAID, res.getStatus());
    }

    @Test
    @DisplayName("Get user orders returns paginated list of student orders")
    void getUserOrders_Success() {
        Order order = new Order();
        order.setId(10L);
        order.setOrderNumber("PK-2026-001");
        order.setUser(studentUser);
        order.setStatus(OrderStatus.PAID);
        order.setTotalAmount(new BigDecimal("999.00"));

        Page<Order> page = new PageImpl<>(List.of(order), PageRequest.of(0, 10), 1);
        when(orderRepository.findByUserIdOrderByCreatedAtDesc(eq(50L), any(Pageable.class))).thenReturn(page);

        PagedResponse<OrderResponse> result = orderService.getUserOrders(50L, 0, 10);

        assertNotNull(result);
        assertEquals(1, result.getContent().size());
        assertEquals("PK-2026-001", result.getContent().get(0).getOrderNumber());
    }
}
