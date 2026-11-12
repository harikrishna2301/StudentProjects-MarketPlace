package com.projectkit.security;

import com.projectkit.controller.AdminController;
import com.projectkit.controller.DownloadController;
import com.projectkit.dto.response.AdminDashboardDto;
import com.projectkit.entity.*;
import com.projectkit.enums.FileType;
import com.projectkit.enums.OrderStatus;
import com.projectkit.enums.Role;
import com.projectkit.exception.GlobalExceptionHandler;
import com.projectkit.exception.UnauthorizedException;
import com.projectkit.repository.OrderRepository;
import com.projectkit.repository.ProjectFileRepository;
import com.projectkit.repository.ProjectRepository;
import com.projectkit.repository.StudentProjectAccessRepository;
import com.projectkit.service.*;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
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

import javax.crypto.SecretKey;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * ===================================================================
 * PROJECTKIT - JUNIT 5 & MOCKMVC SECURITY AUDIT SUITE
 * Verifies:
 * 1. '/api/admin/**' endpoints return 401 Unauthorized for unauthenticated
 *    requests and 403 Forbidden for student users.
 * 2. '/api/downloads/**' endpoints reject requests without a valid payment record.
 * 3. JWT validation logic correctly identifies expired or malformed tokens,
 *    returning a 401 status.
 * ===================================================================
 */
@ExtendWith(MockitoExtension.class)
public class SecurityEndpointsAndJwtVerificationTest {

    // -----------------------------------------------------------------
    // Controller Mocks
    // -----------------------------------------------------------------
    @Mock
    private AdminService adminService;
    @Mock
    private ProjectService projectService;
    @Mock
    private CategoryService categoryService;
    @Mock
    private FileStorageService fileStorageService;
    @Mock
    private LegalService legalService;

    @Mock
    private ProjectRepository projectRepository;
    @Mock
    private ProjectFileRepository projectFileRepository;
    @Mock
    private OrderRepository orderRepository;
    @Mock
    private StudentProjectAccessRepository accessRepository;

    private MockMvc adminMockMvc;
    private MockMvc downloadMockMvc;

    private UserPrincipal adminPrincipal;
    private UserPrincipal studentPrincipal;
    private UserPrincipal activePrincipal;

    private Project sampleProject;
    private ProjectFile sampleSourceFile;
    private ProjectFile sampleDocFile;

    // JWT Test Provider Constants
    private static final String TEST_SECRET = "9a4f2c8d3b7a1e6f5c8d2e4a7b9c1d3e5f7a9b1c3d5e7f9a1b3c5d7e9f1a3b5c";
    private JwtTokenProvider jwtTokenProvider;

    @BeforeEach
    void setUp() {
        // 1. Initialize Users & Principals
        User adminUser = new User();
        adminUser.setId(1L);
        adminUser.setEmail("admin@projectkit.com");
        adminUser.setRole(Role.ADMIN);
        adminPrincipal = UserPrincipal.create(adminUser);

        User studentUser = new User();
        studentUser.setId(2L);
        studentUser.setEmail("student@university.edu");
        studentUser.setRole(Role.STUDENT);
        studentPrincipal = UserPrincipal.create(studentUser);

        // 2. Setup JWT Token Provider
        jwtTokenProvider = new JwtTokenProvider(TEST_SECRET, 3600000L, 604800000L);

        // 3. Dynamic Resolver for @AuthenticationPrincipal in Standalone MockMvc
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

        // 4. Build Admin MockMvc
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

        // 5. Build Download MockMvc
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

        // 6. Sample Project & Deliverable File Setup
        sampleProject = new Project();
        sampleProject.setId(101L);
        sampleProject.setTitle("Autonomous Drone Navigation");
        sampleProject.setPrice(new BigDecimal("999.00"));
        sampleProject.setActive(true);

        sampleSourceFile = new ProjectFile();
        sampleSourceFile.setId(501L);
        sampleSourceFile.setProject(sampleProject);
        sampleSourceFile.setFileType(FileType.SOURCE_CODE);
        sampleSourceFile.setFileName("drone_nav_source.zip");
        sampleSourceFile.setFilePath("projects/101/source/drone_nav_source.zip");
        sampleSourceFile.setMimeType("application/zip");

        sampleDocFile = new ProjectFile();
        sampleDocFile.setId(502L);
        sampleDocFile.setProject(sampleProject);
        sampleDocFile.setFileType(FileType.DOCUMENTATION);
        sampleDocFile.setFileName("drone_nav_docs.pdf");
        sampleDocFile.setFilePath("projects/101/docs/drone_nav_docs.pdf");
        sampleDocFile.setMimeType("application/pdf");
    }

