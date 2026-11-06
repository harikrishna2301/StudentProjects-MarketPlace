package com.projectkit.dto.response;

import com.projectkit.entity.LegalDocument;
import com.projectkit.enums.LegalDocumentType;

import java.time.LocalDateTime;

public class LegalDocumentDto {

    private Long id;
    private LegalDocumentType documentType;
    private String version;
    private String title;
    private String content;
    private boolean isPublished;
    private boolean requiresReview;
    private LocalDateTime publishedAt;
    private LocalDateTime updatedAt;

    public LegalDocumentDto() {
    }

    public static LegalDocumentDto fromEntity(LegalDocument doc) {
        LegalDocumentDto dto = new LegalDocumentDto();
        dto.setId(doc.getId());
        dto.setDocumentType(doc.getDocumentType());
        dto.setVersion(doc.getVersion());
        dto.setTitle(doc.getTitle());
        dto.setContent(doc.getContent());
        dto.setPublished(doc.isPublished());
        dto.setRequiresReview(doc.isRequiresReview());
        dto.setPublishedAt(doc.getPublishedAt());
        dto.setUpdatedAt(doc.getUpdatedAt());
        return dto;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LegalDocumentType getDocumentType() {
        return documentType;
    }

    public void setDocumentType(LegalDocumentType documentType) {
        this.documentType = documentType;
    }

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public boolean isPublished() {
        return isPublished;
    }

    public void setPublished(boolean published) {
        isPublished = published;
    }

    public boolean isRequiresReview() {
        return requiresReview;
    }

    public void setRequiresReview(boolean requiresReview) {
        this.requiresReview = requiresReview;
    }

    public LocalDateTime getPublishedAt() {
        return publishedAt;
    }

    public void setPublishedAt(LocalDateTime publishedAt) {
        this.publishedAt = publishedAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
