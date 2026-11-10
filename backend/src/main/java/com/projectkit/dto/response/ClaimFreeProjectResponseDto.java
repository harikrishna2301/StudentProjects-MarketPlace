package com.projectkit.dto.response;

import java.time.LocalDateTime;

public class ClaimFreeProjectResponseDto {

    private Long entitlementId;
    private Long projectId;
    private String projectTitle;
    private String projectSlug;
    private String accessType;
    private LocalDateTime grantedAt;
    private String message;
    private String downloadSourceUrl;
    private String downloadDocumentationUrl;

    public ClaimFreeProjectResponseDto() {
    }

    public ClaimFreeProjectResponseDto(Long entitlementId, Long projectId, String projectTitle, String projectSlug,
                                       String accessType, LocalDateTime grantedAt, String message,
                                       String downloadSourceUrl, String downloadDocumentationUrl) {
        this.entitlementId = entitlementId;
        this.projectId = projectId;
        this.projectTitle = projectTitle;
        this.projectSlug = projectSlug;
        this.accessType = accessType;
        this.grantedAt = grantedAt;
        this.message = message;
        this.downloadSourceUrl = downloadSourceUrl;
        this.downloadDocumentationUrl = downloadDocumentationUrl;
    }

    public Long getEntitlementId() {
        return entitlementId;
    }

    public void setEntitlementId(Long entitlementId) {
        this.entitlementId = entitlementId;
    }

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }

    public String getProjectTitle() {
        return projectTitle;
    }

    public void setProjectTitle(String projectTitle) {
        this.projectTitle = projectTitle;
    }

    public String getProjectSlug() {
        return projectSlug;
    }

    public void setProjectSlug(String projectSlug) {
        this.projectSlug = projectSlug;
    }

    public String getAccessType() {
        return accessType;
    }

    public void setAccessType(String accessType) {
        this.accessType = accessType;
    }

    public LocalDateTime getGrantedAt() {
        return grantedAt;
    }

    public void setGrantedAt(LocalDateTime grantedAt) {
        this.grantedAt = grantedAt;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getDownloadSourceUrl() {
        return downloadSourceUrl;
    }

    public void setDownloadSourceUrl(String downloadSourceUrl) {
        this.downloadSourceUrl = downloadSourceUrl;
    }

    public String getDownloadDocumentationUrl() {
        return downloadDocumentationUrl;
    }

    public void setDownloadDocumentationUrl(String downloadDocumentationUrl) {
        this.downloadDocumentationUrl = downloadDocumentationUrl;
    }
}
