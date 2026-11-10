package com.projectkit.dto.response;

import java.time.LocalDateTime;

public class ProjectAccessStatusDto {

    private Long projectId;
    private boolean hasAccess;
    private String accessType; // 'FREE_CLAIM', 'PAID_PURCHASE', 'NONE'
    private boolean isFree;
    private LocalDateTime grantedAt;
    private String downloadSourceUrl;
    private String downloadDocumentationUrl;

    public ProjectAccessStatusDto() {
    }

    public ProjectAccessStatusDto(Long projectId, boolean hasAccess, String accessType, boolean isFree,
                                  LocalDateTime grantedAt, String downloadSourceUrl, String downloadDocumentationUrl) {
        this.projectId = projectId;
        this.hasAccess = hasAccess;
        this.accessType = accessType;
        this.isFree = isFree;
        this.grantedAt = grantedAt;
        this.downloadSourceUrl = downloadSourceUrl;
        this.downloadDocumentationUrl = downloadDocumentationUrl;
    }

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }

    public boolean isHasAccess() {
        return hasAccess;
    }

    public void setHasAccess(boolean hasAccess) {
        this.hasAccess = hasAccess;
    }

    public String getAccessType() {
        return accessType;
    }

    public void setAccessType(String accessType) {
        this.accessType = accessType;
    }

    public boolean isFree() {
        return isFree;
    }

    public void setFree(boolean free) {
        isFree = free;
    }

    public LocalDateTime getGrantedAt() {
        return grantedAt;
    }

    public void setGrantedAt(LocalDateTime grantedAt) {
        this.grantedAt = grantedAt;
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
