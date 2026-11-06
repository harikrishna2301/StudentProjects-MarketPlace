package com.projectkit.repository;

import com.projectkit.entity.AccountDeletionRequest;
import com.projectkit.enums.DeletionRequestStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AccountDeletionRequestRepository extends JpaRepository<AccountDeletionRequest, Long> {

    List<AccountDeletionRequest> findByUserIdOrderByRequestedAtDesc(Long userId);

    Optional<AccountDeletionRequest> findFirstByUserIdAndStatus(Long userId, DeletionRequestStatus status);

    Page<AccountDeletionRequest> findAllByOrderByRequestedAtDesc(Pageable pageable);

    long countByStatus(DeletionRequestStatus status);
}
