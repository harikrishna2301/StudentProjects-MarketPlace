package com.projectkit.service.impl;

import com.projectkit.dto.request.ChangePasswordRequest;
import com.projectkit.dto.request.UpdateProfileRequest;
import com.projectkit.dto.response.PurchasedProjectDto;
import com.projectkit.dto.response.StudentDashboardDto;
import com.projectkit.dto.response.UserProfileResponse;
import com.projectkit.entity.Order;
import com.projectkit.entity.OrderItem;
import com.projectkit.entity.Project;
import com.projectkit.entity.User;
import com.projectkit.enums.OrderStatus;
import com.projectkit.exception.BadRequestException;
import com.projectkit.exception.ResourceNotFoundException;
import com.projectkit.repository.OrderRepository;
import com.projectkit.repository.UserRepository;
import com.projectkit.service.StudentService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
public class StudentServiceImpl implements StudentService {

    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final PasswordEncoder passwordEncoder;

    public StudentServiceImpl(UserRepository userRepository,
                              OrderRepository orderRepository,
                              PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.orderRepository = orderRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional(readOnly = true)
    public UserProfileResponse getProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        return UserProfileResponse.fromUser(user);
    }

    @Override
    @Transactional
    public UserProfileResponse updateProfile(Long userId, UpdateProfileRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        user.setFullName(request.getFullName().trim());
        if (request.getCollegeName() != null) {
            user.setCollegeName(request.getCollegeName().trim());
        }
        if (request.getPhone() != null) {
            user.setPhone(request.getPhone().trim());
        }

        User updated = userRepository.save(user);
        return UserProfileResponse.fromUser(updated);
    }

    @Override
    @Transactional
    public void changePassword(Long userId, ChangePasswordRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPasswordHash())) {
            throw new BadRequestException("Current password provided does not match our records.");
        }

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PurchasedProjectDto> getPurchasedProjects(Long userId) {
        List<Order> paidOrders = orderRepository.findByUserIdAndStatusOrderByCreatedAtDesc(userId, OrderStatus.PAID);
        List<PurchasedProjectDto> purchasedProjects = new ArrayList<>();

        for (Order order : paidOrders) {
            for (OrderItem item : order.getItems()) {
                Project p = item.getProject();
                PurchasedProjectDto dto = new PurchasedProjectDto();
                dto.setProjectId(p.getId());
                dto.setProjectTitle(p.getTitle());
                dto.setProjectSlug(p.getSlug());
                dto.setThumbnailUrl(p.getThumbnailUrl());
                dto.setCategoryName(p.getCategory() != null ? p.getCategory().getName() : "");
                dto.setOrderNumber(order.getOrderNumber());
                dto.setPricePaid(item.getPrice());
                dto.setPurchaseDate(order.getCreatedAt());
                dto.setDownloadSourceUrl("/api/projects/" + p.getId() + "/download/source");
                dto.setDownloadDocumentationUrl("/api/projects/" + p.getId() + "/download/documentation");
                purchasedProjects.add(dto);
            }
        }

        return purchasedProjects;
    }

    @Override
    @Transactional(readOnly = true)
    public StudentDashboardDto getDashboard(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        List<PurchasedProjectDto> purchases = getPurchasedProjects(userId);

        BigDecimal totalSpent = BigDecimal.ZERO;
        List<Order> paidOrders = orderRepository.findByUserIdAndStatusOrderByCreatedAtDesc(userId, OrderStatus.PAID);
        for (Order o : paidOrders) {
            totalSpent = totalSpent.add(o.getTotalAmount());
        }

        List<PurchasedProjectDto> recent = purchases.stream().limit(5).toList();

        return new StudentDashboardDto(
                UserProfileResponse.fromUser(user),
                purchases.size(),
                totalSpent,
                recent
        );
    }
}
