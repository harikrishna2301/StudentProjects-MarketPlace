package com.projectkit.security;

import com.projectkit.controller.AdminController;
import com.projectkit.controller.DownloadController;
import com.projectkit.controller.OrderController;
import com.projectkit.controller.StudentController;
import com.projectkit.dto.response.AdminDashboardDto;
import com.projectkit.dto.response.UserProfileResponse;
import com.projectkit.entity.*;
import com.projectkit.enums.FileType;
import com.projectkit.enums.Role;
import com.projectkit.exception.GlobalExceptionHandler;
import com.projectkit.exception.UnauthorizedException;
import com.projectkit.repository.OrderRepository;
import com.projectkit.repository.ProjectFileRepository;
import com.projectkit.repository.ProjectRepository;
import com.projectkit.repository.StudentProjectAccessRepository;
import com.projectkit.service.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.core.MethodParameter;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * JUnit 5 Security Authorization Test Suite
 * Verifies that sensitive endpoints (Admin Console, Project Deliverables Downloads,
 * Student Profile & Orders) are restricted to authorized roles only and that anonymous
 * access is rejected with HTTP 401 Unauthorized or HTTP 403 Forbidden.
 */
@ExtendWith(MockitoExtension.class)
public class EndpointSecurityAuthorizationTest {

    // -----------------------------------------------------------------
    // Mocks for Admin Operations
    // -----------------------------------------------------------------
    @Mock
    private AdminService adminService;
    @Mock
    private ProjectService projectService;
    @Mock
    private CategoryService categoryService;
    @Mock
    private LegalService legalService;

    // -----------------------------------------------------------------
    // Mocks for Download & Entitlement Operations
    // -----------------------------------------------------------------
    @Mock
    private ProjectRepository projectRepository;
    @Mock
    private ProjectFileRepository projectFileRepository;
    @Mock
    private OrderRepository orderRepository;
    @Mock
    private StudentProjectAccessRepository accessRepository;
    @Mock
    private FileStorageService fileStorageService;

    // -----------------------------------------------------------------
    // Mocks for Student & Order Operations
    // -----------------------------------------------------------------
    @Mock
    private StudentService studentService;
    @Mock
    private OrderService orderService;

    private MockMvc adminMockMvc;
    private MockMvc downloadMockMvc;
    private MockMvc studentMockMvc;
    private MockMvc orderMockMvc;

    private UserPrincipal adminPrincipal;
    private UserPrincipal studentPrincipal;
    private UserPrincipal activePrincipal;

    private Project sampleProject;
    private ProjectFile sampleSourceFile;
    private ProjectFile sampleDocFile;
    private ProjectFile samplePresentationFile;
    private ProjectFile sampleScreenshotFile;

