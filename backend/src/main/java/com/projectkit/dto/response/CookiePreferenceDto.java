package com.projectkit.dto.response;

import com.projectkit.entity.CookiePreference;

import java.time.LocalDateTime;

public class CookiePreferenceDto {

    private boolean essential = true;
    private boolean functional = false;
    private boolean analytics = false;
    private boolean marketing = false;
    private LocalDateTime updatedAt;

    public CookiePreferenceDto() {
    }

    public static CookiePreferenceDto fromEntity(CookiePreference pref) {
        CookiePreferenceDto dto = new CookiePreferenceDto();
        dto.setEssential(pref.isEssential());
        dto.setFunctional(pref.isFunctional());
        dto.setAnalytics(pref.isAnalytics());
        dto.setMarketing(pref.isMarketing());
        dto.setUpdatedAt(pref.getUpdatedAt());
        return dto;
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
