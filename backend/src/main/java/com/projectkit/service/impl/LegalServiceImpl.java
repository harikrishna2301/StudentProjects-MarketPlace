package com.projectkit.service.impl;

import com.projectkit.dto.request.*;
import com.projectkit.dto.response.*;
import com.projectkit.entity.*;
import com.projectkit.enums.AccountStatus;
import com.projectkit.enums.DeletionRequestStatus;
import com.projectkit.enums.LegalDocumentType;
import com.projectkit.exception.BadRequestException;
import com.projectkit.exception.ResourceNotFoundException;
import com.projectkit.repository.*;
import com.projectkit.service.LegalService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class LegalServiceImpl implements LegalService {

    private final LegalDocumentRepository legalDocumentRepository;
    private final UserConsentRepository userConsentRepository;
    private final CookiePreferenceRepository cookiePreferenceRepository;
    private final AccountDeletionRequestRepository deletionRequestRepository;
    private final UserRepository userRepository;

    public LegalServiceImpl(LegalDocumentRepository legalDocumentRepository,
                            UserConsentRepository userConsentRepository,
                            CookiePreferenceRepository cookiePreferenceRepository,
                            AccountDeletionRequestRepository deletionRequestRepository,
                            UserRepository userRepository) {
        this.legalDocumentRepository = legalDocumentRepository;
        this.userConsentRepository = userConsentRepository;
        this.cookiePreferenceRepository = cookiePreferenceRepository;
        this.deletionRequestRepository = deletionRequestRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public LegalDocumentDto getPublishedDocument(LegalDocumentType type) {
        LegalDocument doc = legalDocumentRepository
                .findFirstByDocumentTypeAndIsPublishedTrueOrderByPublishedAtDesc(type)
                .orElseThrow(() -> new ResourceNotFoundException("Published legal document not found for type: " + type));
        return LegalDocumentDto.fromEntity(doc);
    }

    @Override
    @Transactional(readOnly = true)
    public List<LegalDocumentDto> getAllPublishedDocuments() {
        return legalDocumentRepository.findByIsPublishedTrueOrderByDocumentTypeAsc().stream()
                .map(LegalDocumentDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<LegalDocumentDto> getAllDocumentsAdmin() {
        return legalDocumentRepository.findAllByOrderByDocumentTypeAscVersionDesc().stream()
                .map(LegalDocumentDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public LegalDocumentDto createOrUpdateDocumentAdmin(LegalDocumentRequest request) {
        Optional<LegalDocument> existing = legalDocumentRepository
                .findByDocumentTypeAndVersion(request.getDocumentType(), request.getVersion().trim());

        LegalDocument doc;
        if (existing.isPresent()) {
            doc = existing.get();
            doc.setTitle(request.getTitle().trim());
            doc.setContent(request.getContent());
            if (request.getIsPublished() != null) {
                doc.setPublished(request.getIsPublished());
                if (request.getIsPublished() && doc.getPublishedAt() == null) {
                    doc.setPublishedAt(LocalDateTime.now());
                }
            }
        } else {
            doc = new LegalDocument();
            doc.setDocumentType(request.getDocumentType());
            doc.setVersion(request.getVersion().trim());
            doc.setTitle(request.getTitle().trim());
            doc.setContent(request.getContent());
            doc.setPublished(request.getIsPublished() != null && request.getIsPublished());
            doc.setRequiresReview(true);
            if (doc.isPublished()) {
                doc.setPublishedAt(LocalDateTime.now());
            }
        }

        LegalDocument saved = legalDocumentRepository.save(doc);
        return LegalDocumentDto.fromEntity(saved);
    }

    @Override
    @Transactional
    public LegalDocumentDto publishDocumentAdmin(Long id) {
        LegalDocument doc = legalDocumentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("LegalDocument", "id", id));

        doc.setPublished(true);
        doc.setPublishedAt(LocalDateTime.now());
        doc.setRequiresReview(false);

        LegalDocument updated = legalDocumentRepository.save(doc);
        return LegalDocumentDto.fromEntity(updated);
    }

    @Override
    @Transactional
    public UserConsentDto recordConsent(Long userId, UserConsentRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        // Create immutable audit record
        UserConsent consent = new UserConsent();
        consent.setUser(user);
        consent.setDocumentType(request.getDocumentType());
        consent.setDocumentVersion(request.getDocumentVersion());
        consent.setIpAddress(request.getIpAddress());
        consent.setUserAgent(request.getUserAgent());
        consent.setAcceptedAt(LocalDateTime.now());

        UserConsent saved = userConsentRepository.save(consent);
        return UserConsentDto.fromEntity(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserConsentDto> getUserConsentHistory(Long userId) {
        return userConsentRepository.findByUserIdOrderByAcceptedAtDesc(userId).stream()
                .map(UserConsentDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<UserConsentDto> getAllConsentsAdmin(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("acceptedAt").descending());
        Page<UserConsent> consents = userConsentRepository.findAllByOrderByAcceptedAtDesc(pageable);

        List<UserConsentDto> content = consents.getContent().stream()
                .map(UserConsentDto::fromEntity)
                .collect(Collectors.toList());

        return PagedResponse.fromPage(consents, content);
    }

    @Override
    @Transactional
    public CookiePreferenceDto saveCookiePreferences(Long userId, CookiePreferenceRequest request) {
        Optional<CookiePreference> existingPref = Optional.empty();

        if (userId != null) {
            existingPref = cookiePreferenceRepository.findByUserId(userId);
        } else if (request.getSessionId() != null && !request.getSessionId().isBlank()) {
            existingPref = cookiePreferenceRepository.findBySessionId(request.getSessionId());
        }

        CookiePreference pref;
        if (existingPref.isPresent()) {
            pref = existingPref.get();
        } else {
            pref = new CookiePreference();
            if (userId != null) {
                userRepository.findById(userId).ifPresent(pref::setUser);
            }
            pref.setSessionId(request.getSessionId());
        }

        pref.setEssential(true); // Always true for platform operation
        pref.setFunctional(request.getFunctional() != null && request.getFunctional());
        pref.setAnalytics(request.getAnalytics() != null && request.getAnalytics());
        pref.setMarketing(request.getMarketing() != null && request.getMarketing());

        CookiePreference saved = cookiePreferenceRepository.save(pref);
        return CookiePreferenceDto.fromEntity(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public CookiePreferenceDto getCookiePreferences(Long userId, String sessionId) {
        Optional<CookiePreference> pref = Optional.empty();

        if (userId != null) {
            pref = cookiePreferenceRepository.findByUserId(userId);
        }
        if (pref.isEmpty() && sessionId != null && !sessionId.isBlank()) {
            pref = cookiePreferenceRepository.findBySessionId(sessionId);
        }

        if (pref.isPresent()) {
            return CookiePreferenceDto.fromEntity(pref.get());
        }

        // Return default essential-only preferences
        CookiePreferenceDto defaultDto = new CookiePreferenceDto();
        defaultDto.setEssential(true);
        defaultDto.setFunctional(false);
        defaultDto.setAnalytics(false);
        defaultDto.setMarketing(false);
        defaultDto.setUpdatedAt(LocalDateTime.now());
        return defaultDto;
    }

    @Override
    @Transactional
    public AccountDeletionResponseDto requestAccountDeletion(Long userId, AccountDeletionRequestDto request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        Optional<AccountDeletionRequest> existingPending = deletionRequestRepository
                .findFirstByUserIdAndStatus(userId, DeletionRequestStatus.PENDING);

        if (existingPending.isPresent()) {
            throw new BadRequestException("An account deletion request is already pending review for this account.");
        }

        AccountDeletionRequest deletionRequest = new AccountDeletionRequest(user, request.getReason());
        AccountDeletionRequest saved = deletionRequestRepository.save(deletionRequest);

        return AccountDeletionResponseDto.fromEntity(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<AccountDeletionResponseDto> getAllDeletionRequestsAdmin(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("requestedAt").descending());
        Page<AccountDeletionRequest> requests = deletionRequestRepository.findAllByOrderByRequestedAtDesc(pageable);

        List<AccountDeletionResponseDto> content = requests.getContent().stream()
                .map(AccountDeletionResponseDto::fromEntity)
                .collect(Collectors.toList());

        return PagedResponse.fromPage(requests, content);
    }

    @Override
    @Transactional
    public AccountDeletionResponseDto processDeletionRequestAdmin(Long requestId, ProcessDeletionRequest request) {
        AccountDeletionRequest req = deletionRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("AccountDeletionRequest", "id", requestId));

        req.setStatus(request.getStatus());
        req.setAdminNotes(request.getAdminNotes());
        req.setProcessedAt(LocalDateTime.now());

        if (request.getStatus() == DeletionRequestStatus.APPROVED || request.getStatus() == DeletionRequestStatus.COMPLETED) {
            User user = req.getUser();
            user.setStatus(AccountStatus.SUSPENDED);
            userRepository.save(user);
        }

        AccountDeletionRequest saved = deletionRequestRepository.save(req);
        return AccountDeletionResponseDto.fromEntity(saved);
    }
}
