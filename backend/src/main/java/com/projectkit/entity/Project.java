package com.projectkit.entity;

import com.projectkit.enums.DifficultyLevel;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "projects")
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, unique = true, length = 220)
    private String slug;

    @Column(name = "short_description", nullable = false, length = 500)
    private String shortDescription;

    @Column(name = "detailed_description", nullable = false, columnDefinition = "LONGTEXT")
    private String detailedDescription;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @Column(nullable = false, length = 500)
    private String technologies;

    @Column(columnDefinition = "TEXT")
    private String features;

    @Enumerated(EnumType.STRING)
    @Column(name = "difficulty_level", nullable = false, length = 20)
    private DifficultyLevel difficultyLevel = DifficultyLevel.INTERMEDIATE;

    @Column(name = "is_free", nullable = false)
    private boolean isFree = false;

    @Column(name = "access_type", nullable = false, length = 20)
    private String accessType = "PAID"; // "FREE" or "PAID"

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price = BigDecimal.ZERO;

    @Column(name = "discount_price", precision = 10, scale = 2)
    private BigDecimal discountPrice;

    @Column(name = "is_featured", nullable = false)
    private boolean isFeatured = false;

    @Column(name = "is_active", nullable = false)
    private boolean isActive = true;

    @Column(name = "publication_status", nullable = false, length = 20)
    private String publicationStatus = "PUBLISHED"; // "DRAFT", "PUBLISHED", "ARCHIVED"

    @Column(name = "thumbnail_url", length = 500)
    private String thumbnailUrl;

    @Column(name = "demo_url", length = 500)
    private String demoUrl;

    @Column(name = "demo_video_url", length = 500)
    private String demoVideoUrl;

    @Column(name = "view_count", nullable = false)
    private int viewCount = 0;

    @Column(name = "purchase_count", nullable = false)
    private int purchaseCount = 0;

    @Column(name = "claim_count", nullable = false)
    private int claimCount = 0;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public Project() {
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        validateFreeConsistency();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
        validateFreeConsistency();
    }

    private void validateFreeConsistency() {
        if (this.isFree || "FREE".equalsIgnoreCase(this.accessType)) {
            this.isFree = true;
            this.accessType = "FREE";
            this.price = BigDecimal.ZERO;
            this.discountPrice = null;
        } else {
            this.accessType = "PAID";
        }
        if (this.publicationStatus == null) {
            this.publicationStatus = "PUBLISHED";
        }
    }

    // Getters and Setters
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

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
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
        this.isFree = free;
        if (free) {
            this.accessType = "FREE";
            this.price = BigDecimal.ZERO;
            this.discountPrice = null;
        } else {
            this.accessType = "PAID";
        }
    }

    public String getAccessType() {
        return accessType;
    }

    public void setAccessType(String accessType) {
        this.accessType = accessType;
        if ("FREE".equalsIgnoreCase(accessType)) {
            this.isFree = true;
            this.price = BigDecimal.ZERO;
            this.discountPrice = null;
        } else {
            this.isFree = false;
        }
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
