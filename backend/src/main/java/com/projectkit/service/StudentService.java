package com.projectkit.service;

import com.projectkit.dto.request.ChangePasswordRequest;
import com.projectkit.dto.request.UpdateProfileRequest;
import com.projectkit.dto.response.PurchasedProjectDto;
import com.projectkit.dto.response.StudentDashboardDto;
import com.projectkit.dto.response.UserProfileResponse;

import java.util.List;

public interface StudentService {

    UserProfileResponse getProfile(Long userId);

    UserProfileResponse updateProfile(Long userId, UpdateProfileRequest request);

    void changePassword(Long userId, ChangePasswordRequest request);

    List<PurchasedProjectDto> getPurchasedProjects(Long userId);

    StudentDashboardDto getDashboard(Long userId);

    com.projectkit.dto.response.ClaimFreeProjectResponseDto claimFreeProject(Long userId, Long projectId);

    List<com.projectkit.dto.response.MyKitDto> getMyKits(Long userId);

    com.projectkit.dto.response.ProjectAccessStatusDto checkProjectAccess(Long userId, Long projectId);

    List<com.projectkit.dto.response.ProjectSummaryDto> getAvailableFreeKits(Long userId);
}
