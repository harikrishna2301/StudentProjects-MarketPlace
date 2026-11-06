package com.projectkit.dto.request;

import com.projectkit.enums.AccountStatus;
import jakarta.validation.constraints.NotNull;

public class UpdateUserStatusRequest {

    @NotNull(message = "Account status is required")
    private AccountStatus status;

    public UpdateUserStatusRequest() {
    }

    public UpdateUserStatusRequest(AccountStatus status) {
        this.status = status;
    }

    public AccountStatus getStatus() {
        return status;
    }

    public void setStatus(AccountStatus status) {
        this.status = status;
    }
}
