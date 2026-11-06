package com.projectkit.service;

import com.projectkit.dto.request.CreateCouponRequest;
import com.projectkit.dto.request.ValidateCouponRequest;
import com.projectkit.dto.response.CouponDto;
import com.projectkit.dto.response.CouponValidationResponse;
import com.projectkit.entity.Coupon;
import com.projectkit.entity.Project;
import com.projectkit.enums.DiscountType;
import com.projectkit.exception.BadRequestException;
import com.projectkit.repository.CouponRedemptionRepository;
import com.projectkit.repository.CouponRepository;
import com.projectkit.repository.ProjectRepository;
import com.projectkit.service.impl.CouponServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("Coupon and Discount Engine Service Tests")
class CouponServiceTest {

    @Mock
    private CouponRepository couponRepository;

    @Mock
    private CouponRedemptionRepository couponRedemptionRepository;

    @Mock
    private ProjectRepository projectRepository;

    private CouponServiceImpl couponService;

    @BeforeEach
    void setUp() {
        couponService = new CouponServiceImpl(couponRepository, couponRedemptionRepository, projectRepository);
    }

    @Test
    @DisplayName("Calculates percentage discount accurately without cap")
    void calculatesPercentageDiscountAccurately() {
        Coupon coupon = new Coupon(
                "SAVE10",
                DiscountType.PERCENTAGE,
                new BigDecimal("10.00"),
                BigDecimal.ZERO,
                null,
                LocalDateTime.now().minusDays(1),
                LocalDateTime.now().plusDays(10),
                100,
                1
        );

        BigDecimal discount = couponService.calculateDiscount(coupon, new BigDecimal("1000.00"));
        assertEquals(new BigDecimal("100.00"), discount);
    }

    @Test
    @DisplayName("Enforces maximum discount ceiling for percentage discounts")
    void enforcesMaxDiscountCeiling() {
        Coupon coupon = new Coupon(
                "BIG50",
                DiscountType.PERCENTAGE,
                new BigDecimal("50.00"),
                BigDecimal.ZERO,
                new BigDecimal("300.00"), // Max discount cap of ₹300
                LocalDateTime.now().minusDays(1),
                LocalDateTime.now().plusDays(10),
                100,
                1
        );

        // 50% of ₹1000 is ₹500, but capped at ₹300
        BigDecimal discount = couponService.calculateDiscount(coupon, new BigDecimal("1000.00"));
        assertEquals(new BigDecimal("300.00"), discount);
    }

    @Test
    @DisplayName("Calculates flat fixed amount discount accurately")
    void calculatesFlatFixedDiscount() {
        Coupon coupon = new Coupon(
                "FLAT150",
                DiscountType.FIXED_AMOUNT,
                new BigDecimal("150.00"),
                BigDecimal.ZERO,
                null,
                LocalDateTime.now().minusDays(1),
                LocalDateTime.now().plusDays(10),
                100,
                1
        );

        BigDecimal discount = couponService.calculateDiscount(coupon, new BigDecimal("800.00"));
        assertEquals(new BigDecimal("150.00"), discount);
    }

    @Test
    @DisplayName("Guarantees discount never exceeds order total (no negative totals)")
    void preventsNegativeTotalsWhenFixedDiscountExceedsAmount() {
        Coupon coupon = new Coupon(
                "SUPER500",
                DiscountType.FIXED_AMOUNT,
                new BigDecimal("500.00"),
                BigDecimal.ZERO,
                null,
                LocalDateTime.now().minusDays(1),
                LocalDateTime.now().plusDays(10),
                100,
                1
        );

        // Order is ₹350, coupon is ₹500 -> discount capped at ₹350
        BigDecimal discount = couponService.calculateDiscount(coupon, new BigDecimal("350.00"));
        assertEquals(new BigDecimal("350.00"), discount);
    }

    @Test
    @DisplayName("Validates active coupon and calculates correct final amount")
    void validatesActiveCouponSuccessfully() {
        Coupon coupon = new Coupon(
                "STUDENT10",
                DiscountType.PERCENTAGE,
                new BigDecimal("10.00"),
                new BigDecimal("500.00"),
                new BigDecimal("200.00"),
                LocalDateTime.now().minusDays(1),
                LocalDateTime.now().plusDays(10),
                50,
                1
        );

        Project project = new Project();
        project.setId(101L);
        project.setTitle("Autonomous Drone System");
        project.setPrice(new BigDecimal("1000.00"));
        project.setActive(true);

        when(couponRepository.findByCodeIgnoreCase("STUDENT10")).thenReturn(Optional.of(coupon));
        when(projectRepository.findById(101L)).thenReturn(Optional.of(project));
        when(couponRedemptionRepository.getUserRedemptionCount(any(), eq(1L))).thenReturn(0);

        ValidateCouponRequest request = new ValidateCouponRequest("STUDENT10", List.of(101L));
        CouponValidationResponse response = couponService.validateCoupon(request, 1L);

        assertTrue(response.isValid());
        assertEquals("STUDENT10", response.getCouponCode());
        assertEquals(new BigDecimal("100.00"), response.getDiscountAmount());
        assertEquals(new BigDecimal("1000.00"), response.getOriginalAmount());
        assertEquals(new BigDecimal("900.00"), response.getFinalAmount());
    }

