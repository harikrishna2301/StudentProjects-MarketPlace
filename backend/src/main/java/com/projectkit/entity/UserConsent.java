package com.projectkit.entity;

import com.projectkit.enums.LegalDocumentType;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_consents")
public class UserConsent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "document_type", nullable = false, length = 50)
    private LegalDocumentType documentType;

    @Column(name = "document_version", nullable = false, length = 20)
    private String documentVersion;

    @Column(name = "ip_address", length = 45)
    private String ipAddress;

    @Column(name = "user_agent", length = 255)
    private String userAgent;

    @Column(name = "accepted_at", nullable = false, updatable = false)
    private LocalDateTime acceptedAt;

    public UserConsent() {
    }

    public UserConsent(User user, LegalDocumentType documentType, String documentVersion, String ipAddress, String userAgent) {
        this.user = user;
        this.documentType = documentType;
        this.documentVersion = documentVersion;
        this.ipAddress = ipAddress;
        this.userAgent = userAgent;
    }

    @PrePersist
    protected void onCreate() {
        if (this.acceptedAt == null) {
            this.acceptedAt = LocalDateTime.now();
        }
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
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
