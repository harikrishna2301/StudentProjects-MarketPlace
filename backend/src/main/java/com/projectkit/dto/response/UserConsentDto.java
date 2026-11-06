package com.projectkit.dto.response;

import com.projectkit.entity.UserConsent;
import com.projectkit.enums.LegalDocumentType;

import java.time.LocalDateTime;

public class UserConsentDto {

    private Long id;
    private Long userId;
    private String userEmail;
    private LegalDocumentType documentType;
    private String documentVersion;
    private String ipAddress;
    private String userAgent;
    private LocalDateTime acceptedAt;

    public UserConsentDto() {
    }

    public static UserConsentDto fromEntity(UserConsent consent) {
        UserConsentDto dto = new UserConsentDto();
        dto.setId(consent.getId());
        if (consent.getUser() != null) {
            dto.setUserId(consent.getUser().getId());
            dto.setUserEmail(consent.getUser().getEmail());
        }
        dto.setDocumentType(consent.getDocumentType());
        dto.setDocumentVersion(consent.getDocumentVersion());
        dto.setIpAddress(consent.getIpAddress());
        dto.setUserAgent(consent.getUserAgent());
        dto.setAcceptedAt(consent.getAcceptedAt());
        return dto;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
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

    public LocalDateTime getAcceptedAt() {
        return acceptedAt;
    }

    public void setAcceptedAt(LocalDateTime acceptedAt) {
        this.acceptedAt = acceptedAt;
    }
}
