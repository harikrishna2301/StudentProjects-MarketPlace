package com.projectkit.repository;

import com.projectkit.entity.CouponRedemption;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CouponRedemptionRepository extends JpaRepository<CouponRedemption, Long> {

    long countByCouponIdAndUserId(Long couponId, Long userId);

    long countByCouponId(Long couponId);

    List<CouponRedemption> findByOrderId(Long orderId);

    List<CouponRedemption> findByUserId(Long userId);

    @Query("SELECT COUNT(cr) FROM CouponRedemption cr WHERE cr.coupon.id = :couponId AND cr.user.id = :userId")
    int getUserRedemptionCount(@Param("couponId") Long couponId, @Param("userId") Long userId);
}
