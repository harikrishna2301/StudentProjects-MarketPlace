package com.projectkit.controller;

import com.projectkit.dto.response.PagedResponse;
import com.projectkit.dto.response.ProjectDto;
import com.projectkit.dto.response.ProjectSummaryDto;
import com.projectkit.enums.DifficultyLevel;
import com.projectkit.service.ProjectService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.core.MethodParameter;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

import java.math.BigDecimal;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
public class ProjectControllerTest {

    private MockMvc mockMvc;

    @Mock
    private ProjectService projectService;

    @InjectMocks
    private ProjectController projectController;

    @BeforeEach
    void setUp() {
        HandlerMethodArgumentResolver authPrincipalResolver = new HandlerMethodArgumentResolver() {
            @Override
            public boolean supportsParameter(MethodParameter parameter) {
                return parameter.hasParameterAnnotation(AuthenticationPrincipal.class);
            }

            @Override
            public Object resolveArgument(MethodParameter parameter,
                                          ModelAndViewContainer mavContainer,
                                          NativeWebRequest webRequest,
                                          WebDataBinderFactory binderFactory) {
                return null;
            }
        };

        mockMvc = MockMvcBuilders.standaloneSetup(projectController)
                .setCustomArgumentResolvers(authPrincipalResolver)
                .build();
    }

    @Test
    @DisplayName("GET /api/projects returns HTTP 200 OK with cache-control max-age=300")
    void getProjects_ReturnsHttp200AndCacheHeaders() throws Exception {
        ProjectSummaryDto summary = new ProjectSummaryDto();
        summary.setId(1L);
        summary.setTitle("AI Medical Diagnosis");
        summary.setSlug("ai-medical-diagnosis");
        summary.setPrice(new BigDecimal("999.00"));
        summary.setDifficultyLevel(DifficultyLevel.INTERMEDIATE);

        PagedResponse<ProjectSummaryDto> paged = new PagedResponse<>(
                List.of(summary), 0, 12, 1L, 1, true
        );

        when(projectService.getProjects(any(), any(), any(), any(), any(), any(Integer.class), any(Integer.class), any(), any()))
                .thenReturn(paged);

        mockMvc.perform(get("/api/projects?keyword=medical"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.content[0].title").value("AI Medical Diagnosis"))
                .andExpect(header().string("Cache-Control", "max-age=300, public"));
    }

    @Test
    @DisplayName("GET /api/projects/featured returns HTTP 200 OK with cache-control max-age=600")
    void getFeaturedProjects_ReturnsHttp200AndCacheHeaders() throws Exception {
        ProjectSummaryDto summary = new ProjectSummaryDto();
        summary.setId(2L);
        summary.setTitle("Autonomous Drone");
        summary.setSlug("autonomous-drone");

        when(projectService.getFeaturedProjects()).thenReturn(List.of(summary));

        mockMvc.perform(get("/api/projects/featured"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data[0].title").value("Autonomous Drone"))
                .andExpect(header().string("Cache-Control", "max-age=600, public"));
    }

    @Test
    @DisplayName("GET /api/projects/{slug} returns HTTP 200 OK with project details")
    void getProjectBySlug_ReturnsHttp200() throws Exception {
        ProjectDto dto = new ProjectDto();
        dto.setId(3L);
        dto.setTitle("Smart Grid IoT");
        dto.setSlug("smart-grid-iot");
        dto.setPrice(new BigDecimal("1299.00"));
        dto.setPurchasedByCurrentUser(false);

        when(projectService.getProjectBySlug("smart-grid-iot", null)).thenReturn(dto);

        mockMvc.perform(get("/api/projects/smart-grid-iot"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.title").value("Smart Grid IoT"))
                .andExpect(header().string("Cache-Control", "max-age=120, public"));
    }
}
