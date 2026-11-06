package com.projectkit.dto.request;

import com.projectkit.enums.LegalDocumentType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class UserConsentRequest {

    @NotNull(message = "Document type is required")
    private LegalDocumentType documentType;

    @NotBlank(message = "Document version is required")
    private String documentVersion;

    private String ipAddress;
    private String userAgent;

    public UserConsentRequest() {
    }

    public UserConsentRequest(LegalDocumentType documentType, String documentVersion) {
        this.documentType = documentType;
        this.documentVersion = documentVersion;
    }

    public LegalDocumentType getDocumentType() {
        return documentType;
    }

    public void setDocumentType(LegalDocumentType documentType) {
        this.documentType = documentType;
    }

    public String getDocumentVersion() {
        return documentVersion;
    }

    public void setDocumentVersion(String documentVersion) {
        this.documentVersion = documentVersion;
    }

    public String getIpAddress() {
        return ipAddress;
    }

    public void setIpAddress(String ipAddress) {
        this.ipAddress = ipAddress;
    }

    public String getUserAgent() {
        return userAgent;
    }

    public void setUserAgent(String userAgent) {
        this.userAgent = userAgent;
    }
}
