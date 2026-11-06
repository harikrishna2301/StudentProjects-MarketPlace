package com.projectkit.repository;

import com.projectkit.entity.ProjectFile;
import com.projectkit.enums.FileType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectFileRepository extends JpaRepository<ProjectFile, Long> {

    List<ProjectFile> findByProjectId(Long projectId);

    Optional<ProjectFile> findByProjectIdAndFileType(Long projectId, FileType fileType);

    List<ProjectFile> findByProjectIdAndFileTypeIn(Long projectId, List<FileType> fileTypes);

    void deleteByProjectId(Long projectId);
}
