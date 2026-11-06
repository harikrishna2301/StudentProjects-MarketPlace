package com.projectkit.repository;

import com.projectkit.entity.Invoice;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Long> {

    Optional<Invoice> findByInvoiceNumber(String invoiceNumber);

    Optional<Invoice> findByOrderId(Long orderId);

    Page<Invoice> findByUserIdOrderByInvoiceDateDesc(Long userId, Pageable pageable);

    boolean existsByInvoiceNumber(String invoiceNumber);
}
