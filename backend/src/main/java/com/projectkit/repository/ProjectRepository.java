package com.projectkit.repository;

import com.projectkit.entity.Project;
import com.projectkit.enums.DifficultyLevel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long>, JpaSpecificationExecutor<Project> {

    Optional<Project> findBySlug(String slug);

    @org.springframework.data.jpa.repository.EntityGraph(attributePaths = {"category"})
    Optional<Project> findBySlugAndIsActiveTrue(String slug);

    @org.springframework.data.jpa.repository.EntityGraph(attributePaths = {"category"})
    Optional<Project> findByIdAndIsActiveTrue(Long id);

    boolean existsBySlug(String slug);

    @org.springframework.data.jpa.repository.EntityGraph(attributePaths = {"category"})
    Page<Project> findByIsActiveTrue(Pageable pageable);

    @Query("SELECT p FROM Project p JOIN FETCH p.category WHERE p.isFeatured = true AND p.isActive = true ORDER BY p.createdAt DESC")
    List<Project> findTop8ByIsFeaturedTrueAndIsActiveTrueOrderByCreatedAtDesc();

    @Query("SELECT p FROM Project p JOIN FETCH p.category WHERE p.isActive = true ORDER BY p.purchaseCount DESC")
    List<Project> findTop6ByIsActiveTrueOrderByPurchaseCountDesc();

    @Query(value = "SELECT p FROM Project p JOIN FETCH p.category WHERE p.isActive = true AND " +
           "(:categoryId IS NULL OR p.category.id = :categoryId) AND " +
           "(:difficulty IS NULL OR p.difficultyLevel = :difficulty) AND " +
           "(:minPrice IS NULL OR p.price >= :minPrice) AND " +
           "(:maxPrice IS NULL OR p.price <= :maxPrice) AND " +
           "(:keyword IS NULL OR LOWER(p.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           " LOWER(p.technologies) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           " LOWER(p.shortDescription) LIKE LOWER(CONCAT('%', :keyword, '%')))",
           countQuery = "SELECT COUNT(p) FROM Project p WHERE p.isActive = true AND " +
           "(:categoryId IS NULL OR p.category.id = :categoryId) AND " +
           "(:difficulty IS NULL OR p.difficultyLevel = :difficulty) AND " +
           "(:minPrice IS NULL OR p.price >= :minPrice) AND " +
           "(:maxPrice IS NULL OR p.price <= :maxPrice) AND " +
           "(:keyword IS NULL OR LOWER(p.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           " LOWER(p.technologies) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           " LOWER(p.shortDescription) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Project> searchProjects(
            @Param("keyword") String keyword,
            @Param("categoryId") Long categoryId,
            @Param("difficulty") DifficultyLevel difficulty,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            Pageable pageable
    );

    long countByIsActiveTrue();
}
