package com.projectkit.repository;

import com.projectkit.entity.Order;
import com.projectkit.enums.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    @org.springframework.data.jpa.repository.EntityGraph(attributePaths = {"items"})
    Optional<Order> findByOrderNumber(String orderNumber);

    Optional<Order> findByRazorpayOrderId(String razorpayOrderId);

    @org.springframework.data.jpa.repository.EntityGraph(attributePaths = {"items"})
    Page<Order> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);

    List<Order> findByUserIdAndStatusOrderByCreatedAtDesc(Long userId, OrderStatus status);

    @Query("SELECT CASE WHEN COUNT(o) > 0 THEN TRUE ELSE FALSE END " +
           "FROM Order o JOIN o.items i " +
           "WHERE o.user.id = :userId AND i.project.id = :projectId AND o.status = com.projectkit.enums.OrderStatus.PAID")
    boolean hasUserPurchasedProject(@Param("userId") Long userId, @Param("projectId") Long projectId);

    long countByStatus(OrderStatus status);

    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o WHERE o.status = com.projectkit.enums.OrderStatus.PAID")
    BigDecimal sumTotalPaidRevenue();
}