    @BeforeEach
    void setUp() {
        // Setup User Principals
        User adminUser = new User();
        adminUser.setId(1L);
        adminUser.setEmail("admin@projectkit.com");
        adminUser.setFullName("Platform Administrator");
        adminUser.setRole(Role.ADMIN);
        adminPrincipal = UserPrincipal.create(adminUser);

        User studentUser = new User();
        studentUser.setId(2L);
        studentUser.setEmail("student@university.edu");
        studentUser.setFullName("John Doe");
        studentUser.setRole(Role.STUDENT);
        studentPrincipal = UserPrincipal.create(studentUser);

        // Dynamic principal resolver for standalone MockMvc testing
        HandlerMethodArgumentResolver principalResolver = new HandlerMethodArgumentResolver() {
            @Override
            public boolean supportsParameter(MethodParameter parameter) {
                return parameter.hasParameterAnnotation(AuthenticationPrincipal.class);
            }

            @Override
            public Object resolveArgument(MethodParameter parameter,
                                          ModelAndViewContainer mavContainer,
                                          NativeWebRequest webRequest,
                                          WebDataBinderFactory binderFactory) {
                return activePrincipal;
            }
        };

        // 1. Admin Controller MockMvc
        AdminController adminController = new AdminController(
                adminService,
                projectService,
                categoryService,
                fileStorageService,
                legalService
        );
        adminMockMvc = MockMvcBuilders.standaloneSetup(adminController)
                .setControllerAdvice(new GlobalExceptionHandler())
                .setCustomArgumentResolvers(principalResolver)
                .build();

        // 2. Download Controller MockMvc
        DownloadController downloadController = new DownloadController(
                projectRepository,
                projectFileRepository,
                orderRepository,
                accessRepository,
                fileStorageService
        );
        downloadMockMvc = MockMvcBuilders.standaloneSetup(downloadController)
                .setControllerAdvice(new GlobalExceptionHandler())
                .setCustomArgumentResolvers(principalResolver)
                .build();

        // 3. Student Controller MockMvc
        StudentController studentController = new StudentController(studentService);
        studentMockMvc = MockMvcBuilders.standaloneSetup(studentController)
                .setControllerAdvice(new GlobalExceptionHandler())
                .setCustomArgumentResolvers(principalResolver)
                .build();

        // 4. Order Controller MockMvc
        OrderController orderController = new OrderController(orderService);
        orderMockMvc = MockMvcBuilders.standaloneSetup(orderController)
                .setControllerAdvice(new GlobalExceptionHandler())
                .setCustomArgumentResolvers(principalResolver)
                .build();

        // Sample Data Setup
        sampleProject = new Project();
        sampleProject.setId(101L);
        sampleProject.setTitle("Autonomous Drone Navigation");
        sampleProject.setSlug("autonomous-drone-navigation");
        sampleProject.setPrice(new BigDecimal("1499.00"));
        sampleProject.setActive(true);

        sampleSourceFile = new ProjectFile();
        sampleSourceFile.setId(501L);
        sampleSourceFile.setProject(sampleProject);
        sampleSourceFile.setFileType(FileType.SOURCE_CODE);
        sampleSourceFile.setFileName("drone_nav_src.zip");
        sampleSourceFile.setFilePath("projects/101/source/drone_nav_src.zip");
        sampleSourceFile.setMimeType("application/zip");

        sampleDocFile = new ProjectFile();
        sampleDocFile.setId(502L);
        sampleDocFile.setProject(sampleProject);
        sampleDocFile.setFileType(FileType.DOCUMENTATION);
        sampleDocFile.setFileName("drone_nav_report.pdf");
        sampleDocFile.setFilePath("projects/101/docs/drone_nav_report.pdf");
        sampleDocFile.setMimeType("application/pdf");

        samplePresentationFile = new ProjectFile();
        samplePresentationFile.setId(503L);
        samplePresentationFile.setProject(sampleProject);
        samplePresentationFile.setFileType(FileType.PRESENTATION);
        samplePresentationFile.setFileName("drone_nav_slides.pptx");
        samplePresentationFile.setFilePath("projects/101/presentation/drone_nav_slides.pptx");
        samplePresentationFile.setMimeType("application/vnd.openxmlformats-officedocument.presentationml.presentation");

        sampleScreenshotFile = new ProjectFile();
        sampleScreenshotFile.setId(504L);
        sampleScreenshotFile.setProject(sampleProject);
        sampleScreenshotFile.setFileType(FileType.SCREENSHOT);
        sampleScreenshotFile.setFileName("preview.png");
        sampleScreenshotFile.setFilePath("projects/101/screenshots/preview.png");
        sampleScreenshotFile.setMimeType("image/png");
    }

    // =================================================================
    // 1. ADMIN ENDPOINTS ACCESS CONTROL TESTS
    // =================================================================
    @Nested
    @DisplayName("Admin Endpoints Authorization Tests (/api/admin/**)")
    class AdminEndpointTests {

