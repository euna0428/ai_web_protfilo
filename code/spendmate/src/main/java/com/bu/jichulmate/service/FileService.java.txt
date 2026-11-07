package com.bu.jichulmate.service;

import com.bu.jichulmate.domain.Attachment;
import com.bu.jichulmate.repository.AttachmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FileService {

    private static final Set<String> ALLOWED_IMAGE_EXTENSIONS = Set.of(
            ".jpg",
            ".jpeg",
            ".png",
            ".gif",
            ".webp"
    );

    private final AttachmentRepository attachmentRepository;

    @Value("${file.upload.dir}")
    private String uploadDir;

    @Value("${file.upload.max-size:10485760}")
    private long maxFileSize;

    @Value("${file.upload.max-count:5}")
    private int maxFileCount;

    @Transactional
    public Attachment uploadFile(MultipartFile file, String refTable, Long refId) throws IOException {
        if (file == null || file.isEmpty()) {
            return null;
        }

        validateImageFile(file);

        String orgFileName = StringUtils.cleanPath(file.getOriginalFilename());

        if (orgFileName == null || orgFileName.isBlank()) {
            orgFileName = "upload-image";
        }

        String extension = getExtension(orgFileName);
        String savedFileName = UUID.randomUUID() + extension;
        String normalizedUploadDir = resolveUploadDir();

        File dest = new File(normalizedUploadDir, savedFileName);

        File parentDir = dest.getParentFile();

        if (parentDir != null && !parentDir.exists()) {
            parentDir.mkdirs();
        }

        file.transferTo(dest);

        String filePath = "/images/" + savedFileName;

        Attachment attachment = Attachment.builder()
                .refTable(refTable)
                .refId(refId)
                .orgFileName(orgFileName)
                .savedFileName(savedFileName)
                .filePath(filePath)
                .fileSize(file.getSize())
                .regDate(LocalDateTime.now())
                .build();

        return attachmentRepository.save(attachment);
    }

    @Transactional
    public List<Attachment> uploadFiles(MultipartFile[] files, String refTable, Long refId) throws IOException {
        List<Attachment> result = new ArrayList<>();

        if (files == null || files.length == 0) {
            return result;
        }

        List<MultipartFile> validFiles = new ArrayList<>();

        for (MultipartFile file : files) {
            if (file != null && !file.isEmpty()) {
                validFiles.add(file);
            }
        }

        if (validFiles.size() > maxFileCount) {
            throw new IllegalArgumentException("이미지는 최대 " + maxFileCount + "장까지 업로드할 수 있습니다.");
        }

        for (MultipartFile file : validFiles) {
            Attachment attachment = uploadFile(file, refTable, refId);

            if (attachment != null) {
                result.add(attachment);
            }
        }

        return result;
    }

    @Transactional(readOnly = true)
    public List<Attachment> findFiles(String refTable, Long refId) {
        return attachmentRepository.findByRefTableAndRefIdOrderByFileIdAsc(refTable, refId);
    }

    @Transactional
    public void deleteFilesOnlyDb(String refTable, Long refId) {
        attachmentRepository.deleteByRefTableAndRefId(refTable, refId);
    }

    @Transactional
    public void deleteFilesWithPhysicalFile(String refTable, Long refId) {
        List<Attachment> files = attachmentRepository.findByRefTableAndRefId(refTable, refId);
        String normalizedUploadDir = resolveUploadDir();

        for (Attachment attachment : files) {
            try {
                File physicalFile = new File(normalizedUploadDir, attachment.getSavedFileName());

                if (physicalFile.exists()) {
                    physicalFile.delete();
                }
            } catch (Exception ignored) {
            }
        }

        attachmentRepository.deleteByRefTableAndRefId(refTable, refId);
    }

    private void validateImageFile(MultipartFile file) {
        String contentType = file.getContentType();

        if (contentType == null || !contentType.startsWith("image/")) {
            throw new IllegalArgumentException("이미지 파일만 업로드할 수 있습니다.");
        }

        if (file.getSize() > maxFileSize) {
            throw new IllegalArgumentException("이미지는 1장당 10MB 이하로 업로드해 주세요.");
        }

        String orgFileName = StringUtils.cleanPath(file.getOriginalFilename());

        if (orgFileName == null || orgFileName.isBlank()) {
            return;
        }

        String extension = getExtension(orgFileName).toLowerCase();

        if (!ALLOWED_IMAGE_EXTENSIONS.contains(extension)) {
            throw new IllegalArgumentException("jpg, jpeg, png, gif, webp 형식의 이미지만 업로드할 수 있습니다.");
        }
    }

    private String getExtension(String fileName) {
        if (fileName == null || fileName.isBlank()) {
            return "";
        }

        int dotIndex = fileName.lastIndexOf(".");

        if (dotIndex < 0) {
            return "";
        }

        return fileName.substring(dotIndex);
    }

    private String resolveUploadDir() {
        if (uploadDir == null || uploadDir.isBlank()) {
            return "C:/upload/";
        }

        String normalized = uploadDir.replace("\\", "/");

        if (!normalized.endsWith("/")) {
            normalized += "/";
        }

        return normalized;
    }
}