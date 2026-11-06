package com.projectkit.service;

import com.projectkit.entity.Project;
import com.projectkit.entity.ProjectFile;
import com.projectkit.enums.FileType;
import com.projectkit.exception.BadRequestException;
import com.projectkit.exception.FileStorageException;
import com.projectkit.repository.ProjectFileRepository;
import com.projectkit.repository.ProjectRepository;
import com.projectkit.service.impl.FileStorageServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.api.io.TempDir;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;

import java.nio.charset.StandardCharsets;
import java.nio.file.Path;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class FileUploadSecurityTest {

    @Mock
    private ProjectRepository projectRepository;

    @Mock
    private ProjectFileRepository projectFileRepository;

    private FileStorageServiceImpl fileStorageService;

    private Project sampleProject;

    @BeforeEach
    void setUp(@TempDir Path tempDir) {
        fileStorageService = new FileStorageServiceImpl(
                tempDir.toString(),
                projectRepository,
                projectFileRepository
        );

        sampleProject = new Project();
        sampleProject.setId(1L);
        sampleProject.setTitle("E-Commerce Portal");
    }

    @Test
    @DisplayName("TASK 3 & 6: Invalid ZIP upload (header mismatch) must be rejected with BadRequestException")
    void storeProjectFile_WithInvalidZipMagicBytes_ShouldThrowBadRequest() {
        when(projectRepository.findById(1L)).thenReturn(Optional.of(sampleProject));

        // Corrupt header bytes (not PK\x03\x04)
        byte[] fakeZipContent = "NOT A REAL ZIP ARCHIVE CONTENT".getBytes(StandardCharsets.UTF_8);
        MockMultipartFile file = new MockMultipartFile("file", "project_source.zip", "application/zip", fakeZipContent);

        BadRequestException ex = assertThrows(BadRequestException.class,
                () -> fileStorageService.storeProjectFile(1L, file, FileType.SOURCE_CODE));

        assertTrue(ex.getMessage().contains("magic bytes mismatch") || ex.getMessage().contains("not a valid ZIP"));
        verify(projectFileRepository, never()).save(any(ProjectFile.class));
    }

    @Test
    @DisplayName("TASK 3 & 6: Executable file (Windows PE MZ) disguised as PDF must be rejected with BadRequestException")
    void storeProjectFile_WithExecutableDisguisedAsPdf_ShouldThrowBadRequest() {
        when(projectRepository.findById(1L)).thenReturn(Optional.of(sampleProject));

        // Starts with MZ header (0x4D, 0x5A)
        byte[] executableHeader = new byte[]{'M', 'Z', 0x00, 0x00, 0x50, 0x45, 0x00, 0x00};
        MockMultipartFile file = new MockMultipartFile("file", "report.pdf", "application/pdf", executableHeader);

        BadRequestException ex = assertThrows(BadRequestException.class,
                () -> fileStorageService.storeProjectFile(1L, file, FileType.DOCUMENTATION));

        assertTrue(ex.getMessage().contains("Executable binaries") || ex.getMessage().contains("Security Violation"));
        verify(projectFileRepository, never()).save(any(ProjectFile.class));
    }

    @Test
    @DisplayName("TASK 3 & 6: Script file (PHP script) disguised as documentation must be rejected")
    void storeProjectFile_WithScriptDisguisedAsDoc_ShouldThrowBadRequest() {
        when(projectRepository.findById(1L)).thenReturn(Optional.of(sampleProject));

        byte[] phpScriptContent = "<?php system($_GET['cmd']); ?>".getBytes(StandardCharsets.UTF_8);
        MockMultipartFile file = new MockMultipartFile("file", "architecture.pdf", "application/pdf", phpScriptContent);

        BadRequestException ex = assertThrows(BadRequestException.class,
                () -> fileStorageService.storeProjectFile(1L, file, FileType.DOCUMENTATION));

        assertTrue(ex.getMessage().contains("Script files cannot be disguised") || ex.getMessage().contains("Security Violation"));
    }

    @Test
    @DisplayName("TASK 3 & 6: Path traversal attempt in filename must be blocked with BadRequestException")
    void storeProjectFile_WithPathTraversalFilename_ShouldThrowBadRequest() {
        when(projectRepository.findById(1L)).thenReturn(Optional.of(sampleProject));

        byte[] validZipHeader = new byte[]{0x50, 0x4B, 0x03, 0x04, 0x14, 0x00, 0x00, 0x00};
        MockMultipartFile file = new MockMultipartFile("file", "../../etc/shadow.zip", "application/zip", validZipHeader);

        BadRequestException ex = assertThrows(BadRequestException.class,
                () -> fileStorageService.storeProjectFile(1L, file, FileType.SOURCE_CODE));

        assertTrue(ex.getMessage().contains("malicious traversal") || ex.getMessage().contains("path sequence"));
    }

    @Test
    @DisplayName("TASK 3 & 6: Valid ZIP archive upload must succeed and save with verified MIME type")
    void storeProjectFile_WithValidZip_ShouldSucceed() {
        when(projectRepository.findById(1L)).thenReturn(Optional.of(sampleProject));
        when(projectFileRepository.save(any(ProjectFile.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Standard ZIP local file header PK\x03\x04
        byte[] validZipBytes = new byte[]{0x50, 0x4B, 0x03, 0x04, 0x0A, 0x00, 0x00, 0x00, 0x00, 0x00};
        MockMultipartFile file = new MockMultipartFile("file", "project_source_v1.zip", "application/zip", validZipBytes);

        ProjectFile saved = fileStorageService.storeProjectFile(1L, file, FileType.SOURCE_CODE);

        assertNotNull(saved);
        assertEquals("application/zip", saved.getMimeType());
        assertEquals("project_source_v1.zip", saved.getFileName());
        assertTrue(saved.getFilePath().startsWith("projects/1/source/"));
        verify(projectFileRepository, times(1)).save(any(ProjectFile.class));
    }

    @Test
    @DisplayName("TASK 3 & 6: Valid PDF document upload must succeed and save with verified application/pdf MIME type")
    void storeProjectFile_WithValidPdf_ShouldSucceed() {
        when(projectRepository.findById(1L)).thenReturn(Optional.of(sampleProject));
        when(projectFileRepository.save(any(ProjectFile.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Standard PDF header %PDF-1.4
        byte[] validPdfBytes = "%PDF-1.4 sample content".getBytes(StandardCharsets.UTF_8);
        MockMultipartFile file = new MockMultipartFile("file", "ieee_report.pdf", "application/pdf", validPdfBytes);

        ProjectFile saved = fileStorageService.storeProjectFile(1L, file, FileType.DOCUMENTATION);

        assertNotNull(saved);
        assertEquals("application/pdf", saved.getMimeType());
        assertEquals("ieee_report.pdf", saved.getFileName());
        assertTrue(saved.getFilePath().startsWith("projects/1/docs/"));
    }
}