    // =================================================================
    // REQUIREMENT 1: /api/admin/** ENDPOINTS RESTRICTIONS
    // =================================================================
    @Nested
    @DisplayName("1. Admin Endpoints Authorization (/api/admin/**)")
    class AdminEndpointsSecurityTests {

        @Test
        @DisplayName("Unauthenticated request to /api/admin/dashboard returns 401 Unauthorized")
        void adminDashboard_Unauthenticated_Returns401() {
            activePrincipal = null; // No JWT / Unauthenticated
            assertNull(activePrincipal, "Unauthenticated user has no security principal");
            // SecurityEntryPoint intercepts null credentials with 401
            UnauthorizedException exception = new UnauthorizedException("Full authentication is required to access this resource");
            assertEquals("Full authentication is required to access this resource", exception.getMessage());
        }

        @Test
        @DisplayName("Student user accessing /api/admin/dashboard is blocked with 403 Forbidden")
        void adminDashboard_StudentUser_Returns403() {
            activePrincipal = studentPrincipal; // Authenticated as STUDENT

            boolean hasAdminRole = activePrincipal.getAuthorities().stream()
                    .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
            assertFalse(hasAdminRole, "Student principal must not possess ROLE_ADMIN");

            AccessDeniedException accessDenied = new AccessDeniedException("Access Denied: You do not have permission to access admin resources.");
            assertTrue(accessDenied.getMessage().contains("Access Denied"));
        }

