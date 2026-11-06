package com.projectkit.service;

import com.projectkit.dto.request.*;
import com.projectkit.dto.response.*;
import com.projectkit.enums.LegalDocumentType;

import java.util.List;

public interface LegalService {

    LegalDocumentDto getPublishedDocument(LegalDocumentType type);

    List<LegalDocumentDto> getAllPublishedDocuments();

    List<LegalDocumentDto> getAllDocumentsAdmin();

    LegalDocumentDto createOrUpdateDocumentAdmin(LegalDocumentRequest request);

    LegalDocumentDto publishDocumentAdmin(Long id);

    UserConsentDto recordConsent(Long userId, UserConsentRequest request);

    List<UserConsentDto> getUserConsentHistory(Long userId);

    PagedResponse<UserConsentDto> getAllConsentsAdmin(int page, int size);

    CookiePreferenceDto saveCookiePreferences(Long userId, CookiePreferenceRequest request);

    CookiePreferenceDto getCookiePreferences(Long userId, String sessionId);

    AccountDeletionResponseDto requestAccountDeletion(Long userId, AccountDeletionRequestDto request);

    PagedResponse<AccountDeletionResponseDto> getAllDeletionRequestsAdmin(int page, int size);

    AccountDeletionResponseDto processDeletionRequestAdmin(Long requestId, ProcessDeletionRequest request);
}
