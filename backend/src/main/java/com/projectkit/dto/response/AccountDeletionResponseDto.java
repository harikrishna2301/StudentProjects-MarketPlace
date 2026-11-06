package com.projectkit.dto.response;

import com.projectkit.entity.AccountDeletionRequest;
import com.projectkit.enums.DeletionRequestStatus;

import java.time.LocalDateTime;

public class AccountDeletionResponseDto {

    private Long id;
    private Long userId;
    private String userEmail;
    private String userName;
    private String reason;
    private DeletionRequestStatus status;
    private LocalDateTime requestedAt;
    private LocalDateTime processedAt;
    private String adminNotes;

    public AccountDeletionResponseDto() {
    }

    public static AccountDeletionResponseDto fromEntity(AccountDeletionRequest req) {
        AccountDeletionResponseDto dto = new AccountDeletionResponseDto();
        dto.setId(req.getId());
        if (req.getUser() != null) {
            dto.setUserId(req.getUser().getId());
            dto.setUserEmail(req.getUser().getEmail());
            dto.setUserName(req.getUser().getFullName());
        }
        dto.setReason(req.getReason());
        dto.setStatus(req.getStatus());
        dto.setRequestedAt(req.getRequestedAt());
        dto.setProcessedAt(req.getProcessedAt());
        dto.setAdminNotes(req.getAdminNotes());
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

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public DeletionRequestStatus getStatus() {
        return status;
    }

    public void setStatus(DeletionRequestStatus status) {
        this.status = status;
    }

    public LocalDateTime getRequestedAt() {
        return requestedAt;
    }

    public void setRequestedAt(LocalDateTime requestedAt) {
        this.requestedAt = requestedAt;
    }

    public LocalDateTime getProcessedAt() {
        return processedAt;
    }

    public void setProcessedAt(LocalDateTime processedAt) {
        this.processedAt = processedAt;
    }

    public String getAdminNotes() {
        return adminNotes;
    }

    public void setAdminNotes(String adminNotes) {
        this.adminNotes = adminNotes;
    }
}
