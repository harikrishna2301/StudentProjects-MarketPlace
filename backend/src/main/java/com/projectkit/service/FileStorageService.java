package com.projectkit.service;

import com.projectkit.entity.ProjectFile;
import com.projectkit.enums.FileType;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

public interface FileStorageService {

    ProjectFile storeProjectFile(Long projectId, MultipartFile file, FileType fileType);

    String storeThumbnail(MultipartFile file);

    Resource loadFileAsResource(String relativeFilePath);

    void deleteFile(String relativeFilePath);
}