    @Test
    @DisplayName("Rejects expired coupon with clear failure message")
    void rejectsExpiredCoupon() {
        Coupon expired = new Coupon(
                "EXPIRED20",
                DiscountType.PERCENTAGE,
                new BigDecimal("20.00"),
                BigDecimal.ZERO,
                null,
                LocalDateTime.now().minusDays(30),
                LocalDateTime.now().minusDays(1), // Expired yesterday
                100,
                1
        );

        when(couponRepository.findByCodeIgnoreCase("EXPIRED20")).thenReturn(Optional.of(expired));

        ValidateCouponRequest request = new ValidateCouponRequest("EXPIRED20", List.of(101L));
        CouponValidationResponse response = couponService.validateCoupon(request, 1L);

        assertFalse(response.isValid());
        assertTrue(response.getMessage().toLowerCase().contains("expired"));
    }

    @Test
    @DisplayName("Rejects coupon when minimum order amount requirement is not met")
    void rejectsCouponBelowMinimumOrderRequirement() {
        Coupon coupon = new Coupon(
                "MIN1500",
                DiscountType.PERCENTAGE,
                new BigDecimal("15.00"),
                new BigDecimal("1500.00"), // Minimum ₹1,500
                null,
                LocalDateTime.now().minusDays(1),
                LocalDateTime.now().plusDays(10),
                100,
                1
        );

        Project smallProject = new Project();
        smallProject.setId(102L);
        smallProject.setTitle("Basic Unit Converter");
        smallProject.setPrice(new BigDecimal("499.00")); // Below ₹1,500
        smallProject.setActive(true);

        when(couponRepository.findByCodeIgnoreCase("MIN1500")).thenReturn(Optional.of(coupon));
        when(projectRepository.findById(102L)).thenReturn(Optional.of(smallProject));
        when(couponRedemptionRepository.getUserRedemptionCount(any(), eq(1L))).thenReturn(0);

        ValidateCouponRequest request = new ValidateCouponRequest("MIN1500", List.of(102L));
        CouponValidationResponse response = couponService.validateCoupon(request, 1L);

        assertFalse(response.isValid());
        assertTrue(response.getMessage().contains("Minimum order amount of ₹1500"));
    }

    @Test
    @DisplayName("Rejects coupon when user has reached their per-user redemption limit")
    void rejectsDuplicateUserRedemptionBeyondLimit() {
        Coupon coupon = new Coupon(
                "ONCEONLY",
                DiscountType.FIXED_AMOUNT,
                new BigDecimal("100.00"),
                BigDecimal.ZERO,
                null,
                LocalDateTime.now().minusDays(1),
                LocalDateTime.now().plusDays(10),
                100,
                1 // Limit 1 per student
        );

        when(couponRepository.findByCodeIgnoreCase("ONCEONLY")).thenReturn(Optional.of(coupon));
        when(couponRedemptionRepository.getUserRedemptionCount(any(), eq(5L))).thenReturn(1); // Already used 1 time

        ValidateCouponRequest request = new ValidateCouponRequest("ONCEONLY", List.of(101L));
        CouponValidationResponse response = couponService.validateCoupon(request, 5L);

        assertFalse(response.isValid());
        assertTrue(response.getMessage().toLowerCase().contains("already used"));
    }

    @Test
    @DisplayName("Rejects coupon when total global usage limit is exhausted")
    void rejectsExhaustedTotalUsageLimit() {
        Coupon exhausted = new Coupon(
                "LIMITED",
                DiscountType.FIXED_AMOUNT,
                new BigDecimal("50.00"),
                BigDecimal.ZERO,
                null,
                LocalDateTime.now().minusDays(1),
                LocalDateTime.now().plusDays(10),
                10, // Total 10 uses allowed
                1
        );
        exhausted.setTimesUsed(10); // Exhausted

        when(couponRepository.findByCodeIgnoreCase("LIMITED")).thenReturn(Optional.of(exhausted));

        ValidateCouponRequest request = new ValidateCouponRequest("LIMITED", List.of(101L));
        CouponValidationResponse response = couponService.validateCoupon(request, 2L);

        assertFalse(response.isValid());
        assertTrue(response.getMessage().toLowerCase().contains("redemption limit"));
    }

    @Test
    @DisplayName("Locks and increments coupon atomically on order creation")
    void locksAndIncrementsCouponOnRedemption() {
        Coupon coupon = new Coupon(
                "VALIDLOCK",
                DiscountType.PERCENTAGE,
                new BigDecimal("10.00"),
                BigDecimal.ZERO,
                null,
                LocalDateTime.now().minusDays(1),
                LocalDateTime.now().plusDays(10),
                50,
                1
        );
        assertEquals(0, coupon.getTimesUsed());

        when(couponRepository.findByCodeWithLock("VALIDLOCK")).thenReturn(Optional.of(coupon));
        when(couponRepository.save(any(Coupon.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Coupon locked = couponService.getAndLockCouponForRedemption("VALIDLOCK", 1L, new BigDecimal("1000.00"));
        assertNotNull(locked);
        assertEquals(1, locked.getTimesUsed());
        verify(couponRepository).save(coupon);
    }
}
