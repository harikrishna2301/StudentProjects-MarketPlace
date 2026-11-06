package com.projectkit.repository;

import com.projectkit.entity.PasswordResetToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {

    Optional<PasswordResetToken> findByTokenAndIsUsedFalse(String token);

    Optional<PasswordResetToken> findByToken(String token);

    @Modifying
    @Query("UPDATE PasswordResetToken p SET p.isUsed = true WHERE p.user.id = :userId")
    void invalidateAllActiveTokensForUser(@Param("userId") Long userId);

    @Modifying
    @Query("DELETE FROM PasswordResetToken p WHERE p.expiryDate < :now OR p.isUsed = true")
    void cleanupExpiredTokens(@Param("now") LocalDateTime now);
}
