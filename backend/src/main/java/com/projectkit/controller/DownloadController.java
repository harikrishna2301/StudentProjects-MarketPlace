package com.projectkit.controller;

import com.projectkit.entity.ProjectFile;
import com.projectkit.enums.FileType;
import com.projectkit.enums.Role;
import com.projectkit.exception.ResourceNotFoundException;
import com.projectkit.exception.UnauthorizedException;
import com.projectkit.repository.OrderRepository;
import com.projectkit.repository.ProjectFileRepository;
import com.projectkit.repository.ProjectRepository;
import com.projectkit.security.UserPrincipal;
import com.projectkit.service.FileStorageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping({"/api/projects", "/api/downloads"})
@Tag(name = "Downloads & Media", description = "Secure authorized project kit downloads and public media access")
public class DownloadController {

    private final ProjectRepository projectRepository;
    private final ProjectFileRepository projectFileRepository;
    private final OrderRepository orderRepository;
    private final com.projectkit.repository.StudentProjectAccessRepository accessRepository;
    private final FileStorageService fileStorageService;

    public DownloadController(ProjectRepository projectRepository,
                              ProjectFileRepository projectFileRepository,
                              OrderRepository orderRepository,
                              com.projectkit.repository.StudentProjectAccessRepository accessRepository,
                              FileStorageService fileStorageService) {
        this.projectRepository = projectRepository;
        this.projectFileRepository = projectFileRepository;
        this.orderRepository = orderRepository;
        this.accessRepository = accessRepository;
        this.fileStorageService = fileStorageService;
    }

