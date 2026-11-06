package com.projectkit.dto.response;

import com.projectkit.entity.User;
import com.projectkit.enums.AccountStatus;
import com.projectkit.enums.Role;

import java.time.LocalDateTime;

public class UserProfileResponse {

    private Long id;
    private String email;
    private String fullName;
    private String collegeName;
    private String phone;
    private Role role;
    private AccountStatus status;
    private LocalDateTime createdAt;

    public UserProfileResponse() {
    }

    public UserProfileResponse(Long id, String email, String fullName, String collegeName,
                               String phone, Role role, AccountStatus status, LocalDateTime createdAt) {
        this.id = id;
        this.email = email;
        this.fullName = fullName;
        this.collegeName = collegeName;
        this.phone = phone;
        this.role = role;
        this.status = status;
        this.createdAt = createdAt;
    }

    public static UserProfileResponse fromUser(User user) {
        return new UserProfileResponse(
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                user.getCollegeName(),
                user.getPhone(),
                user.getRole(),
                user.getStatus(),
                user.getCreatedAt()
        );
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
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

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public AccountStatus getStatus() {
        return status;
    }

    public void setStatus(AccountStatus status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
