package com.projectkit.service.impl;

import com.projectkit.entity.Project;
import com.projectkit.entity.ProjectFile;
import com.projectkit.enums.FileType;
import com.projectkit.exception.BadRequestException;
import com.projectkit.exception.FileStorageException;
import com.projectkit.exception.ResourceNotFoundException;
import com.projectkit.repository.ProjectFileRepository;
import com.projectkit.repository.ProjectRepository;
import com.projectkit.service.FileStorageService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Arrays;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;

@Service
public class FileStorageServiceImpl implements FileStorageService {

    private static final Set<String> ALLOWED_IMAGE_EXTENSIONS = Set.of("png", "jpg", "jpeg", "webp");
    private static final Set<String> ALLOWED_DOC_EXTENSIONS = Set.of("pdf");
    private static final Set<String> ALLOWED_CODE_EXTENSIONS = Set.of("zip");
    private static final Set<String> ALLOWED_PRESENTATION_EXTENSIONS = Set.of("ppt", "pptx");
    private static final Set<String> ALLOWED_VIDEO_EXTENSIONS = Set.of("mp4", "webm");

    private static final long MAX_SOURCE_CODE_SIZE = 50L * 1024 * 1024; // 50 MB
    private static final long MAX_DOCUMENTATION_SIZE = 25L * 1024 * 1024; // 25 MB
    private static final long MAX_PRESENTATION_SIZE = 50L * 1024 * 1024; // 50 MB
    private static final long MAX_VIDEO_SIZE = 100L * 1024 * 1024; // 100 MB
    private static final long MAX_IMAGE_SIZE = 10L * 1024 * 1024; // 10 MB

    private final Path fileStorageLocation;
    private final ProjectRepository projectRepository;
    private final ProjectFileRepository projectFileRepository;

