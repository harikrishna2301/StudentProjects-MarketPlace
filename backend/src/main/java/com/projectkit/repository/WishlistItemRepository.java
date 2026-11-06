package com.projectkit.repository;

import com.projectkit.entity.WishlistItem;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WishlistItemRepository extends JpaRepository<WishlistItem, Long> {

    List<WishlistItem> findByUserIdOrderByCreatedAtDesc(Long userId);

    Page<WishlistItem> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);

    Optional<WishlistItem> findByUserIdAndProjectId(Long userId, Long projectId);

    boolean existsByUserIdAndProjectId(Long userId, Long projectId);

    void deleteByUserIdAndProjectId(Long userId, Long projectId);

    long countByUserId(Long userId);

    long countByProjectId(Long projectId);
}
