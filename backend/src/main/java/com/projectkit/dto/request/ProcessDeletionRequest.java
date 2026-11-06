package com.projectkit.dto.request;

import com.projectkit.enums.DeletionRequestStatus;
import jakarta.validation.constraints.NotNull;

public class ProcessDeletionRequest {

    @NotNull(message = "Status is required")
    private DeletionRequestStatus status;

    private String adminNotes;

    public ProcessDeletionRequest() {
    }

    public ProcessDeletionRequest(DeletionRequestStatus status, String adminNotes) {
        this.status = status;
        this.adminNotes = adminNotes;
    }

    public DeletionRequestStatus getStatus() {
        return status;
    }

    public void setStatus(DeletionRequestStatus status) {
        this.status = status;
    }

    public String getAdminNotes() {
        return adminNotes;
    }

    public void setAdminNotes(String adminNotes) {
        this.adminNotes = adminNotes;
    }
}
