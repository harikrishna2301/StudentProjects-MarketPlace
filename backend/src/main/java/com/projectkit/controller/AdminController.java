package com.projectkit.controller;

import com.projectkit.dto.request.CreateCategoryRequest;
import com.projectkit.dto.request.CreateProjectRequest;
import com.projectkit.dto.request.UpdateProjectRequest;
import com.projectkit.dto.request.UpdateUserStatusRequest;
import com.projectkit.dto.response.*;
import com.projectkit.entity.ProjectFile;
import com.projectkit.enums.FileType;
import com.projectkit.service.AdminService;
import com.projectkit.service.CategoryService;
import com.projectkit.service.FileStorageService;
import com.projectkit.service.ProjectService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@SecurityRequirement(name = "BearerAuth")
@Tag(name = "Admin Operations", description = "Administrative operations for students, catalog, files, and orders")
public class AdminController {

    private final AdminService adminService;
    private final ProjectService projectService;
    private final CategoryService categoryService;
    private final FileStorageService fileStorageService;
    private final com.projectkit.service.LegalService legalService;

    public AdminController(AdminService adminService,
                           ProjectService projectService,
                           CategoryService categoryService,
                           FileStorageService fileStorageService,
                           com.projectkit.service.LegalService legalService) {
        this.adminService = adminService;
        this.projectService = projectService;
        this.categoryService = categoryService;
        this.fileStorageService = fileStorageService;
        this.legalService = legalService;
    }

    // -------------------------------------------------------------------
    // Dashboard & Metrics
    // -------------------------------------------------------------------
    @GetMapping("/dashboard")
    @Operation(summary = "Get administrator dashboard metrics")
    public ResponseEntity<ApiResponse<AdminDashboardDto>> getDashboardStats() {
        AdminDashboardDto stats = adminService.getDashboardStats();
        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    // -------------------------------------------------------------------
    // Student Management
    // -------------------------------------------------------------------
    @GetMapping("/students")
    @Operation(summary = "List all registered student accounts")
    public ResponseEntity<ApiResponse<PagedResponse<UserProfileResponse>>> getStudents(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size
    ) {
        PagedResponse<UserProfileResponse> students = adminService.getStudents(page, size);
        return ResponseEntity.ok(ApiResponse.success(students));
    }

    @PutMapping("/students/{id}/status")
    @Operation(summary = "Update student account status (ACTIVE, INACTIVE, SUSPENDED)")
    public ResponseEntity<ApiResponse<UserProfileResponse>> updateStudentStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateUserStatusRequest request
    ) {
        UserProfileResponse updated = adminService.updateStudentStatus(id, request);
        return ResponseEntity.ok(ApiResponse.success("Student status updated successfully", updated));
    }

