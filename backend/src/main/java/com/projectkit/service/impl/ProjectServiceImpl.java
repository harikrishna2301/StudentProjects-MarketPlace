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
    private final com.projectkit.repository.StudentProjectAccessRepository accessRepository;

    public ProjectServiceImpl(ProjectRepository projectRepository,
                              CategoryRepository categoryRepository,
                              ProjectFileRepository projectFileRepository,
                              OrderRepository orderRepository,
                              com.projectkit.repository.StudentProjectAccessRepository accessRepository) {
        this.projectRepository = projectRepository;
        this.categoryRepository = categoryRepository;
        this.projectFileRepository = projectFileRepository;
        this.orderRepository = orderRepository;
        this.accessRepository = accessRepository;
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

        // Access type validation & configuration
        boolean isFree = Boolean.TRUE.equals(request.getIsFree()) || "FREE".equalsIgnoreCase(request.getAccessType());
        if (isFree) {
            project.setFree(true);
            project.setAccessType("FREE");
            project.setPrice(BigDecimal.ZERO);
            project.setDiscountPrice(null);
        } else {
            project.setFree(false);
            project.setAccessType("PAID");
            if (request.getPrice() == null || request.getPrice().compareTo(BigDecimal.ZERO) <= 0) {
                throw new BadRequestException("Paid projects require a valid price greater than zero.");
            }
            if (request.getDiscountPrice() != null && request.getDiscountPrice().compareTo(request.getPrice()) > 0) {
                throw new BadRequestException("Discount price cannot exceed the original price.");
            }
            project.setPrice(request.getPrice());
            project.setDiscountPrice(request.getDiscountPrice());
        }

        project.setPublicationStatus(request.getPublicationStatus() != null ? request.getPublicationStatus() : "PUBLISHED");
        project.setFeatured(request.getIsFeatured() != null && request.getIsFeatured());
        project.setActive(request.getIsActive() == null || request.getIsActive());
        project.setThumbnailUrl(request.getThumbnailUrl());
        project.setDemoUrl(request.getDemoUrl());
        project.setDemoVideoUrl(request.getDemoVideoUrl());

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

        // Access type change handling
        if (request.getIsFree() != null || request.getAccessType() != null) {
            boolean updateToFree = Boolean.TRUE.equals(request.getIsFree()) || "FREE".equalsIgnoreCase(request.getAccessType());
            if (updateToFree) {
                project.setFree(true);
                project.setAccessType("FREE");
                project.setPrice(BigDecimal.ZERO);
                project.setDiscountPrice(null);
            } else {
                project.setFree(false);
                project.setAccessType("PAID");
            }
        }

        if (!project.isFree()) {
            if (request.getPrice() != null) {
                if (request.getPrice().compareTo(BigDecimal.ZERO) <= 0) {
                    throw new BadRequestException("Paid projects require a valid price greater than zero.");
                }
                project.setPrice(request.getPrice());
            }
            if (request.getDiscountPrice() != null) {
                if (request.getDiscountPrice().compareTo(project.getPrice()) > 0) {
                    throw new BadRequestException("Discount price cannot exceed the original price.");
                }
                project.setDiscountPrice(request.getDiscountPrice());
            }
        }

        if (request.getPublicationStatus() != null) {
            project.setPublicationStatus(request.getPublicationStatus());
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
        if (request.getDemoUrl() != null) {
            project.setDemoUrl(request.getDemoUrl());
        }
        if (request.getDemoVideoUrl() != null) {
            project.setDemoVideoUrl(request.getDemoVideoUrl());
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

        // Check user purchase and claim entitlement status
        if (currentUser != null) {
            boolean hasActiveEntitlement = accessRepository.hasActiveAccess(currentUser.getId(), project.getId());
            boolean purchased = hasActiveEntitlement || orderRepository.hasUserPurchasedProject(currentUser.getId(), project.getId());
            dto.setPurchasedByCurrentUser(purchased);
            dto.setClaimedByCurrentUser(hasActiveEntitlement);
        }

        // Check attached files
        List<ProjectFile> files = projectFileRepository.findByProjectId(project.getId());
        boolean hasSource = false;
        boolean hasDoc = false;
        boolean hasPresentation = false;
        boolean hasDemoVideo = false;
        List<String> screenshots = new java.util.ArrayList<>();

        for (ProjectFile f : files) {
            if (f.getFileType() == FileType.SOURCE_CODE) {
                hasSource = true;
            } else if (f.getFileType() == FileType.DOCUMENTATION) {
                hasDoc = true;
            } else if (f.getFileType() == FileType.PRESENTATION) {
                hasPresentation = true;
            } else if (f.getFileType() == FileType.DEMO_VIDEO) {
                hasDemoVideo = true;
            } else if (f.getFileType() == FileType.SCREENSHOT) {
                screenshots.add("/api/projects/" + project.getId() + "/files/" + f.getId());
            }
        }

        dto.setHasSourceCode(hasSource);
        dto.setHasDocumentation(hasDoc);
        dto.setHasPresentation(hasPresentation);
        dto.setHasDemoVideo(hasDemoVideo);
        dto.setDemoUrl(project.getDemoUrl());
        dto.setDemoVideoUrl(project.getDemoVideoUrl());
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
