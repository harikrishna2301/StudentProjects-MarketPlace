package com.projectkit.service.impl;

import com.projectkit.dto.request.CreateProjectRequest;
import com.projectkit.dto.request.UpdateProjectRequest;
import com.projectkit.dto.response.PagedResponse;
import com.projectkit.dto.response.ProjectDto;
import com.projectkit.dto.response.ProjectSummaryDto;
import com.projectkit.entity.Category;
import com.projectkit.entity.Project;
import com.projectkit.entity.ProjectFile;
import com.projectkit.enums.DifficultyLevel;
import com.projectkit.enums.FileType;
import com.projectkit.exception.BadRequestException;
import com.projectkit.exception.ResourceNotFoundException;
import com.projectkit.repository.CategoryRepository;
import com.projectkit.repository.OrderRepository;
import com.projectkit.repository.ProjectFileRepository;
import com.projectkit.repository.ProjectRepository;
import com.projectkit.security.UserPrincipal;
import com.projectkit.service.ProjectService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.text.Normalizer;
import java.util.List;
import java.util.Locale;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class ProjectServiceImpl implements ProjectService {

    private static final Pattern NONLATIN = Pattern.compile("[^\\w-]");
    private static final Pattern WHITESPACE = Pattern.compile("[\\s]");

    private final ProjectRepository projectRepository;
    private final CategoryRepository categoryRepository;
    private final ProjectFileRepository projectFileRepository;
    private final OrderRepository orderRepository;

    public ProjectServiceImpl(ProjectRepository projectRepository,
                              CategoryRepository categoryRepository,
                              ProjectFileRepository projectFileRepository,
                              OrderRepository orderRepository) {
        this.projectRepository = projectRepository;
        this.categoryRepository = categoryRepository;
        this.projectFileRepository = projectFileRepository;
        this.orderRepository = orderRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<ProjectSummaryDto> getProjects(
            String keyword,
            Long categoryId,
            DifficultyLevel difficulty,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            int page,
            int size,
            String sortBy,
            String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name())
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(page, size, sort);
        String searchKeyword = (keyword != null && !keyword.isBlank()) ? keyword.trim() : null;

        Page<Project> projectsPage = projectRepository.searchProjects(
                searchKeyword,
                categoryId,
                difficulty,
                minPrice,
                maxPrice,
                pageable
        );

        List<ProjectSummaryDto> content = projectsPage.getContent().stream()
                .map(ProjectSummaryDto::fromEntity)
                .collect(Collectors.toList());

        return PagedResponse.fromPage(projectsPage, content);
    }

    @Override
    @Transactional
    public ProjectDto getProjectBySlug(String slug, UserPrincipal currentUser) {
        Project project = projectRepository.findBySlugAndIsActiveTrue(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "slug", slug));

        // Increment view count
        project.setViewCount(project.getViewCount() + 1);
        projectRepository.save(project);

        return buildProjectDto(project, currentUser);
    }

    @Override
    @Transactional
    public ProjectDto getProjectById(Long id, UserPrincipal currentUser) {
        Project project = projectRepository.findByIdAndIsActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", id));

        project.setViewCount(project.getViewCount() + 1);
        projectRepository.save(project);

        return buildProjectDto(project, currentUser);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProjectSummaryDto> getFeaturedProjects() {
        return projectRepository.findTop8ByIsFeaturedTrueAndIsActiveTrueOrderByCreatedAtDesc().stream()
                .map(ProjectSummaryDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProjectSummaryDto> getTopPurchasedProjects() {
        return projectRepository.findTop6ByIsActiveTrueOrderByPurchaseCountDesc().stream()
                .map(ProjectSummaryDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ProjectDto createProject(CreateProjectRequest request) {
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", request.getCategoryId()));

        String slug = (request.getSlug() != null && !request.getSlug().isBlank())
                ? toSlug(request.getSlug())
                : toSlug(request.getTitle());

        if (projectRepository.existsBySlug(slug)) {
            slug = slug + "-" + System.currentTimeMillis();
        }

        Project project = new Project();
        project.setTitle(request.getTitle().trim());
        project.setSlug(slug);
        project.setShortDescription(request.getShortDescription().trim());
        project.setDetailedDescription(request.getDetailedDescription());
        project.setCategory(category);
        project.setTechnologies(request.getTechnologies().trim());
        project.setFeatures(request.getFeatures());
        project.setDifficultyLevel(request.getDifficultyLevel() != null ? request.getDifficultyLevel() : DifficultyLevel.INTERMEDIATE);
        project.setPrice(request.getPrice());
        project.setDiscountPrice(request.getDiscountPrice());
        project.setFeatured(request.getIsFeatured() != null && request.getIsFeatured());
        project.setActive(request.getIsActive() == null || request.getIsActive());
        project.setThumbnailUrl(request.getThumbnailUrl());

        Project saved = projectRepository.save(project);
        return ProjectDto.fromEntity(saved);
    }

    @Override
    @Transactional
    public ProjectDto updateProject(Long id, UpdateProjectRequest request) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", id));

        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category", "id", request.getCategoryId()));
            project.setCategory(category);
        }

        if (request.getTitle() != null && !request.getTitle().isBlank()) {
            project.setTitle(request.getTitle().trim());
        }
        if (request.getSlug() != null && !request.getSlug().isBlank()) {
            String newSlug = toSlug(request.getSlug());
            if (!newSlug.equalsIgnoreCase(project.getSlug()) && projectRepository.existsBySlug(newSlug)) {
                throw new BadRequestException("Project slug is already taken: " + newSlug);
            }
            project.setSlug(newSlug);
        }
        if (request.getShortDescription() != null) {
            project.setShortDescription(request.getShortDescription().trim());
        }
        if (request.getDetailedDescription() != null) {
            project.setDetailedDescription(request.getDetailedDescription());
        }
        if (request.getTechnologies() != null) {
            project.setTechnologies(request.getTechnologies().trim());
        }
        if (request.getFeatures() != null) {
            project.setFeatures(request.getFeatures());
        }
        if (request.getDifficultyLevel() != null) {
            project.setDifficultyLevel(request.getDifficultyLevel());
        }
        if (request.getPrice() != null) {
            project.setPrice(request.getPrice());
        }
        if (request.getDiscountPrice() != null) {
            project.setDiscountPrice(request.getDiscountPrice());
        }
        if (request.getIsFeatured() != null) {
            project.setFeatured(request.getIsFeatured());
        }
        if (request.getIsActive() != null) {
            project.setActive(request.getIsActive());
        }
        if (request.getThumbnailUrl() != null) {
            project.setThumbnailUrl(request.getThumbnailUrl());
        }

        Project updated = projectRepository.save(project);
        return ProjectDto.fromEntity(updated);
    }

    @Override
    @Transactional
    public void deleteProject(Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", id));
        // Soft delete or hard delete based on requirements; marking isActive = false preserves purchase history integrity
        project.setActive(false);
        projectRepository.save(project);
    }

    private ProjectDto buildProjectDto(Project project, UserPrincipal currentUser) {
        ProjectDto dto = ProjectDto.fromEntity(project);

        // Check user purchase status
        if (currentUser != null) {
            boolean purchased = orderRepository.hasUserPurchasedProject(currentUser.getId(), project.getId());
            dto.setPurchasedByCurrentUser(purchased);
        }

        // Check attached files
        List<ProjectFile> files = projectFileRepository.findByProjectId(project.getId());
        boolean hasSource = false;
        boolean hasDoc = false;
        List<String> screenshots = new java.util.ArrayList<>();

        for (ProjectFile f : files) {
            if (f.getFileType() == FileType.SOURCE_CODE) {
                hasSource = true;
            } else if (f.getFileType() == FileType.DOCUMENTATION) {
                hasDoc = true;
            } else if (f.getFileType() == FileType.SCREENSHOT) {
                screenshots.add("/api/projects/" + project.getId() + "/files/" + f.getId());
            }
        }

        dto.setHasSourceCode(hasSource);
        dto.setHasDocumentation(hasDoc);
        dto.setScreenshotUrls(screenshots);

        return dto;
    }

    private String toSlug(String input) {
        String nowhitespace = WHITESPACE.matcher(input.trim()).replaceAll("-");
        String normalized = Normalizer.normalize(nowhitespace, Normalizer.Form.NFD);
        String slug = NONLATIN.matcher(normalized).replaceAll("");
        return slug.toLowerCase(Locale.ENGLISH);
    }
}
