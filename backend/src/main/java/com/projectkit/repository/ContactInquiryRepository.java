package com.projectkit.repository;

import com.projectkit.entity.ContactInquiry;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContactInquiryRepository extends JpaRepository<ContactInquiry, Long> {

    Page<ContactInquiry> findAllByOrderByCreatedAtDesc(Pageable pageable);

    List<ContactInquiry> findByStatusOrderByCreatedAtDesc(String status);

    long countByStatus(String status);
}
