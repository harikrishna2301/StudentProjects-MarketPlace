package com.projectkit.dto.response;

import java.math.BigDecimal;
import java.util.List;

public class AdminDashboardDto {

    private long totalStudents;
    private long totalProjects;
    private long totalOrders;
    private long totalPaidOrders;
    private BigDecimal totalRevenue;
    private List<OrderResponse> recentOrders;
    private List<UserProfileResponse> recentStudents;

    public AdminDashboardDto() {
    }

    public long getTotalStudents() {
        return totalStudents;
    }

    public void setTotalStudents(long totalStudents) {
        this.totalStudents = totalStudents;
    }

    public long getTotalProjects() {
        return totalProjects;
    }

    public void setTotalProjects(long totalProjects) {
        this.totalProjects = totalProjects;
    }

    public long getTotalOrders() {
        return totalOrders;
    }

    public void setTotalOrders(long totalOrders) {
        this.totalOrders = totalOrders;
    }

    public long getTotalPaidOrders() {
        return totalPaidOrders;
    }

    public void setTotalPaidOrders(long totalPaidOrders) {
        this.totalPaidOrders = totalPaidOrders;
    }

    public BigDecimal getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(BigDecimal totalRevenue) {
        this.totalRevenue = totalRevenue;
    }

    public List<OrderResponse> getRecentOrders() {
        return recentOrders;
    }

    public void setRecentOrders(List<OrderResponse> recentOrders) {
        this.recentOrders = recentOrders;
    }

    public List<UserProfileResponse> getRecentStudents() {
        return recentStudents;
    }

    public void setRecentStudents(List<UserProfileResponse> recentStudents) {
        this.recentStudents = recentStudents;
    }
}
