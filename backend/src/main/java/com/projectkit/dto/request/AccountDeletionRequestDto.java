package com.projectkit.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class AccountDeletionRequestDto {

    @NotBlank(message = "Please provide a reason or note for your deletion request")
    @Size(max = 1000, message = "Reason cannot exceed 1000 characters")
    private String reason;

    public AccountDeletionRequestDto() {
    }

    public AccountDeletionRequestDto(String reason) {
        this.reason = reason;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}
