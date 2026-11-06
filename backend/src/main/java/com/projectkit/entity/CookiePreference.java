package com.projectkit.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "cookie_preferences")
public class CookiePreference {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "session_id", length = 100)
    private String sessionId;

    @Column(nullable = false)
    private boolean essential = true;

    @Column(nullable = false)
    private boolean functional = false;

    @Column(nullable = false)
    private boolean analytics = false;

    @Column(nullable = false)
    private boolean marketing = false;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public CookiePreference() {
    }

    public CookiePreference(User user, String sessionId, boolean essential, boolean functional, boolean analytics, boolean marketing) {
        this.user = user;
        this.sessionId = sessionId;
        this.essential = essential;
        this.functional = functional;
        this.analytics = analytics;
        this.marketing = marketing;
    }

    @PrePersist
    @PreUpdate
    protected void onPersistOrUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    public boolean isEssential() {
        return essential;
    }

    public void setEssential(boolean essential) {
        this.essential = essential;
    }

    public boolean isFunctional() {
        return functional;
    }

    public void setFunctional(boolean functional) {
        this.functional = functional;
    }

    public boolean isAnalytics() {
        return analytics;
    }

    public void setAnalytics(boolean analytics) {
        this.analytics = analytics;
    }

    public boolean isMarketing() {
        return marketing;
    }

    public void setMarketing(boolean marketing) {
        this.marketing = marketing;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
