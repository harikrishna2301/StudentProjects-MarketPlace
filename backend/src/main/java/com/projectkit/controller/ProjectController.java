package com.projectkit.controller;

import com.projectkit.dto.response.ApiResponse;
import com.projectkit.dto.response.PagedResponse;
import com.projectkit.dto.response.ProjectDto;
import com.projectkit.dto.response.ProjectSummaryDto;
import com.projectkit.enums.DifficultyLevel;
import com.projectkit.security.UserPrincipal;
import com.projectkit.service.ProjectService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.CacheControl;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.concurrent.TimeUnit;

@RestController
@RequestMapping("/api/projects")
@Tag(name = "Projects", description = "Public project catalog, search, filters and project details")
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @GetMapping
    @Operation(summary = "Browse and search projects", description = "Supports keyword search, category, difficulty, min/max price and sorting")
    public ResponseEntity<ApiResponse<PagedResponse<ProjectSummaryDto>>> getProjects(
            @Parameter(description = "Search keyword across title, technologies and description")
            @RequestParam(required = false) String keyword,
            @Parameter(description = "Category ID filter")
            @RequestParam(required = false) Long categoryId,
            @Parameter(description = "Difficulty level filter (BEGINNER, INTERMEDIATE, ADVANCED)")
            @RequestParam(required = false) DifficultyLevel difficulty,
            @Parameter(description = "Minimum price filter")
            @RequestParam(required = false) BigDecimal minPrice,
            @Parameter(description = "Maximum price filter")
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDir
    ) {
        PagedResponse<ProjectSummaryDto> response = projectService.getProjects(
                keyword, categoryId, difficulty, minPrice, maxPrice, page, size, sortBy, sortDir
        );
        return ResponseEntity.ok()
                .cacheControl(CacheControl.maxAge(5, TimeUnit.MINUTES).cachePublic())
                .body(ApiResponse.success(response));
    }

    @GetMapping("/featured")
    @Operation(summary = "Get featured projects", description = "Returns curated featured projects for homepage banner showcase")
    public ResponseEntity<ApiResponse<List<ProjectSummaryDto>>> getFeaturedProjects() {
        List<ProjectSummaryDto> featured = projectService.getFeaturedProjects();
        return ResponseEntity.ok()
                .cacheControl(CacheControl.maxAge(10, TimeUnit.MINUTES).cachePublic())
                .body(ApiResponse.success(featured));
    }

    @GetMapping("/popular")
    @Operation(summary = "Get most popular projects", description = "Returns top purchased academic project kits")
    public ResponseEntity<ApiResponse<List<ProjectSummaryDto>>> getPopularProjects() {
        List<ProjectSummaryDto> popular = projectService.getTopPurchasedProjects();
        return ResponseEntity.ok()
                .cacheControl(CacheControl.maxAge(10, TimeUnit.MINUTES).cachePublic())
                .body(ApiResponse.success(popular));
    }

    @GetMapping("/{slug}")
    @Operation(summary = "Get project details by slug", description = "Returns full project specifications, technologies, screenshots and purchase status")
    public ResponseEntity<ApiResponse<ProjectDto>> getProjectBySlug(
            @PathVariable String slug,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        ProjectDto project = projectService.getProjectBySlug(slug, currentUser);
        CacheControl cacheControl = currentUser != null 
                ? CacheControl.noStore().mustRevalidate()
                : CacheControl.maxAge(2, TimeUnit.MINUTES).cachePublic();
        return ResponseEntity.ok()
                .cacheControl(cacheControl)
                .body(ApiResponse.success(project));
    }

    @GetMapping("/id/{id}")
    @Operation(summary = "Get project details by ID", description = "Returns full project specifications by database ID")
    public ResponseEntity<ApiResponse<ProjectDto>> getProjectById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        ProjectDto project = projectService.getProjectById(id, currentUser);
        CacheControl cacheControl = currentUser != null 
                ? CacheControl.noStore().mustRevalidate()
                : CacheControl.maxAge(2, TimeUnit.MINUTES).cachePublic();
        return ResponseEntity.ok()
                .cacheControl(cacheControl)
                .body(ApiResponse.success(project));
    }
}