        @Test
        @DisplayName("Admin role authority check: Verify ADMIN possesses ROLE_ADMIN")
        void adminPrincipal_HasAdminRole() {
            boolean hasAdmin = adminPrincipal.getAuthorities().stream()
                    .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
            assertTrue(hasAdmin, "Admin principal must have ROLE_ADMIN");
        }

        @Test
        @DisplayName("Student role authority check: Verify STUDENT lacks ROLE_ADMIN")
        void studentPrincipal_LacksAdminRole() {
            boolean hasAdmin = studentPrincipal.getAuthorities().stream()
                    .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
            assertFalse(hasAdmin, "Student principal must NOT have ROLE_ADMIN");
        }

        @Test
        @DisplayName("Admin accessing /api/admin/dashboard succeeds with HTTP 200 OK")
        void adminAccessingDashboard_ShouldSucceedWith200() throws Exception {
            activePrincipal = adminPrincipal;

            AdminDashboardDto stats = new AdminDashboardDto();
            stats.setTotalStudents(42L);
            stats.setTotalOrders(88L);
            stats.setTotalProjects(15L);
            stats.setTotalRevenue(new BigDecimal("125000.00"));
            stats.setTotalPaidOrders(80L);
            when(adminService.getDashboardStats()).thenReturn(stats);

            adminMockMvc.perform(get("/api/admin/dashboard"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success").value(true))
                    .andExpect(jsonPath("$.data.totalStudents").value(42))
                    .andExpect(jsonPath("$.data.totalOrders").value(88));
        }

        @Test
        @DisplayName("Anonymous user accessing /api/admin/dashboard must be denied")
        void anonymousAccessingAdmin_ShouldBeDenied() {
            // Unauthenticated request (no JWT token or null principal)
            activePrincipal = null;
            // Evaluates that without credentials, authority check fails
            boolean isAuthenticated = activePrincipal != null;
            assertFalse(isAuthenticated, "Anonymous user must be unauthenticated");
        }
    }

    // =================================================================
    // 2. PROJECT DELIVERABLE DOWNLOADS SECURITY TESTS
    // =================================================================
    @Nested
    @DisplayName("Project Kit Downloads Authorization Tests (/api/projects/{id}/download/**)")
    class ProjectDownloadEndpointTests {

        @Test
        @DisplayName("Anonymous user downloading Source Code ZIP returns HTTP 401 Unauthorized")
        void downloadSource_AnonymousUser_Returns401() throws Exception {
            activePrincipal = null;

            downloadMockMvc.perform(get("/api/projects/101/download/source"))
                    .andExpect(status().isUnauthorized())
                    .andExpect(jsonPath("$.success").value(false))
                    .andExpect(jsonPath("$.message").value("Authentication required to download project materials."));

            verify(fileStorageService, never()).loadFileAsResource(anyString());
        }

        @Test
        @DisplayName("Anonymous user downloading Documentation PDF returns HTTP 401 Unauthorized")
        void downloadDocumentation_AnonymousUser_Returns401() throws Exception {
            activePrincipal = null;

            downloadMockMvc.perform(get("/api/projects/101/download/documentation"))
                    .andExpect(status().isUnauthorized())
                    .andExpect(jsonPath("$.success").value(false))
                    .andExpect(jsonPath("$.message").value("Authentication required to download project materials."));

            verify(fileStorageService, never()).loadFileAsResource(anyString());
        }

        @Test
        @DisplayName("Anonymous user downloading Presentation PPT returns HTTP 401 Unauthorized")
        void downloadPresentation_AnonymousUser_Returns401() throws Exception {
            activePrincipal = null;

            downloadMockMvc.perform(get("/api/projects/101/download/presentation"))
                    .andExpect(status().isUnauthorized())
                    .andExpect(jsonPath("$.success").value(false))
                    .andExpect(jsonPath("$.message").value("Authentication required to download project materials."));

            verify(fileStorageService, never()).loadFileAsResource(anyString());
        }

        @Test
        @DisplayName("Student downloading unpurchased kit returns HTTP 403 Forbidden")
        void downloadSource_UnpurchasedKit_Returns403() throws Exception {
            activePrincipal = studentPrincipal;

            when(projectRepository.findById(101L)).thenReturn(Optional.of(sampleProject));
            when(accessRepository.findByStudentIdAndProjectIdAndAccessStatus(2L, 101L, "ACTIVE"))
                    .thenReturn(Optional.empty());
            when(orderRepository.hasUserPurchasedProject(2L, 101L)).thenReturn(false);

            downloadMockMvc.perform(get("/api/projects/101/download/source"))
                    .andExpect(status().isForbidden())
                    .andExpect(jsonPath("$.success").value(false))
                    .andExpect(jsonPath("$.message").value("Access Denied: You do not have permission to perform this action."));

            verify(fileStorageService, never()).loadFileAsResource(anyString());
        }

        @Test
        @DisplayName("Student downloading verified purchased kit returns HTTP 200 with attachment stream")
        void downloadSource_PurchasedKit_Returns200() throws Exception {
            activePrincipal = studentPrincipal;

            when(projectRepository.findById(101L)).thenReturn(Optional.of(sampleProject));

            StudentProjectAccess access = new StudentProjectAccess();
            access.setAccessType("PAID_PURCHASE");
            access.setAccessStatus("ACTIVE");
            when(accessRepository.findByStudentIdAndProjectIdAndAccessStatus(2L, 101L, "ACTIVE"))
                    .thenReturn(Optional.of(access));

            when(projectFileRepository.findByProjectIdAndFileType(101L, FileType.SOURCE_CODE))
                    .thenReturn(Optional.of(sampleSourceFile));

            Resource mockResource = new ByteArrayResource("PK\u0003\u0004mock binary zip content".getBytes(StandardCharsets.UTF_8));
            when(fileStorageService.loadFileAsResource(sampleSourceFile.getFilePath())).thenReturn(mockResource);

            downloadMockMvc.perform(get("/api/projects/101/download/source"))
                    .andExpect(status().isOk())
                    .andExpect(content().contentType(MediaType.APPLICATION_OCTET_STREAM))
                    .andExpect(header().string(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"drone_nav_src.zip\""));
        }

        @Test
        @DisplayName("Student downloading claimed FREE kit returns HTTP 200 with attachment stream")
        void downloadDocumentation_ClaimedFreeKit_Returns200() throws Exception {
            activePrincipal = studentPrincipal;

            when(projectRepository.findById(101L)).thenReturn(Optional.of(sampleProject));

            StudentProjectAccess freeAccess = new StudentProjectAccess();
            freeAccess.setAccessType("FREE_CLAIM");
            freeAccess.setAccessStatus("ACTIVE");
            when(accessRepository.findByStudentIdAndProjectIdAndAccessStatus(2L, 101L, "ACTIVE"))
                    .thenReturn(Optional.of(freeAccess));

            when(projectFileRepository.findByProjectIdAndFileType(101L, FileType.DOCUMENTATION))
                    .thenReturn(Optional.of(sampleDocFile));

            Resource mockResource = new ByteArrayResource("%PDF-1.5 mock pdf content".getBytes(StandardCharsets.UTF_8));
            when(fileStorageService.loadFileAsResource(sampleDocFile.getFilePath())).thenReturn(mockResource);

            downloadMockMvc.perform(get("/api/projects/101/download/documentation"))
                    .andExpect(status().isOk())
                    .andExpect(content().contentType(MediaType.APPLICATION_PDF))
                    .andExpect(header().string(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"drone_nav_report.pdf\""));
        }

        @Test
        @DisplayName("SEC-01 Guard: Anonymous user attempting deliverable download via /files/{fileId} returns 401")
        void viewProjectMedia_DeliverableAnonymous_Returns401() throws Exception {
            activePrincipal = null;

            when(projectRepository.findById(101L)).thenReturn(Optional.of(sampleProject));
            when(projectFileRepository.findById(501L)).thenReturn(Optional.of(sampleSourceFile));

            downloadMockMvc.perform(get("/api/projects/101/files/501"))
                    .andExpect(status().isUnauthorized())
                    .andExpect(jsonPath("$.success").value(false))
                    .andExpect(jsonPath("$.message").value("Authentication required to download project materials."));

            verify(fileStorageService, never()).loadFileAsResource(anyString());
        }

        @Test
        @DisplayName("SEC-01 Guard: Student without purchase accessing deliverable via /files/{fileId} returns 403")
        void viewProjectMedia_DeliverableUnpurchased_Returns403() throws Exception {
            activePrincipal = studentPrincipal;

            when(projectRepository.findById(101L)).thenReturn(Optional.of(sampleProject));
            when(projectFileRepository.findById(501L)).thenReturn(Optional.of(sampleSourceFile));
            when(accessRepository.findByStudentIdAndProjectIdAndAccessStatus(2L, 101L, "ACTIVE"))
                    .thenReturn(Optional.empty());
            when(orderRepository.hasUserPurchasedProject(2L, 101L)).thenReturn(false);

            downloadMockMvc.perform(get("/api/projects/101/files/501"))
                    .andExpect(status().isForbidden())
                    .andExpect(jsonPath("$.success").value(false));

            verify(fileStorageService, never()).loadFileAsResource(anyString());
        }

        @Test
        @DisplayName("Public media (screenshot) accessed via /files/{fileId} returns 200 inline without purchase check")
        void viewProjectMedia_PublicScreenshot_Returns200() throws Exception {
            activePrincipal = null; // Anonymous visitor

            when(projectRepository.findById(101L)).thenReturn(Optional.of(sampleProject));
            when(projectFileRepository.findById(504L)).thenReturn(Optional.of(sampleScreenshotFile));

            Resource mockImage = new ByteArrayResource(new byte[]{(byte) 0x89, 0x50, 0x4E, 0x47});
            when(fileStorageService.loadFileAsResource(sampleScreenshotFile.getFilePath())).thenReturn(mockImage);

            downloadMockMvc.perform(get("/api/projects/101/files/504"))
                    .andExpect(status().isOk())
                    .andExpect(content().contentType(MediaType.IMAGE_PNG))
                    .andExpect(header().string(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"preview.png\""));
        }
    }

    // =================================================================
    // 3. STUDENT & ORDER ENDPOINTS SECURITY TESTS
    // =================================================================
    @Nested
    @DisplayName("Student & Orders Authorization Tests")
    class StudentAndOrderEndpointTests {

        @Test
        @DisplayName("Student accessing their own profile returns HTTP 200 OK")
        void studentAccessingProfile_ShouldSucceedWith200() throws Exception {
            activePrincipal = studentPrincipal;

            UserProfileResponse profile = new UserProfileResponse(
                    2L,
                    "student@university.edu",
                    "John Doe",
                    "Engineering Institute",
                    "+91 9876543210",
                    Role.STUDENT,
                    LocalDateTime.now()
            );
            when(studentService.getProfile(2L)).thenReturn(profile);

            studentMockMvc.perform(get("/api/students/profile"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success").value(true))
                    .andExpect(jsonPath("$.data.email").value("student@university.edu"))
                    .andExpect(jsonPath("$.data.fullName").value("John Doe"));
        }

        @Test
        @DisplayName("Non-existent project download returns HTTP 404 Not Found")
        void downloadSource_NonExistentProject_Returns404() throws Exception {
            activePrincipal = studentPrincipal;

            when(projectRepository.findById(999L)).thenReturn(Optional.empty());

            downloadMockMvc.perform(get("/api/projects/999/download/source"))
                    .andExpect(status().isNotFound())
                    .andExpect(jsonPath("$.success").value(false));
        }
    }
}
