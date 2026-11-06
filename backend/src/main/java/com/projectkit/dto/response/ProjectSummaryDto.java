package com.projectkit.dto.response;

import com.projectkit.entity.Project;
import com.projectkit.enums.DifficultyLevel;

import java.math.BigDecimal;

public class ProjectSummaryDto {

    private Long id;
    private String title;
    private String slug;
    private String shortDescription;
    private Long categoryId;
    private String categoryName;
    private String categorySlug;
    private String technologies;
    private DifficultyLevel difficultyLevel;
    private BigDecimal price;
    private BigDecimal discountPrice;
    private boolean isFeatured;
    private String thumbnailUrl;
    private int purchaseCount;

    public ProjectSummaryDto() {
    }

    public static ProjectSummaryDto fromEntity(Project project) {
        ProjectSummaryDto dto = new ProjectSummaryDto();
        dto.setId(project.getId());
        dto.setTitle(project.getTitle());
        dto.setSlug(project.getSlug());
        dto.setShortDescription(project.getShortDescription());
        if (project.getCategory() != null) {
            dto.setCategoryId(project.getCategory().getId());
            dto.setCategoryName(project.getCategory().getName());
            dto.setCategorySlug(project.getCategory().getSlug());
        }
        dto.setTechnologies(project.getTechnologies());
        dto.setDifficultyLevel(project.getDifficultyLevel());
        dto.setPrice(project.getPrice());
        dto.setDiscountPrice(project.getDiscountPrice());
        dto.setFeatured(project.isFeatured());
        dto.setThumbnailUrl(project.getThumbnailUrl());
        dto.setPurchaseCount(project.getPurchaseCount());
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

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public String getCategorySlug() {
        return categorySlug;
    }

    public void setCategorySlug(String categorySlug) {
        this.categorySlug = categorySlug;
    }

    public String getTechnologies() {
        return technologies;
    }

    public void setTechnologies(String technologies) {
        this.technologies = technologies;
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

    public String getThumbnailUrl() {
        return thumbnailUrl;
    }

    public void setThumbnailUrl(String thumbnailUrl) {
        this.thumbnailUrl = thumbnailUrl;
    }

    public int getPurchaseCount() {
        return purchaseCount;
    }

    public void setPurchaseCount(int purchaseCount) {
        this.purchaseCount = purchaseCount;
    }
}
