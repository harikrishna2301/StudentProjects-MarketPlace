package com.projectkit.repository;

import com.projectkit.entity.LegalDocument;
import com.projectkit.enums.LegalDocumentType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LegalDocumentRepository extends JpaRepository<LegalDocument, Long> {

    Optional<LegalDocument> findFirstByDocumentTypeAndIsPublishedTrueOrderByPublishedAtDesc(LegalDocumentType documentType);

    List<LegalDocument> findByIsPublishedTrueOrderByDocumentTypeAsc();

    List<LegalDocument> findAllByOrderByDocumentTypeAscVersionDesc();

    Optional<LegalDocument> findByDocumentTypeAndVersion(LegalDocumentType documentType, String version);

    boolean existsByDocumentTypeAndVersion(LegalDocumentType documentType, String version);
}