    public FileStorageServiceImpl(
            @Value("${projectkit.storage.upload-dir:./uploads}") String uploadDir,
            ProjectRepository projectRepository,
            ProjectFileRepository projectFileRepository) {

        this.projectRepository = projectRepository;
        this.projectFileRepository = projectFileRepository;
        this.fileStorageLocation = Paths.get(uploadDir).toAbsolutePath().normalize();

        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new FileStorageException("Could not create directory for uploads: " + uploadDir, ex);
        }
    }

    @Override
    @Transactional
    public ProjectFile storeProjectFile(Long projectId, MultipartFile file, FileType fileType) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", projectId));

        validateUploadPayload(file, fileType);

        String originalFilename = sanitizeAndNormalizeFilename(file.getOriginalFilename());
        String extension = getFileExtension(originalFilename);

        String subDir = switch (fileType) {
            case SOURCE_CODE -> "projects/" + projectId + "/source";
            case DOCUMENTATION -> "projects/" + projectId + "/docs";
            case PRESENTATION -> "projects/" + projectId + "/presentation";
            case DEMO_VIDEO -> "projects/" + projectId + "/video";
            case SCREENSHOT -> "projects/" + projectId + "/screenshots";
            case THUMBNAIL -> "thumbnails";
        };

        try {
            Path targetDir = this.fileStorageLocation.resolve(subDir).normalize();
            Files.createDirectories(targetDir);

            // Server-generated safe filename with verified extension
            String storedFileName = UUID.randomUUID() + "." + extension;
            Path targetLocation = targetDir.resolve(storedFileName).normalize();

            // Guard against traversal beyond base directory
            if (!targetLocation.startsWith(this.fileStorageLocation)) {
                throw new FileStorageException("Invalid destination file path traversal attempted.");
            }

            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            String relativeFilePath = subDir + "/" + storedFileName;
            String verifiedMimeType = resolveVerifiedMimeType(extension, fileType);

            // If unique single-file type, replace previous file entry
            if (fileType == FileType.SOURCE_CODE || fileType == FileType.DOCUMENTATION ||
                fileType == FileType.PRESENTATION || fileType == FileType.DEMO_VIDEO) {
                projectFileRepository.findByProjectIdAndFileType(projectId, fileType).ifPresent(oldFile -> {
                    deleteFile(oldFile.getFilePath());
                    projectFileRepository.delete(oldFile);
                });
            }

            ProjectFile projectFile = new ProjectFile(
                    project,
                    fileType,
                    originalFilename,
                    relativeFilePath,
                    file.getSize(),
                    verifiedMimeType
            );

            return projectFileRepository.save(projectFile);

        } catch (IOException ex) {
            throw new FileStorageException("Could not store file " + originalFilename + ". Please try again!", ex);
        }
    }

    @Override
    public String storeThumbnail(MultipartFile file) {
        validateUploadPayload(file, FileType.THUMBNAIL);

        String originalFilename = sanitizeAndNormalizeFilename(file.getOriginalFilename());
        String extension = getFileExtension(originalFilename);

        try {
            Path targetDir = this.fileStorageLocation.resolve("thumbnails").normalize();
            Files.createDirectories(targetDir);

            String storedFileName = UUID.randomUUID() + "." + extension;
            Path targetLocation = targetDir.resolve(storedFileName).normalize();

            if (!targetLocation.startsWith(this.fileStorageLocation)) {
                throw new FileStorageException("Path traversal attempted.");
            }

            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
            return "/api/admin/uploads/thumbnails/" + storedFileName;

        } catch (IOException ex) {
            throw new FileStorageException("Could not store thumbnail file " + originalFilename, ex);
        }
    }

    @Override
    public Resource loadFileAsResource(String relativeFilePath) {
        try {
            if (relativeFilePath == null || relativeFilePath.isBlank() || relativeFilePath.contains("..")) {
                throw new FileStorageException("Invalid or malformed file path requested.");
            }

            Path filePath = this.fileStorageLocation.resolve(relativeFilePath).normalize();

            if (!filePath.startsWith(this.fileStorageLocation)) {
                throw new FileStorageException("Cannot access files outside the storage root directory.");
            }

            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists() && resource.isReadable() && Files.isRegularFile(filePath)) {
                return resource;
            } else {
                throw new ResourceNotFoundException("File not found or unreadable: " + relativeFilePath);
            }
        } catch (MalformedURLException ex) {
            throw new ResourceNotFoundException("File not found: " + relativeFilePath);
        }
    }

    @Override
    public void deleteFile(String relativeFilePath) {
        if (relativeFilePath == null || relativeFilePath.isBlank() || relativeFilePath.contains("..")) {
            return;
        }

        try {
            Path filePath = this.fileStorageLocation.resolve(relativeFilePath).normalize();
            if (filePath.startsWith(this.fileStorageLocation)) {
                Files.deleteIfExists(filePath);
            }
        } catch (IOException ignored) {
        }
    }

    // -------------------------------------------------------------------
    // Security & Content Validation Helpers
    // -------------------------------------------------------------------

    private void validateUploadPayload(MultipartFile file, FileType fileType) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("Uploaded file cannot be null or empty.");
        }

        String filename = sanitizeAndNormalizeFilename(file.getOriginalFilename());
        String extension = getFileExtension(filename);

        // 1. Extension validation against expected file category
        switch (fileType) {
            case SOURCE_CODE -> {
                if (!ALLOWED_CODE_EXTENSIONS.contains(extension)) {
                    throw new BadRequestException("Source code package must be a .zip archive. Found: ." + extension);
                }
                if (file.getSize() > MAX_SOURCE_CODE_SIZE) {
                    throw new BadRequestException("Source code package exceeds 50MB limit.");
                }
            }
            case DOCUMENTATION -> {
                if (!ALLOWED_DOC_EXTENSIONS.contains(extension)) {
                    throw new BadRequestException("Documentation must be a .pdf document. Found: ." + extension);
                }
                if (file.getSize() > MAX_DOCUMENTATION_SIZE) {
                    throw new BadRequestException("Documentation file exceeds 25MB limit.");
                }
            }
            case PRESENTATION -> {
                if (!ALLOWED_PRESENTATION_EXTENSIONS.contains(extension)) {
                    throw new BadRequestException("Presentation must be a .ppt or .pptx document. Found: ." + extension);
                }
                if (file.getSize() > MAX_PRESENTATION_SIZE) {
                    throw new BadRequestException("Presentation file exceeds 50MB limit.");
                }
            }
            case DEMO_VIDEO -> {
                if (!ALLOWED_VIDEO_EXTENSIONS.contains(extension)) {
                    throw new BadRequestException("Demo video must be a .mp4 or .webm file. Found: ." + extension);
                }
                if (file.getSize() > MAX_VIDEO_SIZE) {
                    throw new BadRequestException("Demo video exceeds 100MB limit.");
                }
            }
            case SCREENSHOT, THUMBNAIL -> {
                if (!ALLOWED_IMAGE_EXTENSIONS.contains(extension)) {
                    throw new BadRequestException("Images must be in PNG, JPG, or WEBP format. Found: ." + extension);
                }
                if (file.getSize() > MAX_IMAGE_SIZE) {
                    throw new BadRequestException("Image file exceeds 10MB limit.");
                }
            }
        }

        // 2. Magic-byte and executable content inspection
        byte[] header = readHeaderBytes(file, 28);
        inspectHeaderSecurity(header, extension, fileType);
    }

    private String sanitizeAndNormalizeFilename(String rawFilename) {
        if (rawFilename == null || rawFilename.isBlank()) {
            throw new BadRequestException("Filename cannot be empty.");
        }

        String cleaned = StringUtils.cleanPath(rawFilename);

        // Path Traversal Security Checks
        if (cleaned.contains("..") || cleaned.contains("/") || cleaned.contains("\\") || cleaned.contains("\0")) {
            throw new BadRequestException("Filename contains invalid path sequence or malicious traversal characters: " + rawFilename);
        }

        return cleaned;
    }

    private String getFileExtension(String filename) {
        int dotIndex = filename.lastIndexOf('.');
        if (dotIndex == -1 || dotIndex == filename.length() - 1) {
            throw new BadRequestException("File must have a valid extension: " + filename);
        }
        return filename.substring(dotIndex + 1).toLowerCase();
    }

    private byte[] readHeaderBytes(MultipartFile file, int length) {
        try (InputStream is = file.getInputStream()) {
            byte[] buffer = new byte[length];
            int read = is.read(buffer, 0, length);
            if (read <= 0) {
                throw new BadRequestException("Unable to read file content header.");
            }
            return (read < length) ? Arrays.copyOf(buffer, read) : buffer;
        } catch (IOException ex) {
            throw new FileStorageException("Failed to read file content for security inspection.", ex);
        }
    }

    private void inspectHeaderSecurity(byte[] header, String extension, FileType fileType) {
        // Prohibition 1: Windows PE / DOS Executables (MZ)
        if (header.length >= 2 && header[0] == 0x4D && header[1] == 0x5A) {
            throw new BadRequestException("Security Violation: Executable binaries (MZ/PE) are strictly prohibited.");
        }

        // Prohibition 2: Linux ELF Binaries (0x7F 'E' 'L' 'F')
        if (header.length >= 4 && header[0] == 0x7F && header[1] == 0x45 && header[2] == 0x4C && header[3] == 0x46) {
            throw new BadRequestException("Security Violation: Executable binaries (ELF) are strictly prohibited.");
        }

        // Prohibition 3: Java Bytecode (.class)
        if (header.length >= 4 && (header[0] & 0xFF) == 0xCA && (header[1] & 0xFF) == 0xFE && (header[2] & 0xFF) == 0xBA && (header[3] & 0xFF) == 0xBE) {
            throw new BadRequestException("Security Violation: Compiled Java class bytecode is prohibited.");
        }

        // Prohibition 4: Disguised Scripting (PHP, HTML/JS scripts, Shell)
        String headerAscii = new String(header, StandardCharsets.US_ASCII).toLowerCase();
        if (headerAscii.startsWith("<?php") || headerAscii.startsWith("<script") ||
                headerAscii.startsWith("<!doctype html") || headerAscii.startsWith("<html") ||
                headerAscii.startsWith("#!/bin") || headerAscii.startsWith("#!/usr")) {
            throw new BadRequestException("Security Violation: Script files cannot be disguised as project media or archives.");
        }

        // Signature Matching per File Type:
        if (fileType == FileType.SOURCE_CODE) {
            // ZIP Magic Bytes: PK\x03\x04, PK\x05\x06 (empty), or PK\x07\x08 (spanned)
            boolean isZip = header.length >= 4 && header[0] == 0x50 && header[1] == 0x4B &&
                    ((header[2] == 0x03 && header[3] == 0x04) ||
                     (header[2] == 0x05 && header[3] == 0x06) ||
                     (header[2] == 0x07 && header[3] == 0x08));
            if (!isZip) {
                throw new BadRequestException("File content is not a valid ZIP archive (magic bytes mismatch).");
            }
        } else if (fileType == FileType.DOCUMENTATION) {
            // PDF Magic Bytes: %PDF (0x25, 0x50, 0x44, 0x46)
            boolean isPdf = header.length >= 4 && header[0] == 0x25 && header[1] == 0x50 && header[2] == 0x44 && header[3] == 0x46;
            if (!isPdf) {
                throw new BadRequestException("File content is not a valid PDF document (magic bytes mismatch).");
            }
        } else if (fileType == FileType.SCREENSHOT || fileType == FileType.THUMBNAIL) {
            boolean isPng = header.length >= 8 &&
                    (header[0] & 0xFF) == 0x89 && header[1] == 0x50 && header[2] == 0x4E && header[3] == 0x47 &&
                    header[4] == 0x0D && header[5] == 0x0A && header[6] == 0x1A && header[7] == 0x0A;

            boolean isJpg = header.length >= 3 &&
                    (header[0] & 0xFF) == 0xFF && (header[1] & 0xFF) == 0xD8 && (header[2] & 0xFF) == 0xFF;

            boolean isWebp = header.length >= 12 &&
                    header[0] == 0x52 && header[1] == 0x49 && header[2] == 0x46 && header[3] == 0x46 &&
                    header[8] == 0x57 && header[9] == 0x45 && header[10] == 0x42 && header[11] == 0x50;

            if (!isPng && !isJpg && !isWebp) {
                throw new BadRequestException("Image content does not match PNG, JPG, or WEBP header specifications.");
            }
        }
    }

    private String resolveVerifiedMimeType(String extension, FileType fileType) {
        return switch (extension) {
            case "zip" -> "application/zip";
            case "pdf" -> "application/pdf";
            case "ppt" -> "application/vnd.ms-powerpoint";
            case "pptx" -> "application/vnd.openxmlformats-officedocument.presentationml.presentation";
            case "mp4" -> "video/mp4";
            case "webm" -> "video/webm";
            case "png" -> "image/png";
            case "jpg", "jpeg" -> "image/jpeg";
            case "webp" -> "image/webp";
            default -> (fileType == FileType.SOURCE_CODE) ? "application/zip" : "application/octet-stream";
        };
    }
}