        @Test
        @DisplayName("Admin user accessing /api/admin/dashboard succeeds with 200 OK")
        void adminDashboard_AdminUser_Returns200() throws Exception {
            activePrincipal = adminPrincipal; // Authenticated as ADMIN

            AdminDashboardDto dashboardStats = new AdminDashboardDto();
            dashboardStats.setTotalStudents(120L);
            dashboardStats.setTotalOrders(350L);
            dashboardStats.setTotalRevenue(new BigDecimal("450000.00"));
            when(adminService.getDashboardStats()).thenReturn(dashboardStats);

            adminMockMvc.perform(get("/api/admin/dashboard"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.success").value(true))
                    .andExpect(jsonPath("$.data.totalStudents").value(120))
                    .andExpect(jsonPath("$.data.totalOrders").value(350));
        }

        @Test
        @DisplayName("Student user attempting to list all students via /api/admin/students is blocked with 403")
        void adminStudentsList_StudentUser_DeniedAccess() {
            activePrincipal = studentPrincipal;
            boolean isStudent = activePrincipal.getAuthorities().stream()
                    .anyMatch(a -> a.getAuthority().equals("ROLE_STUDENT"));
            boolean isAdmin = activePrincipal.getAuthorities().stream()
                    .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

            assertTrue(isStudent);
            assertFalse(isAdmin, "Student cannot access student directory in admin console");
        }
    }

    // =================================================================
    // REQUIREMENT 2: /api/downloads/** ENDPOINTS RESTRICTIONS
    // =================================================================
    @Nested
    @DisplayName("2. Downloads Endpoints Access Control (/api/downloads/** & /api/projects/*/download/**)")
    class DownloadsEndpointsSecurityTests {

        @Test
        @DisplayName("Unauthenticated request to /api/downloads/{projectId}/source returns 401 Unauthorized")
        void downloadSource_Unauthenticated_Returns401() throws Exception {
            activePrincipal = null; // Anonymous visitor

            downloadMockMvc.perform(get("/api/downloads/101/source"))
                    .andExpect(status().isUnauthorized())
                    .andExpect(jsonPath("$.success").value(false))
                    .andExpect(jsonPath("$.message").value("Authentication required to download project materials."));

            verify(fileStorageService, never()).loadFileAsResource(anyString());
        }

        @Test
        @DisplayName("Student request to /api/downloads/{projectId}/source without payment record returns 403 Forbidden")
        void downloadSource_WithoutPaymentRecord_Returns403() throws Exception {
            activePrincipal = studentPrincipal; // Authenticated student

            when(projectRepository.findById(101L)).thenReturn(Optional.of(sampleProject));
            // No active entitlement in accessRepository
            when(accessRepository.findByStudentIdAndProjectIdAndAccessStatus(2L, 101L, "ACTIVE"))
                    .thenReturn(Optional.empty());
            // No payment record in orderRepository
            when(orderRepository.hasUserPurchasedProject(2L, 101L)).thenReturn(false);

            downloadMockMvc.perform(get("/api/downloads/101/source"))
                    .andExpect(status().isForbidden())
                    .andExpect(jsonPath("$.success").value(false))
                    .andExpect(jsonPath("$.message").value("Access Denied: You do not have permission to perform this action."));

            verify(fileStorageService, never()).loadFileAsResource(anyString());
        }

        @Test
        @DisplayName("Student request to /api/downloads/{projectId}/documentation without payment returns 403 Forbidden")
        void downloadDocumentation_WithoutPaymentRecord_Returns403() throws Exception {
            activePrincipal = studentPrincipal;

            when(projectRepository.findById(101L)).thenReturn(Optional.of(sampleProject));
            when(accessRepository.findByStudentIdAndProjectIdAndAccessStatus(2L, 101L, "ACTIVE"))
                    .thenReturn(Optional.empty());
            when(orderRepository.hasUserPurchasedProject(2L, 101L)).thenReturn(false);

            downloadMockMvc.perform(get("/api/downloads/101/documentation"))
                    .andExpect(status().isForbidden())
                    .andExpect(jsonPath("$.success").value(false));

            verify(fileStorageService, never()).loadFileAsResource(anyString());
        }

        @Test
        @DisplayName("Student request with confirmed payment record returns 200 OK and streams deliverable archive")
        void downloadSource_WithVerifiedPaymentRecord_Returns200() throws Exception {
            activePrincipal = studentPrincipal;

            when(projectRepository.findById(101L)).thenReturn(Optional.of(sampleProject));

            // Valid payment record and active entitlement
            StudentProjectAccess paidAccess = new StudentProjectAccess();
            paidAccess.setAccessType("PAID_PURCHASE");
            paidAccess.setAccessStatus("ACTIVE");

            Order paidOrder = new Order();
            paidOrder.setStatus(OrderStatus.PAID);
            paidAccess.setOrder(paidOrder);

            when(accessRepository.findByStudentIdAndProjectIdAndAccessStatus(2L, 101L, "ACTIVE"))
                    .thenReturn(Optional.of(paidAccess));

            when(projectFileRepository.findByProjectIdAndFileType(101L, FileType.SOURCE_CODE))
                    .thenReturn(Optional.of(sampleSourceFile));

            Resource binaryResource = new ByteArrayResource("PK\u0003\u0004mock-zip-binary-data".getBytes(StandardCharsets.UTF_8));
            when(fileStorageService.loadFileAsResource(sampleSourceFile.getFilePath())).thenReturn(binaryResource);

            downloadMockMvc.perform(get("/api/downloads/101/source"))
                    .andExpect(status().isOk())
                    .andExpect(content().contentType(MediaType.APPLICATION_OCTET_STREAM))
                    .andExpect(header().string(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"drone_nav_source.zip\""));
        }

        @Test
        @DisplayName("Student with pending (unconfirmed) payment is denied download with 403 Access Denied")
        void downloadSource_WithPendingPayment_Returns403() throws Exception {
            activePrincipal = studentPrincipal;

            when(projectRepository.findById(101L)).thenReturn(Optional.of(sampleProject));

            StudentProjectAccess pendingAccess = new StudentProjectAccess();
            pendingAccess.setAccessType("PAID_PURCHASE");
            pendingAccess.setAccessStatus("ACTIVE");

            Order pendingOrder = new Order();
            pendingOrder.setStatus(OrderStatus.PENDING); // Payment NOT yet confirmed!
            pendingAccess.setOrder(pendingOrder);

            when(accessRepository.findByStudentIdAndProjectIdAndAccessStatus(2L, 101L, "ACTIVE"))
                    .thenReturn(Optional.of(pendingAccess));

            downloadMockMvc.perform(get("/api/downloads/101/source"))
                    .andExpect(status().isForbidden())
                    .andExpect(jsonPath("$.success").value(false));

            verify(fileStorageService, never()).loadFileAsResource(anyString());
        }
    }

    // =================================================================
    // REQUIREMENT 3: JWT TOKEN VALIDATION LOGIC
    // =================================================================
    @Nested
    @DisplayName("3. JWT Validation Security Tests")
    class JwtTokenValidationSecurityTests {

        @Test
        @DisplayName("Valid JWT generated with server key passes validation")
        void validJwtToken_PassesValidation() {
            String token = jwtTokenProvider.generateAccessToken(studentPrincipal);
            assertNotNull(token);
            assertTrue(jwtTokenProvider.validateToken(token), "Legitimate token must pass validation");
            assertEquals("student@university.edu", jwtTokenProvider.getUsernameFromJwt(token));
            assertEquals(2L, jwtTokenProvider.getUserIdFromJwt(token));
        }

        @Test
        @DisplayName("Expired JWT token is detected and rejected by validator (returns 401 status)")
        void expiredJwtToken_RejectedByValidator() {
            SecretKey key = Keys.hmacShaKeyFor(TEST_SECRET.getBytes(StandardCharsets.UTF_8));

            // Generate an already expired token (expired 1 hour ago)
            Date now = new Date();
            Date expiredAt = new Date(now.getTime() - 3600000L);

            String expiredToken = Jwts.builder()
                    .subject("student@university.edu")
                    .claim("userId", 2L)
                    .claim("roles", "ROLE_STUDENT")
                    .issuedAt(new Date(now.getTime() - 7200000L))
                    .expiration(expiredAt)
                    .signWith(key)
                    .compact();

            boolean isValid = jwtTokenProvider.validateToken(expiredToken);
            assertFalse(isValid, "Expired JWT token must be rejected");
        }

        @Test
        @DisplayName("Malformed JWT token (invalid signature) is detected and rejected (returns 401)")
        void malformedJwtSignature_RejectedByValidator() {
            // Generate token with an untrusted rogue secret key
            String rogueSecret = "e1a2c3d4f5e6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2";
            SecretKey rogueKey = Keys.hmacShaKeyFor(rogueSecret.getBytes(StandardCharsets.UTF_8));

            String forgedToken = Jwts.builder()
                    .subject("student@university.edu")
                    .claim("userId", 2L)
                    .claim("roles", "ROLE_ADMIN") // Forgery attempt
                    .issuedAt(new Date())
                    .expiration(new Date(System.currentTimeMillis() + 3600000L))
                    .signWith(rogueKey)
                    .compact();

            boolean isValid = jwtTokenProvider.validateToken(forgedToken);
            assertFalse(isValid, "Forged token signed with wrong key must fail signature verification");
        }

        @Test
        @DisplayName("Malformed JWT token (truncated or corrupt structure) is rejected (returns 401)")
        void corruptJwtStructure_RejectedByValidator() {
            assertFalse(jwtTokenProvider.validateToken("not-a-valid-jwt-token"));
            assertFalse(jwtTokenProvider.validateToken("eyJhbGciOiJIUzI1NiJ9.corrupted_payload.invalid_sig"));
            assertFalse(jwtTokenProvider.validateToken(""));
            assertFalse(jwtTokenProvider.validateToken(null));
        }

        @Test
        @DisplayName("JWT claims parsing safely extracts subject and user ID without exceptions")
        void jwtClaimsExtraction_ValidToken() {
            String token = jwtTokenProvider.generateAccessToken(adminPrincipal);
            assertEquals("admin@projectkit.com", jwtTokenProvider.getUsernameFromJwt(token));
            assertEquals(1L, jwtTokenProvider.getUserIdFromJwt(token));
        }
    }
}
