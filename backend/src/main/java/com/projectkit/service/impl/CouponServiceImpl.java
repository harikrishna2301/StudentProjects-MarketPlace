package com.projectkit.service.impl;

import com.projectkit.dto.request.CreateCouponRequest;
import com.projectkit.dto.request.ValidateCouponRequest;
import com.projectkit.dto.response.CouponDto;
import com.projectkit.dto.response.CouponValidationResponse;
import com.projectkit.entity.*;
import com.projectkit.enums.DiscountType;
import com.projectkit.exception.BadRequestException;
import com.projectkit.exception.ResourceNotFoundException;
import com.projectkit.repository.CouponRedemptionRepository;
import com.projectkit.repository.CouponRepository;
import com.projectkit.repository.ProjectRepository;
import com.projectkit.service.CouponService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CouponServiceImpl implements CouponService {

    private static final Logger logger = LoggerFactory.getLogger(CouponServiceImpl.class);

    private final CouponRepository couponRepository;
    private final CouponRedemptionRepository couponRedemptionRepository;
    private final ProjectRepository projectRepository;

    public CouponServiceImpl(CouponRepository couponRepository,
                             CouponRedemptionRepository couponRedemptionRepository,
                             ProjectRepository projectRepository) {
        this.couponRepository = couponRepository;
        this.couponRedemptionRepository = couponRedemptionRepository;
        this.projectRepository = projectRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public CouponValidationResponse validateCoupon(ValidateCouponRequest request, Long userId) {
        if (request.getCouponCode() == null || request.getCouponCode().trim().isEmpty()) {
            return CouponValidationResponse.invalid("Coupon code is required.");
        }

        String code = request.getCouponCode().trim().toUpperCase();
        Coupon coupon = couponRepository.findByCodeIgnoreCase(code).orElse(null);

        if (coupon == null) {
            return CouponValidationResponse.invalid("Invalid coupon code '" + code + "'.");
        }

        if (!coupon.isActive()) {
            return CouponValidationResponse.invalid("Coupon code '" + code + "' is no longer active.");
        }

        LocalDateTime now = LocalDateTime.now();
        if (coupon.getStartDate() != null && now.isBefore(coupon.getStartDate())) {
            return CouponValidationResponse.invalid("Coupon code '" + code + "' is not yet valid.");
        }

        if (coupon.getExpiryDate() != null && now.isAfter(coupon.getExpiryDate())) {
            return CouponValidationResponse.invalid("Coupon code '" + code + "' has expired.");
        }

        if (!coupon.hasAvailableUses()) {
            return CouponValidationResponse.invalid("Coupon code '" + code + "' has reached its total redemption limit.");
        }

        if (userId != null && coupon.getPerUserLimit() != null) {
            int userRedemptions = couponRedemptionRepository.getUserRedemptionCount(coupon.getId(), userId);
            if (userRedemptions >= coupon.getPerUserLimit()) {
                return CouponValidationResponse.invalid("You have already used this coupon code.");
            }
        }

        // Calculate original order amount from verified project records in database
        BigDecimal originalAmount = calculateOrderAmountFromDatabase(request.getProjectIds());

        if (coupon.getMinOrderAmount() != null && originalAmount.compareTo(coupon.getMinOrderAmount()) < 0) {
            return CouponValidationResponse.invalid(
                    String.format("Minimum order amount of ₹%s is required to apply coupon %s.",
                            coupon.getMinOrderAmount().setScale(0, RoundingMode.HALF_UP), code)
            );
        }

        BigDecimal discountAmount = calculateDiscount(coupon, originalAmount);
        BigDecimal finalAmount = originalAmount.subtract(discountAmount).max(BigDecimal.ZERO);

        String message = coupon.getDiscountType() == DiscountType.PERCENTAGE
                ? String.format("%.0f%% discount applied successfully (saved ₹%s)",
                    coupon.getDiscountValue(), discountAmount.setScale(2, RoundingMode.HALF_UP))
                : String.format("Flat ₹%s discount applied successfully",
                    discountAmount.setScale(2, RoundingMode.HALF_UP));

        return CouponValidationResponse.valid(
                coupon.getCode(),
                coupon.getDiscountType(),
                coupon.getDiscountValue(),
                discountAmount,
                originalAmount,
                finalAmount,
                message
        );
    }

    @Override
    public BigDecimal calculateDiscount(Coupon coupon, BigDecimal originalAmount) {
        if (coupon == null || originalAmount == null || originalAmount.compareTo(BigDecimal.ZERO) <= 0) {
            return BigDecimal.ZERO;
        }

        BigDecimal discount;

        if (coupon.getDiscountType() == DiscountType.PERCENTAGE) {
            // discount = (originalAmount * discountValue) / 100
            discount = originalAmount.multiply(coupon.getDiscountValue())
                    .divide(new BigDecimal("100"), 2, RoundingMode.HALF_UP);

            // Cap at maximum discount if defined
            if (coupon.getMaxDiscountAmount() != null && coupon.getMaxDiscountAmount().compareTo(BigDecimal.ZERO) > 0) {
                discount = discount.min(coupon.getMaxDiscountAmount());
            }
        } else { // FIXED_AMOUNT
            discount = coupon.getDiscountValue();
        }

        // Absolute safeguard: discount can never exceed original amount (no negative totals)
        return discount.min(originalAmount).max(BigDecimal.ZERO);
    }

    @Override
    @Transactional
    public Coupon getAndLockCouponForRedemption(String code, Long userId, BigDecimal originalAmount) {
        if (code == null || code.trim().isEmpty()) {
            return null;
        }

        String cleanCode = code.trim().toUpperCase();
        Coupon coupon = couponRepository.findByCodeWithLock(cleanCode)
                .orElseThrow(() -> new BadRequestException("Coupon '" + cleanCode + "' does not exist."));

        if (!coupon.isActive()) {
            throw new BadRequestException("Coupon '" + cleanCode + "' is inactive.");
        }

        LocalDateTime now = LocalDateTime.now();
        if (coupon.getStartDate() != null && now.isBefore(coupon.getStartDate())) {
            throw new BadRequestException("Coupon '" + cleanCode + "' is not yet valid.");
        }

        if (coupon.getExpiryDate() != null && now.isAfter(coupon.getExpiryDate())) {
            throw new BadRequestException("Coupon '" + cleanCode + "' has expired.");
        }

        if (!coupon.hasAvailableUses()) {
            throw new BadRequestException("Coupon '" + cleanCode + "' has reached its total usage limit.");
        }

        if (userId != null && coupon.getPerUserLimit() != null) {
            int userRedemptions = couponRedemptionRepository.getUserRedemptionCount(coupon.getId(), userId);
            if (userRedemptions >= coupon.getPerUserLimit()) {
                throw new BadRequestException("You have already redeemed coupon '" + cleanCode + "'.");
            }
        }

        if (coupon.getMinOrderAmount() != null && originalAmount.compareTo(coupon.getMinOrderAmount()) < 0) {
            throw new BadRequestException(String.format("Minimum order value of ₹%s required for coupon %s.",
                    coupon.getMinOrderAmount(), cleanCode));
        }

        coupon.incrementTimesUsed();
        return couponRepository.save(coupon);
    }

    @Override
    @Transactional
    public void recordCouponUsage(Coupon coupon, User user, Order order, BigDecimal discountAmount) {
        if (coupon == null || user == null || order == null) return;

        CouponRedemption redemption = new CouponRedemption(coupon, user, order, discountAmount);
        couponRedemptionRepository.save(redemption);
        logger.info("Recorded coupon redemption: user={}, coupon={}, order={}, discount=₹{}",
                user.getId(), coupon.getCode(), order.getOrderNumber(), discountAmount);
    }

    // Admin Operations
    @Override
    @Transactional
    public CouponDto createCoupon(CreateCouponRequest request) {
        String cleanCode = request.getCode().trim().toUpperCase();
        if (couponRepository.existsByCodeIgnoreCase(cleanCode)) {
            throw new BadRequestException("Coupon with code '" + cleanCode + "' already exists.");
        }

        if (request.getDiscountType() == DiscountType.PERCENTAGE) {
            if (request.getDiscountValue().compareTo(BigDecimal.ZERO) <= 0 ||
                request.getDiscountValue().compareTo(new BigDecimal("100")) > 0) {
                throw new BadRequestException("Percentage discount must be between 0.01% and 100%.");
            }
        }

        Coupon coupon = new Coupon(
                cleanCode,
                request.getDiscountType(),
                request.getDiscountValue(),
                request.getMinOrderAmount(),
                request.getMaxDiscountAmount(),
                request.getStartDate(),
                request.getExpiryDate(),
                request.getUsageLimit(),
                request.getPerUserLimit()
        );
        coupon.setActive(request.isActive());

        Coupon saved = couponRepository.save(coupon);
        logger.info("Admin created new coupon: {}", saved.getCode());
        return CouponDto.fromEntity(saved);
    }

    @Override
    @Transactional
    public CouponDto updateCouponStatus(Long couponId, boolean active) {
        Coupon coupon = couponRepository.findById(couponId)
                .orElseThrow(() -> new ResourceNotFoundException("Coupon", "id", couponId));

        coupon.setActive(active);
        Coupon updated = couponRepository.save(coupon);
        logger.info("Admin updated coupon {} status to active={}", updated.getCode(), active);
        return CouponDto.fromEntity(updated);
    }

    @Override
    @Transactional
    public void deleteCoupon(Long couponId) {
        Coupon coupon = couponRepository.findById(couponId)
                .orElseThrow(() -> new ResourceNotFoundException("Coupon", "id", couponId));

        long usage = couponRedemptionRepository.countByCouponId(couponId);
        if (usage > 0) {
            // Soft delete/deactivate if already used in historical orders
            coupon.setActive(false);
            couponRepository.save(coupon);
            logger.info("Coupon {} has {} historical redemptions; deactivated rather than purged.", coupon.getCode(), usage);
        } else {
            couponRepository.delete(coupon);
            logger.info("Admin deleted unused coupon: {}", coupon.getCode());
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<CouponDto> getAllCoupons() {
        return couponRepository.findAll().stream()
                .map(CouponDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public CouponDto getCouponById(Long couponId) {
        Coupon coupon = couponRepository.findById(couponId)
                .orElseThrow(() -> new ResourceNotFoundException("Coupon", "id", couponId));
        return CouponDto.fromEntity(coupon);
    }

    private BigDecimal calculateOrderAmountFromDatabase(List<Long> projectIds) {
        if (projectIds == null || projectIds.isEmpty()) {
            return BigDecimal.ZERO;
        }

        BigDecimal total = BigDecimal.ZERO;
        for (Long projectId : projectIds) {
            Project project = projectRepository.findById(projectId)
                    .orElseThrow(() -> new ResourceNotFoundException("Project", "id", projectId));

            BigDecimal itemPrice = (project.getDiscountPrice() != null && project.getDiscountPrice().compareTo(BigDecimal.ZERO) > 0)
                    ? project.getDiscountPrice()
                    : project.getPrice();

            total = total.add(itemPrice);
        }
        return total;
    }
}
