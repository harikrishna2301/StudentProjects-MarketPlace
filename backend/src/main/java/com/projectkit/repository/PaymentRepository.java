package com.projectkit.repository;

import com.projectkit.entity.Payment;
import com.projectkit.enums.PaymentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    Optional<Payment> findByPaymentNumber(String paymentNumber);

    Optional<Payment> findByOrderId(Long orderId);

    Optional<Payment> findByRazorpayOrderId(String razorpayOrderId);

    Optional<Payment> findByRazorpayPaymentId(String razorpayPaymentId);

    Page<Payment> findByStatusOrderByCreatedAtDesc(PaymentStatus status, Pageable pageable);

    Page<Payment> findAllByOrderByCreatedAtDesc(Pageable pageable);
}
