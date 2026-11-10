package com.projectkit.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Entity tracking explicit project entitlements for students.
 * Enforces strict access control: students must either claim a verified FREE kit
 * or complete a successful payment for a PAID kit to obtain an entitlement.
 */
@Entity
@Table(
    name = "student_project_access",
    uniqueConstraints = @UniqueConstraint(name = "uq_student_project", columnNames = {"student_id", "project_id"}),
    indexes = {
        @Index(name = "idx_access_student", columnList = "student_id"),
        @Index(name = "idx_access_project", columnList = "project_id"),
        @Index(name = "idx_access_type", columnList = "access_type"),
        @Index(name = "idx_access_status", columnList = "access_status")
    }
)
public class StudentProjectAccess {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @Column(name = "access_type", nullable = false, length = 30)
    private String accessType; // 'FREE_CLAIM' or 'PAID_PURCHASE'

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    private Order order; // Nullable for free claims

    @Column(name = "payment_id", length = 100)
    private String paymentId; // Nullable for free claims

    @Column(name = "granted_at", nullable = false, updatable = false)
    private LocalDateTime grantedAt;

    @Column(name = "access_status", nullable = false, length = 20)
    private String accessStatus = "ACTIVE"; // 'ACTIVE', 'REVOKED'

    public StudentProjectAccess() {
    }

    public StudentProjectAccess(User student, Project project, String accessType, Order order, String paymentId) {
        this.student = student;
        this.project = project;
        this.accessType = accessType;
        this.order = order;
        this.paymentId = paymentId;
        this.accessStatus = "ACTIVE";
    }

    @PrePersist
    protected void onCreate() {
        if (this.grantedAt == null) {
            this.grantedAt = LocalDateTime.now();
        }
        if (this.accessStatus == null) {
            this.accessStatus = "ACTIVE";
        }
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getStudent() {
        return student;
    }

    public void setStudent(User student) {
        this.student = student;
    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    public String getAccessType() {
        return accessType;
    }

    public void setAccessType(String accessType) {
        this.accessType = accessType;
    }

    public Order getOrder() {
        return order;
    }

    public void setOrder(Order order) {
        this.order = order;
    }

    public String getPaymentId() {
        return paymentId;
    }

    public void setPaymentId(String paymentId) {
        this.paymentId = paymentId;
    }

    public LocalDateTime getGrantedAt() {
        return grantedAt;
    }

    public void setGrantedAt(LocalDateTime grantedAt) {
        this.grantedAt = grantedAt;
    }

    public String getAccessStatus() {
        return accessStatus;
    }

    public void setAccessStatus(String accessStatus) {
        this.accessStatus = accessStatus;
    }
}
