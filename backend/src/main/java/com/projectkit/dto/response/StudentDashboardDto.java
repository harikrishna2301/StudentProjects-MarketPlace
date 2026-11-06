package com.projectkit.dto.response;

import java.math.BigDecimal;
import java.util.List;

public class StudentDashboardDto {

    private UserProfileResponse profile;
    private long totalPurchasedProjects;
    private BigDecimal totalAmountSpent;
    private List<PurchasedProjectDto> recentPurchases;

    public StudentDashboardDto() {
    }

    public StudentDashboardDto(UserProfileResponse profile, long totalPurchasedProjects,
                               BigDecimal totalAmountSpent, List<PurchasedProjectDto> recentPurchases) {
        this.profile = profile;
        this.totalPurchasedProjects = totalPurchasedProjects;
        this.totalAmountSpent = totalAmountSpent;
        this.recentPurchases = recentPurchases;
    }

    public UserProfileResponse getProfile() {
        return profile;
    }

    public void setProfile(UserProfileResponse profile) {
        this.profile = profile;
    }

    public long getTotalPurchasedProjects() {
        return totalPurchasedProjects;
    }

    public void setTotalPurchasedProjects(long totalPurchasedProjects) {
        this.totalPurchasedProjects = totalPurchasedProjects;
    }

    public BigDecimal getTotalAmountSpent() {
        return totalAmountSpent;
    }

    public void setTotalAmountSpent(BigDecimal totalAmountSpent) {
        this.totalAmountSpent = totalAmountSpent;
    }

    public List<PurchasedProjectDto> getRecentPurchases() {
        return recentPurchases;
    }

    public void setRecentPurchases(List<PurchasedProjectDto> recentPurchases) {
        this.recentPurchases = recentPurchases;
    }
}
