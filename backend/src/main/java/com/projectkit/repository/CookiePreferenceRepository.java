package com.projectkit.repository;

import com.projectkit.entity.CookiePreference;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CookiePreferenceRepository extends JpaRepository<CookiePreference, Long> {

    Optional<CookiePreference> findByUserId(Long userId);

    Optional<CookiePreference> findBySessionId(String sessionId);
}
