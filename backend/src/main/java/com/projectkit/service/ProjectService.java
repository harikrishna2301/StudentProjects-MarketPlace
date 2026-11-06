package com.projectkit.service;

import com.projectkit.dto.request.CreateProjectRequest;
import com.projectkit.dto.request.UpdateProjectRequest;
import com.projectkit.dto.response.PagedResponse;
import com.projectkit.dto.response.ProjectDto;
import com.projectkit.dto.response.ProjectSummaryDto;
import com.projectkit.enums.DifficultyLevel;
import com.projectkit.security.UserPrincipal;

import java.math.BigDecimal;
import java.util.List;

public interface ProjectService {

    PagedResponse<ProjectSummaryDto> getProjects(
            String keyword,
            Long categoryId,
            DifficultyLevel difficulty,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            int page,
            int size,
            String sortBy,
            String sortDir
    );

    ProjectDto getProjectBySlug(String slug, UserPrincipal currentUser);

    ProjectDto getProjectById(Long id, UserPrincipal currentUser);

    List<ProjectSummaryDto> getFeaturedProjects();

    List<ProjectSummaryDto> getTopPurchasedProjects();

    ProjectDto createProject(CreateProjectRequest request);

    ProjectDto updateProject(Long id, UpdateProjectRequest request);

    void deleteProject(Long id);
}
