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
import com.projectkit.dto.response.*;
import com.projectkit.entity.*;
import com.projectkit.enums.OrderStatus;
import com.projectkit.exception.BadRequestException;
import com.projectkit.exception.ResourceNotFoundException;
import com.projectkit.repository.OrderRepository;
import com.projectkit.repository.ProjectRepository;
import com.projectkit.repository.StudentProjectAccessRepository;
import com.projectkit.repository.UserRepository;
import com.projectkit.service.StudentService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class StudentServiceImpl implements StudentService {

    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final ProjectRepository projectRepository;
    private final StudentProjectAccessRepository accessRepository;
    private final PasswordEncoder passwordEncoder;

    public StudentServiceImpl(UserRepository userRepository,
                              OrderRepository orderRepository,
                              ProjectRepository projectRepository,
                              StudentProjectAccessRepository accessRepository,
                              PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.orderRepository = orderRepository;
        this.projectRepository = projectRepository;
        this.accessRepository = accessRepository;
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

    @Override
    @Transactional
    public ClaimFreeProjectResponseDto claimFreeProject(Long userId, Long projectId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", projectId));

        // Validation 1: Project must be marked free
        if (!project.isFree() && !"FREE".equalsIgnoreCase(project.getAccessType())) {
            throw new BadRequestException("This project is a paid kit and requires purchase through checkout.");
        }

        // Validation 2: Project must be active and published
        if (!project.isActive() || "ARCHIVED".equalsIgnoreCase(project.getPublicationStatus())) {
            throw new BadRequestException("This project is not currently available for claim.");
        }

        // Validation 3: Check for duplicate free claim
        if (accessRepository.hasActiveAccess(userId, projectId)) {
            throw new BadRequestException("You have already claimed access to this project kit.");
        }

        // Grant entitlement
        StudentProjectAccess access = new StudentProjectAccess(user, project, "FREE_CLAIM", null, null);
        StudentProjectAccess saved = accessRepository.save(access);

        // Increment claim count on project
        project.setClaimCount(project.getClaimCount() + 1);
        projectRepository.save(project);

        return new ClaimFreeProjectResponseDto(
                saved.getId(),
                project.getId(),
                project.getTitle(),
                project.getSlug(),
                "FREE_CLAIM",
                saved.getGrantedAt(),
                "Free project kit successfully claimed and added to My Kits.",
                "/api/projects/" + project.getId() + "/download/source",
                "/api/projects/" + project.getId() + "/download/documentation"
        );
    }

    @Override
    @Transactional(readOnly = true)
    public List<MyKitDto> getMyKits(Long userId) {
        userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        List<StudentProjectAccess> entitlements = accessRepository
                .findByStudentIdAndAccessStatusOrderByGrantedAtDesc(userId, "ACTIVE");

        List<MyKitDto> kits = new ArrayList<>();
        for (StudentProjectAccess spa : entitlements) {
            Project p = spa.getProject();
            MyKitDto dto = new MyKitDto();
            dto.setEntitlementId(spa.getId());
            dto.setProjectId(p.getId());
            dto.setProjectTitle(p.getTitle());
            dto.setProjectSlug(p.getSlug());
            dto.setThumbnailUrl(p.getThumbnailUrl());
            dto.setCategoryName(p.getCategory() != null ? p.getCategory().getName() : "");
            dto.setTechnologies(p.getTechnologies());
            dto.setAccessType(spa.getAccessType());
            dto.setFree("FREE_CLAIM".equalsIgnoreCase(spa.getAccessType()) || p.isFree());
            dto.setGrantedAt(spa.getGrantedAt());
            dto.setDownloadSourceUrl("/api/projects/" + p.getId() + "/download/source");
            dto.setDownloadDocumentationUrl("/api/projects/" + p.getId() + "/download/documentation");

            if (spa.getOrder() != null) {
                dto.setOrderNumber(spa.getOrder().getOrderNumber());
                dto.setPricePaid(spa.getOrder().getTotalAmount());
            } else {
                dto.setPricePaid(BigDecimal.ZERO);
            }
            kits.add(dto);
        }

        return kits;
    }

    @Override
    @Transactional(readOnly = true)
    public ProjectAccessStatusDto checkProjectAccess(Long userId, Long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", projectId));

        Optional<StudentProjectAccess> accessOpt = accessRepository
                .findByStudentIdAndProjectIdAndAccessStatus(userId, projectId, "ACTIVE");

        if (accessOpt.isPresent()) {
            StudentProjectAccess access = accessOpt.get();
            return new ProjectAccessStatusDto(
                    projectId,
                    true,
                    access.getAccessType(),
                    project.isFree(),
                    access.getGrantedAt(),
                    "/api/projects/" + projectId + "/download/source",
                    "/api/projects/" + projectId + "/download/documentation"
            );
        }

        // Fallback check on paid orders for backward compatibility
        boolean hasPaid = orderRepository.hasUserPurchasedProject(userId, projectId);
        if (hasPaid) {
            return new ProjectAccessStatusDto(
                    projectId,
                    true,
                    "PAID_PURCHASE",
                    project.isFree(),
                    null,
                    "/api/projects/" + projectId + "/download/source",
                    "/api/projects/" + projectId + "/download/documentation"
            );
        }

        return new ProjectAccessStatusDto(
                projectId,
                false,
                "NONE",
                project.isFree(),
                null,
                null,
                null
        );
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProjectSummaryDto> getAvailableFreeKits(Long userId) {
        List<Project> freeProjects = projectRepository.findAll().stream()
                .filter(p -> p.isActive() && p.isFree() && !"ARCHIVED".equalsIgnoreCase(p.getPublicationStatus()))
                .toList();

        List<ProjectSummaryDto> available = new ArrayList<>();
        for (Project p : freeProjects) {
            boolean hasClaimed = accessRepository.hasActiveAccess(userId, p.getId());
            if (!hasClaimed) {
                available.add(ProjectSummaryDto.fromEntity(p));
            }
        }
        return available;
    }
}
