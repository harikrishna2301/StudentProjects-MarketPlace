package com.projectkit.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class UpdateProfileRequest {

    @NotBlank(message = "Full name is required")
    @Size(min = 2, max = 100, message = "Full name must be between 2 and 100 characters")
    private String fullName;

    @Size(max = 150, message = "College name cannot exceed 150 characters")
    private String collegeName;

    @Size(max = 20, message = "Phone cannot exceed 20 characters")
    private String phone;

    public UpdateProfileRequest() {
    }

    public UpdateProfileRequest(String fullName, String collegeName, String phone) {
        this.fullName = fullName;
        this.collegeName = collegeName;
        this.phone = phone;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getCollegeName() {
        return collegeName;
    }

    public void setCollegeName(String collegeName) {
        this.collegeName = collegeName;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }
}
