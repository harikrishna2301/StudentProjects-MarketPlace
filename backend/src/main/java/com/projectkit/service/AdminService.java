package com.projectkit.service;

import com.projectkit.dto.request.UpdateUserStatusRequest;
import com.projectkit.dto.response.*;

public interface AdminService {

    AdminDashboardDto getDashboardStats();

    PagedResponse<UserProfileResponse> getStudents(int page, int size);

    UserProfileResponse updateStudentStatus(Long studentId, UpdateUserStatusRequest request);

    PagedResponse<OrderResponse> getAllOrders(int page, int size);

    PagedResponse<PaymentResponse> getAllPayments(int page, int size);
}
