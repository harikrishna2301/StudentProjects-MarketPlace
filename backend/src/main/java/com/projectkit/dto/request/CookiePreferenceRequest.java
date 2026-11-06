package com.projectkit.dto.request;

import jakarta.validation.constraints.Size;

public class CookiePreferenceRequest {

    @Size(max = 100, message = "Session ID cannot exceed 100 characters")
    private String sessionId;
    private Boolean functional = false;
    private Boolean analytics = false;
    private Boolean marketing = false;

    public CookiePreferenceRequest() {
    }

    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    public Boolean getFunctional() {
        return functional;
    }

    public void setFunctional(Boolean functional) {
        this.functional = functional;
    }

    public Boolean getAnalytics() {
        return analytics;
    }

    public void setAnalytics(Boolean analytics) {
        this.analytics = analytics;
    }

    public Boolean getMarketing() {
        return marketing;
    }

    public void setMarketing(Boolean marketing) {
        this.marketing = marketing;
    }
}
