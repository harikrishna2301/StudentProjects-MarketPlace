package com.projectkit.repository;

import com.projectkit.entity.StudentProjectAccess;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentProjectAccessRepository extends JpaRepository<StudentProjectAccess, Long> {

    @Query("SELECT CASE WHEN COUNT(spa) > 0 THEN TRUE ELSE FALSE END " +
           "FROM StudentProjectAccess spa " +
           "WHERE spa.student.id = :studentId AND spa.project.id = :projectId AND spa.accessStatus = 'ACTIVE'")
    boolean hasActiveAccess(@Param("studentId") Long studentId, @Param("projectId") Long projectId);

    Optional<StudentProjectAccess> findByStudentIdAndProjectId(Long studentId, Long projectId);

    Optional<StudentProjectAccess> findByStudentIdAndProjectIdAndAccessStatus(Long studentId, Long projectId, String accessStatus);

    @EntityGraph(attributePaths = {"project", "project.category"})
    List<StudentProjectAccess> findByStudentIdAndAccessStatusOrderByGrantedAtDesc(Long studentId, String accessStatus);

    @EntityGraph(attributePaths = {"project", "project.category"})
    List<StudentProjectAccess> findByStudentIdAndAccessTypeAndAccessStatusOrderByGrantedAtDesc(
            Long studentId, String accessType, String accessStatus
    );

    long countByStudentIdAndAccessStatus(Long studentId, String accessStatus);

    long countByStudentIdAndAccessTypeAndAccessStatus(Long studentId, String accessType, String accessStatus);

    long countByProjectIdAndAccessStatus(Long projectId, String accessStatus);

    long countByProjectIdAndAccessTypeAndAccessStatus(Long projectId, String accessType, String accessStatus);

    long countByAccessTypeAndAccessStatus(String accessType, String accessStatus);
}
