package com.projectkit.controller;

import com.projectkit.entity.Project;
import com.projectkit.entity.ProjectFile;
import com.projectkit.entity.User;
import com.projectkit.enums.FileType;
import com.projectkit.enums.Role;
import com.projectkit.exception.GlobalExceptionHandler;
import com.projectkit.repository.OrderRepository;
import com.projectkit.repository.ProjectFileRepository;
import com.projectkit.repository.ProjectRepository;
import com.projectkit.security.UserPrincipal;
import com.projectkit.service.FileStorageService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.core.MethodParameter;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

import java.nio.charset.StandardCharsets;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
public class DownloadAuthorizationSecurityTest {

    @Mock
    private ProjectRepository projectRepository;

    @Mock
    private ProjectFileRepository projectFileRepository;

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private FileStorageService fileStorageService;

    private MockMvc mockMvc;

    private User studentUser;
    private UserPrincipal studentPrincipal;
    private Project sampleProject;
    private ProjectFile sampleFile;

    // Custom resolver to dynamically inject currentUser into controller under test
    private UserPrincipal activeTestPrincipal;

    @BeforeEach
    void setUp() {
        DownloadController downloadController = new DownloadController(
                projectRepository,
                projectFileRepository,
                orderRepository,
                fileStorageService
        );

        mockMvc = MockMvcBuilders.standaloneSetup(downloadController)
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

        studentUser = new User();
        studentUser.setId(5L);
        studentUser.setEmail("student@test.com");
        studentUser.setRole(Role.STUDENT);

        studentPrincipal = UserPrincipal.create(studentUser);

        sampleProject = new Project();
        sampleProject.setId(10L);
        sampleProject.setTitle("Machine Learning Classifier");

        sampleFile = new ProjectFile();
        sampleFile.setId(100L);
        sampleFile.setProject(sampleProject);
        sampleFile.setFileType(FileType.SOURCE_CODE);
        sampleFile.setFileName("classifier_src.zip");
        sampleFile.setFilePath("projects/10/source/classifier_src.zip");
        sampleFile.setMimeType("application/zip");
    }

    @Test
    @DisplayName("TASK 4 & 6: Anonymous user accessing project downloads must return HTTP 401 Unauthorized")
    void downloadSource_AnonymousUser_ShouldReturn401() throws Exception {
        activeTestPrincipal = null; // Unauthenticated request

        mockMvc.perform(get("/api/projects/10/download/source"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Authentication required to download project materials."));
    }

    @Test
    @DisplayName("TASK 4 & 6: Student downloading unpurchased project must return HTTP 403 Forbidden")
    void downloadSource_UnpurchasedProject_ShouldReturn403() throws Exception {
        activeTestPrincipal = studentPrincipal;

        when(projectRepository.findById(10L)).thenReturn(Optional.of(sampleProject));
        when(orderRepository.hasUserPurchasedProject(5L, 10L)).thenReturn(false);

        mockMvc.perform(get("/api/projects/10/download/source"))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Access Denied: You do not have permission to perform this action."));

        verify(fileStorageService, never()).loadFileAsResource(anyString());
    }

    @Test
    @DisplayName("TASK 4 & 6: Student downloading verified purchased project must return HTTP 200 with streamed file")
    void downloadSource_PurchasedProject_ShouldReturn200() throws Exception {
        activeTestPrincipal = studentPrincipal;

        when(projectRepository.findById(10L)).thenReturn(Optional.of(sampleProject));
        when(orderRepository.hasUserPurchasedProject(5L, 10L)).thenReturn(true);
        when(projectFileRepository.findByProjectIdAndFileType(10L, FileType.SOURCE_CODE))
                .thenReturn(Optional.of(sampleFile));

        Resource mockResource = new ByteArrayResource("PK\u0003\u0004mock zip content".getBytes(StandardCharsets.UTF_8));
        when(fileStorageService.loadFileAsResource(sampleFile.getFilePath())).thenReturn(mockResource);

        mockMvc.perform(get("/api/projects/10/download/source"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_OCTET_STREAM))
                .andExpect(header().string(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"classifier_src.zip\""));
    }

    @Test
    @DisplayName("TASK 4 & 6: Download attempt for non-existent project must return HTTP 404 Not Found")
    void downloadSource_NonExistentProject_ShouldReturn404() throws Exception {
        activeTestPrincipal = studentPrincipal;

        when(projectRepository.findById(999L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/projects/999/download/source"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success").value(false));
    }
}
