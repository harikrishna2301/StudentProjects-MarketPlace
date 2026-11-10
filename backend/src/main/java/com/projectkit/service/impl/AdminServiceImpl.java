package com.projectkit.service.impl;

import com.projectkit.dto.request.UpdateUserStatusRequest;
import com.projectkit.dto.response.*;
import com.projectkit.entity.Order;
import com.projectkit.entity.Payment;
import com.projectkit.entity.User;
import com.projectkit.enums.OrderStatus;
import com.projectkit.enums.Role;
import com.projectkit.exception.ResourceNotFoundException;
import com.projectkit.repository.OrderRepository;
import com.projectkit.repository.PaymentRepository;
import com.projectkit.repository.ProjectRepository;
import com.projectkit.repository.UserRepository;
import com.projectkit.service.AdminService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;
    private final com.projectkit.repository.StudentProjectAccessRepository accessRepository;

    @Value("${projectkit.razorpay.key-id}")
    private String razorpayKeyId;

    public AdminServiceImpl(UserRepository userRepository,
                            ProjectRepository projectRepository,
                            OrderRepository orderRepository,
                            PaymentRepository paymentRepository,
                            com.projectkit.repository.StudentProjectAccessRepository accessRepository) {
        this.userRepository = userRepository;
        this.projectRepository = projectRepository;
        this.orderRepository = orderRepository;
        this.paymentRepository = paymentRepository;
        this.accessRepository = accessRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public AdminDashboardDto getDashboardStats() {
        AdminDashboardDto dto = new AdminDashboardDto();
        dto.setTotalStudents(userRepository.countByRole(Role.STUDENT));
        dto.setTotalProjects(projectRepository.count());
        dto.setTotalOrders(orderRepository.count());
        dto.setTotalPaidOrders(orderRepository.countByStatus(OrderStatus.PAID));
        dto.setTotalFreeClaims(accessRepository.countByAccessTypeAndAccessStatus("FREE_CLAIM", "ACTIVE"));
        dto.setTotalPaidPurchases(accessRepository.countByAccessTypeAndAccessStatus("PAID_PURCHASE", "ACTIVE"));

        BigDecimal revenue = orderRepository.sumTotalPaidRevenue();
        dto.setTotalRevenue(revenue != null ? revenue : BigDecimal.ZERO);

        // Recent 5 orders
        Pageable recentOrderPage = PageRequest.of(0, 5, Sort.by("createdAt").descending());
        Page<Order> orders = orderRepository.findAll(recentOrderPage);
        dto.setRecentOrders(orders.getContent().stream()
                .map(o -> OrderResponse.fromEntity(o, razorpayKeyId))
                .collect(Collectors.toList()));

        // Recent 5 registered students
        Pageable recentStudentPage = PageRequest.of(0, 5, Sort.by("createdAt").descending());
        Page<User> students = userRepository.findByRole(Role.STUDENT, recentStudentPage);
        dto.setRecentStudents(students.getContent().stream()
                .map(UserProfileResponse::fromUser)
                .collect(Collectors.toList()));

        return dto;
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<UserProfileResponse> getStudents(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<User> studentsPage = userRepository.findByRole(Role.STUDENT, pageable);

        List<UserProfileResponse> content = studentsPage.getContent().stream()
                .map(UserProfileResponse::fromUser)
                .collect(Collectors.toList());

        return PagedResponse.fromPage(studentsPage, content);
    }

    @Override
    @Transactional
    public UserProfileResponse updateStudentStatus(Long studentId, UpdateUserStatusRequest request) {
        User user = userRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student", "id", studentId));

        user.setStatus(request.getStatus());
        User updated = userRepository.save(user);

        return UserProfileResponse.fromUser(updated);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<OrderResponse> getAllOrders(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Order> orderPage = orderRepository.findAll(pageable);

        List<OrderResponse> content = orderPage.getContent().stream()
                .map(o -> OrderResponse.fromEntity(o, razorpayKeyId))
                .collect(Collectors.toList());

        return PagedResponse.fromPage(orderPage, content);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<PaymentResponse> getAllPayments(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Payment> paymentPage = paymentRepository.findAllByOrderByCreatedAtDesc(pageable);

        List<PaymentResponse> content = paymentPage.getContent().stream()
                .map(PaymentResponse::fromEntity)
                .collect(Collectors.toList());

        return PagedResponse.fromPage(paymentPage, content);
    }
}