    @GetMapping({"/{projectId}/download/source", "/{projectId}/source", "/{projectId}"})
    @SecurityRequirement(name = "BearerAuth")
    @Operation(summary = "Download project source code ZIP", description = "Verifies student purchase and paid order status before streaming the source archive")
    public ResponseEntity<Resource> downloadSourceCode(
            @PathVariable Long projectId,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        verifyPurchaseOrAdmin(projectId, currentUser);

        ProjectFile file = projectFileRepository.findByProjectIdAndFileType(projectId, FileType.SOURCE_CODE)
                .orElseThrow(() -> new ResourceNotFoundException("Source code package not yet uploaded for project id: " + projectId));

        if (!file.getProject().getId().equals(projectId)) {
            throw new ResourceNotFoundException("Source file does not belong to specified project.");
        }

        Resource resource = fileStorageService.loadFileAsResource(file.getFilePath());
        String safeFilename = sanitizeFilename(file.getFileName());

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + safeFilename + "\"")
                .body(resource);
    }

    @GetMapping({"/{projectId}/download/documentation", "/{projectId}/documentation"})
    @SecurityRequirement(name = "BearerAuth")
    @Operation(summary = "Download project documentation PDF", description = "Verifies student purchase and paid order status before streaming the documentation PDF")
    public ResponseEntity<Resource> downloadDocumentation(
            @PathVariable Long projectId,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        verifyPurchaseOrAdmin(projectId, currentUser);

        ProjectFile file = projectFileRepository.findByProjectIdAndFileType(projectId, FileType.DOCUMENTATION)
                .orElseThrow(() -> new ResourceNotFoundException("Documentation package not yet uploaded for project id: " + projectId));

        if (!file.getProject().getId().equals(projectId)) {
            throw new ResourceNotFoundException("Documentation file does not belong to specified project.");
        }

        Resource resource = fileStorageService.loadFileAsResource(file.getFilePath());
        String safeFilename = sanitizeFilename(file.getFileName());

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + safeFilename + "\"")
                .body(resource);
    }

    @GetMapping({"/{projectId}/download/presentation", "/{projectId}/presentation"})
    @SecurityRequirement(name = "BearerAuth")
    @Operation(summary = "Download project presentation PPT/PPTX", description = "Verifies student purchase and paid order status before streaming the presentation file")
    public ResponseEntity<Resource> downloadPresentation(
            @PathVariable Long projectId,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        verifyPurchaseOrAdmin(projectId, currentUser);

        ProjectFile file = projectFileRepository.findByProjectIdAndFileType(projectId, FileType.PRESENTATION)
                .orElseThrow(() -> new ResourceNotFoundException("Presentation package not yet uploaded for project id: " + projectId));

        if (!file.getProject().getId().equals(projectId)) {
            throw new ResourceNotFoundException("Presentation file does not belong to specified project.");
        }

        Resource resource = fileStorageService.loadFileAsResource(file.getFilePath());
        String safeFilename = sanitizeFilename(file.getFileName());

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + safeFilename + "\"")
                .body(resource);
    }

    @GetMapping("/{projectId}/files/{fileId}")
    @Operation(summary = "View project media file", description = "Streams project screenshots or public media files")
    public ResponseEntity<Resource> viewProjectMedia(
            @PathVariable Long projectId,
            @PathVariable Long fileId,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", projectId));

        ProjectFile file = projectFileRepository.findById(fileId)
                .orElseThrow(() -> new ResourceNotFoundException("File", "id", fileId));

        if (!file.getProject().getId().equals(projectId)) {
            throw new ResourceNotFoundException("File does not belong to specified project.");
        }

        // CRITICAL ACCESS CONTROL:
        // Source code, documentation reports, and presentation decks are restricted deliverables.
        // They must never be accessible anonymously through the media streaming route.
        if (file.getFileType() == FileType.SOURCE_CODE ||
            file.getFileType() == FileType.DOCUMENTATION ||
            file.getFileType() == FileType.PRESENTATION) {
            verifyPurchaseOrAdmin(projectId, currentUser);
        }

        Resource resource = fileStorageService.loadFileAsResource(file.getFilePath());
        MediaType mediaType = (file.getMimeType() != null && !file.getMimeType().isBlank())
                ? MediaType.parseMediaType(file.getMimeType())
                : MediaType.APPLICATION_OCTET_STREAM;

        String safeFilename = sanitizeFilename(file.getFileName());

        String disposition = (file.getFileType() == FileType.SCREENSHOT || file.getFileType() == FileType.THUMBNAIL)
                ? "inline"
                : "attachment";

        return ResponseEntity.ok()
                .contentType(mediaType)
                .header(HttpHeaders.CONTENT_DISPOSITION, disposition + "; filename=\"" + safeFilename + "\"")
                .body(resource);
    }

    private void verifyPurchaseOrAdmin(Long projectId, UserPrincipal currentUser) {
        // 1. Return 401 Unauthorized for unauthenticated requests
        if (currentUser == null) {
            throw new UnauthorizedException("Authentication required to download project materials.");
        }

        // 2. Return 404 Not Found if project does not exist
        projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", projectId));

        // 3. ADMIN role is granted administrative download access
        boolean isAdmin = currentUser.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_" + Role.ADMIN.name()));
        if (isAdmin) {
            return;
        }

        // 4. Verify explicit project entitlement in student_project_access
        java.util.Optional<com.projectkit.entity.StudentProjectAccess> entitlement = 
                accessRepository.findByStudentIdAndProjectIdAndAccessStatus(currentUser.getId(), projectId, "ACTIVE");

        if (entitlement.isPresent()) {
            com.projectkit.entity.StudentProjectAccess access = entitlement.get();
            if ("PAID_PURCHASE".equalsIgnoreCase(access.getAccessType())) {
                if (access.getOrder() != null && access.getOrder().getStatus() != com.projectkit.enums.OrderStatus.PAID) {
                    throw new AccessDeniedException("Access Denied: Payment verification for this kit is incomplete or pending.");
                }
            }
            return; // Entitlement verified!
        }

        // 5. Fallback for historical paid orders (if not yet migrated to student_project_access)
        boolean hasPurchased = orderRepository.hasUserPurchasedProject(currentUser.getId(), projectId);
        if (hasPurchased) {
            return;
        }

        // 6. Deny access if neither claimed nor purchased
        throw new AccessDeniedException("Access Denied: You have not claimed this free project or completed a verified purchase.");
    }

    private String sanitizeFilename(String filename) {
        if (filename == null) {
            return "download";
        }
        return filename.replace("\"", "").replace(";", "").replace("\r", "").replace("\n", "");
    }
}
