package com.projectkit.service;

import com.projectkit.dto.request.ChangePasswordRequest;
import com.projectkit.dto.request.UpdateProfileRequest;
import com.projectkit.dto.response.StudentDashboardDto;
import com.projectkit.dto.response.UserProfileResponse;
import com.projectkit.entity.Category;
import com.projectkit.entity.Order;
import com.projectkit.entity.OrderItem;
import com.projectkit.entity.Project;
import com.projectkit.entity.User;
import com.projectkit.enums.AccountStatus;
import com.projectkit.enums.OrderStatus;
import com.projectkit.enums.Role;
import com.projectkit.exception.BadRequestException;
import com.projectkit.repository.OrderRepository;
import com.projectkit.repository.UserRepository;
import com.projectkit.service.impl.StudentServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class StudentServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private StudentServiceImpl studentService;

    private User studentUser;

    @BeforeEach
    void setUp() {
        studentUser = new User();
        studentUser.setId(10L);
        studentUser.setEmail("student@mit.edu");
        studentUser.setFullName("David Miller");
        studentUser.setPasswordHash("$2a$10$encodedCurrentPasswordHash");
        studentUser.setStatus(AccountStatus.ACTIVE);
        studentUser.setRole(Role.STUDENT);
        studentUser.setPhone("+919876543210");
        studentUser.setCollegeName("MIT Engineering");
    }

    @Test
    @DisplayName("Get student profile returns accurate user details")
    void getProfile_Success() {
        when(userRepository.findById(10L)).thenReturn(Optional.of(studentUser));

        UserProfileResponse res = studentService.getProfile(10L);

        assertNotNull(res);
        assertEquals("David Miller", res.getFullName());
        assertEquals("student@mit.edu", res.getEmail());
        assertEquals("MIT Engineering", res.getCollegeName());
    }

    @Test
    @DisplayName("Update profile trims and updates student fields")
    void updateProfile_Success() {
        UpdateProfileRequest req = new UpdateProfileRequest();
        req.setFullName("David K. Miller");
        req.setCollegeName("Stanford University");
        req.setPhone("+919999888877");

        when(userRepository.findById(10L)).thenReturn(Optional.of(studentUser));
        when(userRepository.save(any(User.class))).thenAnswer(i -> i.getArgument(0));

        UserProfileResponse updated = studentService.updateProfile(10L, req);

        assertNotNull(updated);
        assertEquals("David K. Miller", updated.getFullName());
        assertEquals("Stanford University", updated.getCollegeName());
        verify(userRepository).save(any(User.class));
    }

    @Test
    @DisplayName("Change password verifies current password hash before encoding new password")
    void changePassword_Success() {
        ChangePasswordRequest req = new ChangePasswordRequest();
        req.setCurrentPassword("CorrectCurrent123!");
        req.setNewPassword("SuperSecureNewPass456!");

        when(userRepository.findById(10L)).thenReturn(Optional.of(studentUser));
        when(passwordEncoder.matches("CorrectCurrent123!", "$2a$10$encodedCurrentPasswordHash")).thenReturn(true);
        when(passwordEncoder.encode("SuperSecureNewPass456!")).thenReturn("$2a$10$encodedNewHash");

        studentService.changePassword(10L, req);

        assertEquals("$2a$10$encodedNewHash", studentUser.getPasswordHash());
        verify(userRepository).save(studentUser);
    }

    @Test
    @DisplayName("Change password rejects invalid current password")
    void changePassword_WrongCurrentPassword_ThrowsBadRequest() {
        ChangePasswordRequest req = new ChangePasswordRequest();
        req.setCurrentPassword("WrongCurrentPassword!");
        req.setNewPassword("NewPass123!");

        when(userRepository.findById(10L)).thenReturn(Optional.of(studentUser));
        when(passwordEncoder.matches("WrongCurrentPassword!", "$2a$10$encodedCurrentPasswordHash")).thenReturn(false);

        assertThrows(BadRequestException.class, () ->
                studentService.changePassword(10L, req)
        );
        verify(passwordEncoder, never()).encode(any());
    }

    @Test
    @DisplayName("Get student dashboard computes purchase count and total spent from paid orders")
    void getDashboard_CalculatesPurchasesAndSpend() {
        Order paidOrder = new Order();
        paidOrder.setId(101L);
        paidOrder.setOrderNumber("PK-PAID-01");
        paidOrder.setStatus(OrderStatus.PAID);
        paidOrder.setTotalAmount(new BigDecimal("999.00"));
        paidOrder.setCreatedAt(LocalDateTime.now());

        Project project = new Project();
        project.setId(500L);
        project.setTitle("IoT Weather Station");
        project.setSlug("iot-weather-station");
        Category cat = new Category();
        cat.setName("Internet of Things");
        project.setCategory(cat);

        OrderItem item = new OrderItem(paidOrder, project, new BigDecimal("999.00"), "IoT Weather Station");
        paidOrder.addItem(item);

        when(userRepository.findById(10L)).thenReturn(Optional.of(studentUser));
        when(orderRepository.findByUserIdAndStatusOrderByCreatedAtDesc(10L, OrderStatus.PAID))
                .thenReturn(List.of(paidOrder));

        StudentDashboardDto dashboard = studentService.getDashboard(10L);

        assertNotNull(dashboard);
        assertEquals(1, dashboard.getTotalPurchasedProjects());
        assertEquals(new BigDecimal("999.00"), dashboard.getTotalAmountSpent());
        assertEquals(1, dashboard.getRecentPurchases().size());
        assertEquals("IoT Weather Station", dashboard.getRecentPurchases().get(0).getProjectTitle());
    }
}
