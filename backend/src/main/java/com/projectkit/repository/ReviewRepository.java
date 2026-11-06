package com.projectkit.repository;

import com.projectkit.entity.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    Page<Review> findByProjectIdAndIsApprovedTrueOrderByCreatedAtDesc(Long projectId, Pageable pageable);

    Page<Review> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);

    Optional<Review> findByUserIdAndProjectId(Long userId, Long projectId);

    boolean existsByUserIdAndProjectId(Long userId, Long projectId);

    long countByProjectIdAndIsApprovedTrue(Long projectId);

    @Query("SELECT COALESCE(AVG(r.rating), 0.0) FROM Review r WHERE r.project.id = :projectId AND r.isApproved = true")
    Double getAverageRatingForProject(@Param("projectId") Long projectId);
}
