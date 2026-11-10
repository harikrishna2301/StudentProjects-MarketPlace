package com.projectkit.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class MyKitDto {

    private Long entitlementId;
    private Long projectId;
    private String projectTitle;
    private String projectSlug;
    private String thumbnailUrl;
    private String categoryName;
    private String technologies;
    private String accessType; // 'FREE_CLAIM' or 'PAID_PURCHASE'
    private boolean isFree;
    private BigDecimal pricePaid;
    private String orderNumber;
    private LocalDateTime grantedAt;
    private String downloadSourceUrl;
    private String downloadDocumentationUrl;

    public MyKitDto() {
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

    public String getThumbnailUrl() {
        return thumbnailUrl;
    }

    public void setThumbnailUrl(String thumbnailUrl) {
        this.thumbnailUrl = thumbnailUrl;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public String getTechnologies() {
        return technologies;
    }

    public void setTechnologies(String technologies) {
        this.technologies = technologies;
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

    public BigDecimal getPricePaid() {
        return pricePaid;
    }

    public void setPricePaid(BigDecimal pricePaid) {
        this.pricePaid = pricePaid;
    }

    public String getOrderNumber() {
        return orderNumber;
    }

    public void setOrderNumber(String orderNumber) {
        this.orderNumber = orderNumber;
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