    // -------------------------------------------------------------------
    // Project Catalog Management
    // -------------------------------------------------------------------
    @PostMapping("/projects")
    @Operation(summary = "Create a new project kit")
    public ResponseEntity<ApiResponse<ProjectDto>> createProject(@Valid @RequestBody CreateProjectRequest request) {
        ProjectDto created = projectService.createProject(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Project kit created successfully", created));
    }

    @PutMapping("/projects/{id}")
    @Operation(summary = "Update an existing project kit")
    public ResponseEntity<ApiResponse<ProjectDto>> updateProject(
            @PathVariable Long id,
            @Valid @RequestBody UpdateProjectRequest request
    ) {
        ProjectDto updated = projectService.updateProject(id, request);
        return ResponseEntity.ok(ApiResponse.success("Project kit updated successfully", updated));
    }

    @DeleteMapping("/projects/{id}")
    @Operation(summary = "Delete or archive a project kit")
    public ResponseEntity<ApiResponse<Void>> deleteProject(@PathVariable Long id) {
        projectService.deleteProject(id);
        return ResponseEntity.ok(ApiResponse.success("Project kit deleted successfully", null));
    }

    // -------------------------------------------------------------------
    // File & Media Uploads
    // -------------------------------------------------------------------
    @PostMapping(value = "/projects/{id}/source-code", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload project source code ZIP package")
    public ResponseEntity<ApiResponse<Map<String, Object>>> uploadSourceCode(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file
    ) {
        ProjectFile projectFile = fileStorageService.storeProjectFile(id, file, FileType.SOURCE_CODE);
        return ResponseEntity.ok(ApiResponse.success("Source code package uploaded successfully",
                Map.of("fileId", projectFile.getId(), "fileName", projectFile.getFileName(), "size", projectFile.getFileSize())));
    }

    @PostMapping(value = "/projects/{id}/documentation", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload project documentation PDF report")
    public ResponseEntity<ApiResponse<Map<String, Object>>> uploadDocumentation(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file
    ) {
        ProjectFile projectFile = fileStorageService.storeProjectFile(id, file, FileType.DOCUMENTATION);
        return ResponseEntity.ok(ApiResponse.success("Documentation uploaded successfully",
                Map.of("fileId", projectFile.getId(), "fileName", projectFile.getFileName(), "size", projectFile.getFileSize())));
    }

    @PostMapping(value = "/projects/{id}/screenshot", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload project screenshot preview")
    public ResponseEntity<ApiResponse<Map<String, Object>>> uploadScreenshot(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file
    ) {
        ProjectFile projectFile = fileStorageService.storeProjectFile(id, file, FileType.SCREENSHOT);
        return ResponseEntity.ok(ApiResponse.success("Screenshot uploaded successfully",
                Map.of("fileId", projectFile.getId(), "fileName", projectFile.getFileName())));
    }

    @PostMapping(value = "/projects/upload-thumbnail", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload project thumbnail preview image")
    public ResponseEntity<ApiResponse<Map<String, String>>> uploadThumbnail(
            @RequestParam("file") MultipartFile file
    ) {
        String thumbnailUrl = fileStorageService.storeThumbnail(file);
        return ResponseEntity.ok(ApiResponse.success("Thumbnail uploaded successfully", Map.of("thumbnailUrl", thumbnailUrl)));
    }

    // -------------------------------------------------------------------
    // Category Management
    // -------------------------------------------------------------------
    @GetMapping("/categories")
    @Operation(summary = "List all categories (including inactive)")
    public ResponseEntity<ApiResponse<List<CategoryDto>>> getAllCategories() {
        List<CategoryDto> categories = categoryService.getAllCategories();
        return ResponseEntity.ok(ApiResponse.success(categories));
    }

    @PostMapping("/categories")
    @Operation(summary = "Create a new category")
    public ResponseEntity<ApiResponse<CategoryDto>> createCategory(@Valid @RequestBody CreateCategoryRequest request) {
        CategoryDto created = categoryService.createCategory(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Category created successfully", created));
    }

    @PutMapping("/categories/{id}")
    @Operation(summary = "Update an existing category")
    public ResponseEntity<ApiResponse<CategoryDto>> updateCategory(
            @PathVariable Long id,
            @Valid @RequestBody CreateCategoryRequest request
    ) {
        CategoryDto updated = categoryService.updateCategory(id, request);
        return ResponseEntity.ok(ApiResponse.success("Category updated successfully", updated));
    }

    @DeleteMapping("/categories/{id}")
    @Operation(summary = "Delete category")
    public ResponseEntity<ApiResponse<Void>> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.ok(ApiResponse.success("Category deleted successfully", null));
    }

    // -------------------------------------------------------------------
    // Orders & Transactions Auditing
    // -------------------------------------------------------------------
    @GetMapping("/orders")
    @Operation(summary = "List all customer orders with pagination")
    public ResponseEntity<ApiResponse<PagedResponse<OrderResponse>>> getAllOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size
    ) {
        PagedResponse<OrderResponse> orders = adminService.getAllOrders(page, size);
        return ResponseEntity.ok(ApiResponse.success(orders));
    }

    @GetMapping("/payments")
    @Operation(summary = "List all payment transactions with pagination")
    public ResponseEntity<ApiResponse<PagedResponse<PaymentResponse>>> getAllPayments(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size
    ) {
        PagedResponse<PaymentResponse> payments = adminService.getAllPayments(page, size);
        return ResponseEntity.ok(ApiResponse.success(payments));
    }

    // -------------------------------------------------------------------
    // Legal & Compliance Governance
    // -------------------------------------------------------------------
    @GetMapping("/legal/documents")
    @Operation(summary = "List all versioned legal policies for review")
    public ResponseEntity<ApiResponse<List<com.projectkit.dto.response.LegalDocumentDto>>> getAllLegalDocuments() {
        List<com.projectkit.dto.response.LegalDocumentDto> list = legalService.getAllDocumentsAdmin();
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @PostMapping("/legal/documents")
    @Operation(summary = "Create or update a legal document policy draft")
    public ResponseEntity<ApiResponse<com.projectkit.dto.response.LegalDocumentDto>> createOrUpdateLegalDocument(
            @Valid @RequestBody com.projectkit.dto.request.LegalDocumentRequest request
    ) {
        com.projectkit.dto.response.LegalDocumentDto doc = legalService.createOrUpdateDocumentAdmin(request);
        return ResponseEntity.ok(ApiResponse.success("Legal document draft saved successfully", doc));
    }

    @PutMapping("/legal/documents/{id}/publish")
    @Operation(summary = "Publish a verified legal document version")
    public ResponseEntity<ApiResponse<com.projectkit.dto.response.LegalDocumentDto>> publishLegalDocument(@PathVariable Long id) {
        com.projectkit.dto.response.LegalDocumentDto doc = legalService.publishDocumentAdmin(id);
        return ResponseEntity.ok(ApiResponse.success("Legal document published and made active for students", doc));
    }

    @GetMapping("/legal/consents")
    @Operation(summary = "Audit student consent records with timestamps and versions")
    public ResponseEntity<ApiResponse<PagedResponse<com.projectkit.dto.response.UserConsentDto>>> getAllConsents(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size
    ) {
        PagedResponse<com.projectkit.dto.response.UserConsentDto> consents = legalService.getAllConsentsAdmin(page, size);
        return ResponseEntity.ok(ApiResponse.success(consents));
    }

    @GetMapping("/legal/deletion-requests")
    @Operation(summary = "View student account deletion requests under DPDPA / GDPR")
    public ResponseEntity<ApiResponse<PagedResponse<com.projectkit.dto.response.AccountDeletionResponseDto>>> getDeletionRequests(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size
    ) {
        PagedResponse<com.projectkit.dto.response.AccountDeletionResponseDto> requests = legalService.getAllDeletionRequestsAdmin(page, size);
        return ResponseEntity.ok(ApiResponse.success(requests));
    }

    @PutMapping("/legal/deletion-requests/{id}")
    @Operation(summary = "Process account deletion request (APPROVE, REJECT, COMPLETE)")
    public ResponseEntity<ApiResponse<com.projectkit.dto.response.AccountDeletionResponseDto>> processDeletionRequest(
            @PathVariable Long id,
            @Valid @RequestBody com.projectkit.dto.request.ProcessDeletionRequest request
    ) {
        com.projectkit.dto.response.AccountDeletionResponseDto processed = legalService.processDeletionRequestAdmin(id, request);
        return ResponseEntity.ok(ApiResponse.success("Deletion request processed successfully", processed));
    }
}
