package com.projectkit.dto.response;

import com.projectkit.entity.Project;
import com.projectkit.enums.DifficultyLevel;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class ProjectDto {

    private Long id;
    private String title;
    private String slug;
    private String shortDescription;
    private String detailedDescription;
    private CategoryDto category;
    private String technologies;
    private String features;
    private DifficultyLevel difficultyLevel;
    private BigDecimal price;
    private BigDecimal discountPrice;
    private boolean isFeatured;
    private boolean isActive;
    private boolean isFree;
    private String accessType;
    private String publicationStatus;
    private String thumbnailUrl;
    private int viewCount;
    private int purchaseCount;
    private int claimCount;
    private boolean purchasedByCurrentUser = false;
    private boolean claimedByCurrentUser = false;
    private boolean hasSourceCode = false;
    private boolean hasDocumentation = false;
    private boolean hasPresentation = false;
    private boolean hasDemoVideo = false;
    private String demoUrl;
    private String demoVideoUrl;
    private List<String> screenshotUrls = new ArrayList<>();
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public ProjectDto() {
    }

    public static ProjectDto fromEntity(Project project) {
        ProjectDto dto = new ProjectDto();
        dto.setId(project.getId());
        dto.setTitle(project.getTitle());
        dto.setSlug(project.getSlug());
        dto.setShortDescription(project.getShortDescription());
        dto.setDetailedDescription(project.getDetailedDescription());
        if (project.getCategory() != null) {
            dto.setCategory(CategoryDto.fromEntity(project.getCategory()));
        }
        dto.setTechnologies(project.getTechnologies());
        dto.setFeatures(project.getFeatures());
        dto.setDifficultyLevel(project.getDifficultyLevel());
        dto.setPrice(project.getPrice());
        dto.setDiscountPrice(project.getDiscountPrice());
        dto.setFeatured(project.isFeatured());
        dto.setActive(project.isActive());
        dto.setFree(project.isFree());
        dto.setAccessType(project.getAccessType());
        dto.setPublicationStatus(project.getPublicationStatus());
        dto.setThumbnailUrl(project.getThumbnailUrl());
        dto.setDemoUrl(project.getDemoUrl());
        dto.setDemoVideoUrl(project.getDemoVideoUrl());
        dto.setViewCount(project.getViewCount());
        dto.setPurchaseCount(project.getPurchaseCount());
        dto.setClaimCount(project.getClaimCount());
        dto.setCreatedAt(project.getCreatedAt());
        dto.setUpdatedAt(project.getUpdatedAt());
        return dto;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getSlug() {
        return slug;
    }

    public void setSlug(String slug) {
        this.slug = slug;
    }

    public String getShortDescription() {
        return shortDescription;
    }

    public void setShortDescription(String shortDescription) {
        this.shortDescription = shortDescription;
    }

    public String getDetailedDescription() {
        return detailedDescription;
    }

    public void setDetailedDescription(String detailedDescription) {
        this.detailedDescription = detailedDescription;
    }

    public CategoryDto getCategory() {
        return category;
    }

    public void setCategory(CategoryDto category) {
        this.category = category;
    }

    public String getTechnologies() {
        return technologies;
    }

    public void setTechnologies(String technologies) {
        this.technologies = technologies;
    }

    public String getFeatures() {
        return features;
    }

    public void setFeatures(String features) {
        this.features = features;
    }

    public DifficultyLevel getDifficultyLevel() {
        return difficultyLevel;
    }

    public void setDifficultyLevel(DifficultyLevel difficultyLevel) {
        this.difficultyLevel = difficultyLevel;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public BigDecimal getDiscountPrice() {
        return discountPrice;
    }

    public void setDiscountPrice(BigDecimal discountPrice) {
        this.discountPrice = discountPrice;
    }

    public boolean isFeatured() {
        return isFeatured;
    }

    public void setFeatured(boolean featured) {
        isFeatured = featured;
    }

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        isActive = active;
    }

    public String getThumbnailUrl() {
        return thumbnailUrl;
    }

    public void setThumbnailUrl(String thumbnailUrl) {
        this.thumbnailUrl = thumbnailUrl;
    }

    public int getViewCount() {
        return viewCount;
    }

    public void setViewCount(int viewCount) {
        this.viewCount = viewCount;
    }

    public int getPurchaseCount() {
        return purchaseCount;
    }

    public void setPurchaseCount(int purchaseCount) {
        this.purchaseCount = purchaseCount;
    }

    public boolean isPurchasedByCurrentUser() {
        return purchasedByCurrentUser;
    }

    public void setPurchasedByCurrentUser(boolean purchasedByCurrentUser) {
        this.purchasedByCurrentUser = purchasedByCurrentUser;
    }

    public boolean isHasSourceCode() {
        return hasSourceCode;
    }

    public void setHasSourceCode(boolean hasSourceCode) {
        this.hasSourceCode = hasSourceCode;
    }

    public boolean isHasDocumentation() {
        return hasDocumentation;
    }

    public void setHasDocumentation(boolean hasDocumentation) {
        this.hasDocumentation = hasDocumentation;
    }

    public List<String> getScreenshotUrls() {
        return screenshotUrls;
    }

    public void setScreenshotUrls(List<String> screenshotUrls) {
        this.screenshotUrls = screenshotUrls;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public boolean isFree() {
        return isFree;
    }

    public void setFree(boolean free) {
        isFree = free;
    }

    public String getAccessType() {
        return accessType;
    }

    public void setAccessType(String accessType) {
        this.accessType = accessType;
    }

    public String getPublicationStatus() {
        return publicationStatus;
    }

    public void setPublicationStatus(String publicationStatus) {
        this.publicationStatus = publicationStatus;
    }

    public int getClaimCount() {
        return claimCount;
    }

    public void setClaimCount(int claimCount) {
        this.claimCount = claimCount;
    }

    public boolean isClaimedByCurrentUser() {
        return claimedByCurrentUser;
    }

    public void setClaimedByCurrentUser(boolean claimedByCurrentUser) {
        this.claimedByCurrentUser = claimedByCurrentUser;
    }

    public boolean isHasPresentation() {
        return hasPresentation;
    }

    public void setHasPresentation(boolean hasPresentation) {
        this.hasPresentation = hasPresentation;
    }

    public boolean isHasDemoVideo() {
        return hasDemoVideo;
    }

    public void setHasDemoVideo(boolean hasDemoVideo) {
        this.hasDemoVideo = hasDemoVideo;
    }

    public String getDemoUrl() {
        return demoUrl;
    }

    public void setDemoUrl(String demoUrl) {
        this.demoUrl = demoUrl;
    }

    public String getDemoVideoUrl() {
        return demoVideoUrl;
    }

    public void setDemoVideoUrl(String demoVideoUrl) {
        this.demoVideoUrl = demoVideoUrl;
    }
}
