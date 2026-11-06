package com.projectkit.service;

import com.projectkit.dto.request.CreateProjectRequest;
import com.projectkit.dto.response.PagedResponse;
import com.projectkit.dto.response.ProjectDto;
import com.projectkit.dto.response.ProjectSummaryDto;
import com.projectkit.entity.Category;
import com.projectkit.entity.Project;
import com.projectkit.enums.DifficultyLevel;
import com.projectkit.exception.ResourceNotFoundException;
import com.projectkit.repository.CategoryRepository;
import com.projectkit.repository.OrderRepository;
import com.projectkit.repository.ProjectFileRepository;
import com.projectkit.repository.ProjectRepository;
import com.projectkit.security.UserPrincipal;
import com.projectkit.service.impl.ProjectServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.*;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ProjectServiceTest {

    @Mock
    private ProjectRepository projectRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private ProjectFileRepository projectFileRepository;

    @Mock
    private OrderRepository orderRepository;

    @InjectMocks
    private ProjectServiceImpl projectService;

    private Category testCategory;
    private Project testProject;
    private UserPrincipal studentPrincipal;

    @BeforeEach
    void setUp() {
        testCategory = new Category();
        testCategory.setId(1L);
        testCategory.setName("Artificial Intelligence");
        testCategory.setSlug("artificial-intelligence");
        testCategory.setActive(true);

        testProject = new Project();
        testProject.setId(10L);
        testProject.setTitle("Smart Attendance Face Recognition");
        testProject.setSlug("smart-attendance-face-recognition");
        testProject.setShortDescription("Full facial recognition attendance logging");
        testProject.setDetailedDescription("Deep learning pipeline with OpenCV");
        testProject.setCategory(testCategory);
        testProject.setPrice(new BigDecimal("999.00"));
        testProject.setDiscountPrice(new BigDecimal("1999.00"));
        testProject.setDifficultyLevel(DifficultyLevel.INTERMEDIATE);
        testProject.setActive(true);
        testProject.setFeatured(true);
        testProject.setTechnologies("Python, OpenCV, SQLite");

        studentPrincipal = new UserPrincipal(
                100L,
                "student@example.edu",
                "PasswordHash123",
                "Jane Doe",
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_STUDENT")),
                true
        );
    }

    @Test
    @DisplayName("Browse projects returns paged summary DTOs with correct metadata")
    void getProjects_Success() {
        Page<Project> page = new PageImpl<>(List.of(testProject), PageRequest.of(0, 10), 1);
        when(projectRepository.searchProjects(any(), any(), any(), any(), any(), any(Pageable.class))).thenReturn(page);

        PagedResponse<ProjectSummaryDto> result = projectService.getProjects(
                "face", 1L, DifficultyLevel.INTERMEDIATE, null, null, 0, 10, "createdAt", "DESC"
        );

        assertNotNull(result);
        assertEquals(1, result.getContent().size());
        assertEquals("Smart Attendance Face Recognition", result.getContent().get(0).getTitle());
        assertEquals(1, result.getTotalElements());
        assertEquals(1, result.getTotalPages());
    }

    @Test
    @DisplayName("Get project by slug returns complete specification and false purchase status for anonymous visitor")
    void getProjectBySlug_AnonymousUser() {
        when(projectRepository.findBySlugAndIsActiveTrue("smart-attendance-face-recognition"))
                .thenReturn(Optional.of(testProject));
        when(projectFileRepository.findByProjectId(10L)).thenReturn(Collections.emptyList());

        ProjectDto result = projectService.getProjectBySlug("smart-attendance-face-recognition", null);

        assertNotNull(result);
        assertEquals(10L, result.getId());
        assertEquals("Smart Attendance Face Recognition", result.getTitle());
        assertFalse(result.isPurchasedByCurrentUser(), "Anonymous visitor must not have purchased status true");
        verifyNoInteractions(orderRepository);
    }

    @Test
    @DisplayName("Get project by slug detects existing ownership for authenticated student")
    void getProjectBySlug_AuthenticatedPurchasedUser() {
        when(projectRepository.findBySlugAndIsActiveTrue("smart-attendance-face-recognition"))
                .thenReturn(Optional.of(testProject));
        when(projectFileRepository.findByProjectId(10L)).thenReturn(Collections.emptyList());
        when(orderRepository.hasUserPurchasedProject(100L, 10L)).thenReturn(true);

        ProjectDto result = projectService.getProjectBySlug("smart-attendance-face-recognition", studentPrincipal);

        assertNotNull(result);
        assertTrue(result.isPurchasedByCurrentUser(), "Student with verified order must have purchase flag set");
    }

    @Test
    @DisplayName("Get project by non-existent slug throws ResourceNotFoundException")
    void getProjectBySlug_NotFound_ThrowsException() {
        when(projectRepository.findBySlugAndIsActiveTrue("invalid-slug"))
                .thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () ->
                projectService.getProjectBySlug("invalid-slug", null)
        );
    }

    @Test
    @DisplayName("Get featured projects returns published featured kits")
    void getFeaturedProjects_Success() {
        when(projectRepository.findTop8ByIsFeaturedTrueAndIsActiveTrueOrderByCreatedAtDesc()).thenReturn(List.of(testProject));

        List<ProjectSummaryDto> featured = projectService.getFeaturedProjects();

        assertNotNull(featured);
        assertEquals(1, featured.size());
        assertEquals("Smart Attendance Face Recognition", featured.get(0).getTitle());
    }

    @Test
    @DisplayName("Create project auto-generates slug and associates active category")
    void createProject_Success() {
        CreateProjectRequest request = new CreateProjectRequest();
        request.setTitle("Autonomous Drone Navigation");
        request.setShortDescription("SLAM algorithm based path planning");
        request.setDetailedDescription("Complete indoor flight control code");
        request.setCategoryId(1L);
        request.setPrice(new BigDecimal("1499.00"));
        request.setDifficultyLevel(DifficultyLevel.ADVANCED);
        request.setTechnologies("ROS2, C++, Gazebo");

        when(categoryRepository.findById(1L)).thenReturn(Optional.of(testCategory));
        when(projectRepository.existsBySlug("autonomous-drone-navigation")).thenReturn(false);
        when(projectRepository.save(any(Project.class))).thenAnswer(invocation -> {
            Project saved = invocation.getArgument(0);
            saved.setId(20L);
            return saved;
        });

        ProjectDto created = projectService.createProject(request);

        assertNotNull(created);
        assertEquals("Autonomous Drone Navigation", created.getTitle());
        assertEquals("autonomous-drone-navigation", created.getSlug());
        verify(projectRepository).save(any(Project.class));
    }
}
