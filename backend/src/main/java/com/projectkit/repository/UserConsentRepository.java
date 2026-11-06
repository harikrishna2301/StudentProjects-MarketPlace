package com.projectkit.repository;

import com.projectkit.entity.UserConsent;
import com.projectkit.enums.LegalDocumentType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserConsentRepository extends JpaRepository<UserConsent, Long> {

    List<UserConsent> findByUserIdOrderByAcceptedAtDesc(Long userId);

    Optional<UserConsent> findTopByUserIdAndDocumentTypeOrderByAcceptedAtDesc(Long userId, LegalDocumentType documentType);

    Page<UserConsent> findAllByOrderByAcceptedAtDesc(Pageable pageable);
}
