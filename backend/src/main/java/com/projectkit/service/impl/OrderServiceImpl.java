package com.projectkit.service.impl;

import com.projectkit.dto.request.CreateOrderRequest;
import com.projectkit.dto.response.OrderResponse;
import com.projectkit.dto.response.PagedResponse;
import com.projectkit.entity.Order;
import com.projectkit.entity.OrderItem;
import com.projectkit.entity.Project;
import com.projectkit.entity.User;
import com.projectkit.enums.OrderStatus;
import com.projectkit.exception.BadRequestException;
import com.projectkit.exception.ResourceNotFoundException;
import com.projectkit.exception.UnauthorizedException;
import com.projectkit.repository.OrderRepository;
import com.projectkit.repository.ProjectRepository;
import com.projectkit.repository.UserRepository;
import com.projectkit.service.OrderService;
import com.razorpay.RazorpayClient;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class OrderServiceImpl implements OrderService {

    private static final Logger logger = LoggerFactory.getLogger(OrderServiceImpl.class);

    private final OrderRepository orderRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final com.projectkit.service.EmailService emailService;
    private final com.projectkit.service.CouponService couponService;
    private final org.springframework.core.env.Environment environment;

    @Value("${projectkit.razorpay.key-id}")
    private String razorpayKeyId;

    @Value("${projectkit.razorpay.key-secret}")
    private String razorpayKeySecret;

    public OrderServiceImpl(OrderRepository orderRepository,
                            ProjectRepository projectRepository,
                            UserRepository userRepository,
                            com.projectkit.service.EmailService emailService,
                            com.projectkit.service.CouponService couponService,
                            org.springframework.core.env.Environment environment) {
        this.orderRepository = orderRepository;
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
        this.emailService = emailService;
        this.couponService = couponService;
        this.environment = environment;
    }

    @Override
    @Transactional
    public OrderResponse createOrder(CreateOrderRequest request, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        if (request.getProjectIds() == null || request.getProjectIds().isEmpty()) {
            throw new BadRequestException("Order must contain at least one project kit.");
        }

        List<Project> projects = new ArrayList<>();
        BigDecimal originalAmount = BigDecimal.ZERO;

        for (Long projectId : request.getProjectIds()) {
            Project project = projectRepository.findById(projectId)
                    .orElseThrow(() -> new ResourceNotFoundException("Project", "id", projectId));

            if (!project.isActive()) {
                throw new BadRequestException("Project is currently not available: " + project.getTitle());
            }

            if (orderRepository.hasUserPurchasedProject(userId, projectId)) {
                throw new BadRequestException("You have already purchased project: " + project.getTitle());
            }

            BigDecimal itemPrice = (project.getDiscountPrice() != null && project.getDiscountPrice().compareTo(BigDecimal.ZERO) > 0)
                    ? project.getDiscountPrice()
                    : project.getPrice();

            originalAmount = originalAmount.add(itemPrice);
            projects.add(project);
        }

        // Validate and apply coupon if provided
        BigDecimal discountAmount = BigDecimal.ZERO;
        com.projectkit.entity.Coupon coupon = null;
        if (request.getCouponCode() != null && !request.getCouponCode().trim().isEmpty()) {
            coupon = couponService.getAndLockCouponForRedemption(request.getCouponCode(), userId, originalAmount);
            discountAmount = couponService.calculateDiscount(coupon, originalAmount);
        }

        BigDecimal finalAmount = originalAmount.subtract(discountAmount).max(BigDecimal.ZERO);

        String orderNumber = "PK-" + System.currentTimeMillis() + "-" + (1000 + new Random().nextInt(9000));

        Order order = new Order();
        order.setOrderNumber(orderNumber);
        order.setUser(user);
        order.setOriginalAmount(originalAmount);
        order.setDiscountAmount(discountAmount);
        order.setTotalAmount(finalAmount);
        if (coupon != null) {
            order.setCouponCode(coupon.getCode());
        }
        order.setStatus(OrderStatus.PENDING);

        for (Project project : projects) {
            BigDecimal itemPrice = (project.getDiscountPrice() != null && project.getDiscountPrice().compareTo(BigDecimal.ZERO) > 0)
                    ? project.getDiscountPrice()
                    : project.getPrice();
            OrderItem item = new OrderItem(order, project, itemPrice, project.getTitle());
            order.addItem(item);
        }

        // Initialize Razorpay Order
        String razorpayOrderId = null;
        boolean isDev = environment != null && environment.acceptsProfiles(org.springframework.core.env.Profiles.of("dev"));
        try {
            if (!razorpayKeyId.contains("placeholder") && !razorpayKeySecret.contains("placeholder")) {
                RazorpayClient razorpay = new RazorpayClient(razorpayKeyId, razorpayKeySecret);
                JSONObject orderReq = new JSONObject();
                // Amount in paise
                orderReq.put("amount", finalAmount.multiply(new BigDecimal(100)).intValue());
                orderReq.put("currency", "INR");
                orderReq.put("receipt", orderNumber);
                com.razorpay.Order rzpOrder = razorpay.orders.create(orderReq);
                razorpayOrderId = rzpOrder.get("id");
            } else if (isDev) {
                logger.info("Using simulated Razorpay Order ID for offline development/staging");
                razorpayOrderId = "order_sim_" + UUID.randomUUID().toString().replace("-", "").substring(0, 14);
            } else {
                throw new BadRequestException("Razorpay gateway credentials are not configured on server.");
            }
        } catch (BadRequestException bre) {
            throw bre;
        } catch (Exception ex) {
            logger.error("Error creating Razorpay order: {}", ex.getMessage());
            if (isDev) {
                // Fallback for development/testing if API key is invalid or offline
                razorpayOrderId = "order_sim_" + UUID.randomUUID().toString().replace("-", "").substring(0, 14);
            } else {
                throw new BadRequestException("Failed to initiate Razorpay order: " + ex.getMessage());
            }
        }

        order.setRazorpayOrderId(razorpayOrderId);
        Order savedOrder = orderRepository.save(order);

        // Record coupon usage audit if coupon was applied
        if (coupon != null) {
            couponService.recordCouponUsage(coupon, user, savedOrder, discountAmount);
        }

        try {
            List<String> kitTitles = projects.stream().map(Project::getTitle).collect(Collectors.toList());
            emailService.sendOrderConfirmationEmail(
                    user.getEmail(),
                    user.getFullName(),
                    savedOrder.getOrderNumber(),
                    savedOrder.getTotalAmount(),
                    kitTitles
            );
        } catch (Exception ex) {
            logger.warn("Could not dispatch order confirmation email for order {}: {}", savedOrder.getOrderNumber(), ex.getMessage());
        }

        return OrderResponse.fromEntity(savedOrder, razorpayKeyId);
    }

    @Override
    @Transactional(readOnly = true)
    public OrderResponse getOrderById(Long orderId, Long userId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));

        if (!order.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("You do not have access to this order.");
        }

        return OrderResponse.fromEntity(order, razorpayKeyId);
    }

    @Override
    @Transactional(readOnly = true)
    public OrderResponse getOrderByNumber(String orderNumber, Long userId) {
        Order order = orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "orderNumber", orderNumber));

        if (!order.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("You do not have access to this order.");
        }

        return OrderResponse.fromEntity(order, razorpayKeyId);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<OrderResponse> getUserOrders(Long userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Order> orderPage = orderRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable);

        List<OrderResponse> content = orderPage.getContent().stream()
                .map(o -> OrderResponse.fromEntity(o, razorpayKeyId))
                .collect(Collectors.toList());

        return PagedResponse.fromPage(orderPage, content);
    }
}
