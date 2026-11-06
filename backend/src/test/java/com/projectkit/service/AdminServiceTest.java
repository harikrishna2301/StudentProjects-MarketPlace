package com.projectkit.service;

import com.projectkit.dto.request.UpdateUserStatusRequest;
import com.projectkit.dto.response.AdminDashboardDto;
import com.projectkit.dto.response.UserProfileResponse;
import com.projectkit.entity.Order;
import com.projectkit.entity.User;
import com.projectkit.enums.AccountStatus;
import com.projectkit.enums.OrderStatus;
import com.projectkit.enums.Role;
import com.projectkit.repository.OrderRepository;
import com.projectkit.repository.PaymentRepository;
import com.projectkit.repository.ProjectRepository;
import com.projectkit.repository.UserRepository;
import com.projectkit.service.impl.AdminServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.test.util.ReflectionTestUtils;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AdminServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private ProjectRepository projectRepository;

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private PaymentRepository paymentRepository;

    @InjectMocks
    private AdminServiceImpl adminService;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(adminService, "razorpayKeyId", "rzp_test_placeholder");
    }

    @Test
    @DisplayName("Admin dashboard stats aggregates counts and total revenue accurately")
    void getDashboardStats_AggregatesCountsAndRevenue() {
        when(userRepository.countByRole(Role.STUDENT)).thenReturn(120L);
        when(projectRepository.count()).thenReturn(45L);
        when(orderRepository.count()).thenReturn(350L);
        when(orderRepository.countByStatus(OrderStatus.PAID)).thenReturn(310L);
        when(orderRepository.sumTotalPaidRevenue()).thenReturn(new BigDecimal("309690.00"));
        when(orderRepository.findAll(any(Pageable.class))).thenReturn(new PageImpl<>(Collections.emptyList()));
        when(userRepository.findByRole(eq(Role.STUDENT), any(Pageable.class))).thenReturn(new PageImpl<>(Collections.emptyList()));

        AdminDashboardDto stats = adminService.getDashboardStats();

        assertNotNull(stats);
        assertEquals(120L, stats.getTotalStudents());
        assertEquals(45L, stats.getTotalProjects());
        assertEquals(350L, stats.getTotalOrders());
        assertEquals(310L, stats.getTotalPaidOrders());
        assertEquals(new BigDecimal("309690.00"), stats.getTotalRevenue());
    }

    @Test
    @DisplayName("Update student status updates account status to SUSPENDED")
    void updateStudentStatus_SuspendsUser() {
        User student = new User();
        student.setId(15L);
        student.setEmail("badactor@school.edu");
        student.setStatus(AccountStatus.ACTIVE);

        UpdateUserStatusRequest req = new UpdateUserStatusRequest();
        req.setStatus(AccountStatus.SUSPENDED);

        when(userRepository.findById(15L)).thenReturn(Optional.of(student));
        when(userRepository.save(any(User.class))).thenAnswer(i -> i.getArgument(0));

        UserProfileResponse res = adminService.updateStudentStatus(15L, req);

        assertNotNull(res);
        assertEquals(AccountStatus.SUSPENDED, student.getStatus());
        verify(userRepository).save(student);
    }
}
