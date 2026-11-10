package com.projectkit.dto.response;

import java.time.LocalDateTime;

public class ContactInquiryResponse {

    private Long inquiryId;
    private String fullName;
    private String email;
    private String subject;
    private String status;
    private LocalDateTime createdAt;
    private String message;

    public ContactInquiryResponse() {
    }

    public ContactInquiryResponse(Long inquiryId, String fullName, String email, String subject, String status, LocalDateTime createdAt, String message) {
        this.inquiryId = inquiryId;
        this.fullName = fullName;
        this.email = email;
        this.subject = subject;
        this.status = status;
        this.createdAt = createdAt;
        this.message = message;
    }

    public Long getInquiryId() {
        return inquiryId;
    }

    public void setInquiryId(Long inquiryId) {
        this.inquiryId = inquiryId;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
