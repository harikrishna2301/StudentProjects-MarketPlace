package com.projectkit.dto.request;

import com.projectkit.enums.LegalDocumentType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class LegalDocumentRequest {

    @NotNull(message = "Document type is required")
    private LegalDocumentType documentType;

    @NotBlank(message = "Version is required (e.g. 1.0, 1.1)")
    @Size(max = 20)
    private String version;

    @NotBlank(message = "Document title is required")
    @Size(max = 200)
    private String title;

    @NotBlank(message = "Content is required")
    private String content;

    private Boolean isPublished = false;

    public LegalDocumentRequest() {
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

    public Boolean getIsPublished() {
        return isPublished;
    }

    public void setIsPublished(Boolean published) {
        isPublished = published;
    }
}
