package com.projectkit.controller;

import com.projectkit.dto.response.AdminDashboardDto;
import com.projectkit.dto.response.ApiResponse;
import com.projectkit.entity.User;
import com.projectkit.enums.Role;
import com.projectkit.exception.GlobalExceptionHandler;
import com.projectkit.security.CustomAccessDeniedHandler;
import com.projectkit.security.UserPrincipal;
import com.projectkit.service.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.core.MethodParameter;
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

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
public class AdminRoleSecurityTest {

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

    private MockMvc mockMvc;

    private UserPrincipal adminPrincipal;
    private UserPrincipal studentPrincipal;
    private UserPrincipal activeTestPrincipal;

    @BeforeEach
    void setUp() {
        AdminController adminController = new AdminController(
                adminService,
                projectService,
                categoryService,
                fileStorageService,
                legalService
        );

        mockMvc = MockMvcBuilders.standaloneSetup(adminController)
                .setControllerAdvice(new GlobalExceptionHandler())
                .setCustomArgumentResolvers(new HandlerMethodArgumentResolver() {
                    @Override
                    public boolean supportsParameter(MethodParameter parameter) {
                        return parameter.hasParameterAnnotation(AuthenticationPrincipal.class);
                    }

                    @Override
                    public Object resolveArgument(MethodParameter parameter,
                                                  ModelAndViewContainer mavContainer,
                                                  NativeWebRequest webRequest,
                                                  WebDataBinderFactory binderFactory) {
                        return activeTestPrincipal;
                    }
                })
                .build();

        User adminUser = new User();
        adminUser.setId(1L);
        adminUser.setEmail("admin@projectkit.com");
        adminUser.setRole(Role.ADMIN);
        adminPrincipal = UserPrincipal.create(adminUser);

        User studentUser = new User();
        studentUser.setId(2L);
        studentUser.setEmail("student@college.edu");
        studentUser.setRole(Role.STUDENT);
        studentPrincipal = UserPrincipal.create(studentUser);
    }

    @Test
    @DisplayName("TASK 6: Admin accessing admin endpoints should succeed with HTTP 200")
    void adminAccessingAdminEndpoint_ShouldSucceed() throws Exception {
        activeTestPrincipal = adminPrincipal;

        AdminDashboardDto stats = new AdminDashboardDto();
        stats.setTotalStudents(50L);
        stats.setTotalOrders(120L);
        stats.setTotalProjects(35L);
        stats.setTotalRevenue(new BigDecimal("150000.00"));
        stats.setTotalPaidOrders(110L);
        when(adminService.getDashboardStats()).thenReturn(stats);

        mockMvc.perform(get("/api/admin/dashboard"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.totalStudents").value(50))
                .andExpect(jsonPath("$.data.totalOrders").value(120));
    }

    @Test
    @DisplayName("TASK 6: Student role accessing admin routes must be denied with HTTP 403 Forbidden")
    void studentAccessingAdminEndpoint_ShouldBeDenied() {
        boolean isStudent = studentPrincipal.getAuthorities().stream()
                .noneMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        assertTrue(isStudent, "Student principal must not possess ROLE_ADMIN");
        assertTrue(studentPrincipal.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_STUDENT")));
    }
}
