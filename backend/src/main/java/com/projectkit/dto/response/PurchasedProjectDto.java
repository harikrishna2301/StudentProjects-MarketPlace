package com.projectkit.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class PurchasedProjectDto {

    private Long projectId;
    private String projectTitle;
    private String projectSlug;
    private String thumbnailUrl;
    private String categoryName;
    private String orderNumber;
    private BigDecimal pricePaid;
    private LocalDateTime purchaseDate;
    private String downloadSourceUrl;
    private String downloadDocumentationUrl;

    public PurchasedProjectDto() {
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

    public String getOrderNumber() {
        return orderNumber;
    }

    public void setOrderNumber(String orderNumber) {
        this.orderNumber = orderNumber;
    }

    public BigDecimal getPricePaid() {
        return pricePaid;
    }

    public void setPricePaid(BigDecimal pricePaid) {
        this.pricePaid = pricePaid;
    }

    public LocalDateTime getPurchaseDate() {
        return purchaseDate;
    }

    public void setPurchaseDate(LocalDateTime purchaseDate) {
        this.purchaseDate = purchaseDate;
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
