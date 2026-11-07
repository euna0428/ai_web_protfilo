package com.exam.literaryplanner.service;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.exam.literaryplanner.domain.ReviewPhoto;
import com.exam.literaryplanner.repository.ReviewPhotoRepository;

@Service
public class ReviewPhotoService {

    private final ReviewPhotoRepository reviewPhotoRepository;

    // ✅ 팀원 간 사진 공유 및 폴더 에러 방지를 위해 프로젝트 내부 경로(user.dir)로 지정
    private final Path uploadRoot = Paths.get(
            System.getProperty("user.dir"),
            "uploads",
            "reviews"
    );
    
    // 과거 버전 호환 경로
    private final Path legacyUploadRoot = Paths.get(
            System.getProperty("user.home"),
            "literaryplanner_uploads",
            "reviews"
    );

    public ReviewPhotoService(ReviewPhotoRepository reviewPhotoRepository) {
        this.reviewPhotoRepository = reviewPhotoRepository;
    }

    public List<ReviewPhoto> list(Integer rvIdx) {
        return reviewPhotoRepository.findByRvIdxOrderByRpIdxAsc(rvIdx);
    }

    public ReviewPhoto save(Integer rvIdx, MultipartFile file) throws Exception {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("파일이 비어있습니다.");
        }

        String original = StringUtils.cleanPath(Objects.requireNonNull(file.getOriginalFilename()));
        String ext = "";
        int dot = original.lastIndexOf(".");
        if (dot > -1) {
			ext = original.substring(dot);
		}

        String stored = UUID.randomUUID() + ext;
        Path target = uploadRoot.resolve(stored);

        Files.createDirectories(target.getParent());
        file.transferTo(target.toFile());

        ReviewPhoto photo = new ReviewPhoto();
        photo.setRvIdx(rvIdx);
        photo.setRpOriginalName(original);
        photo.setRpStoredName(stored);
        photo.setRpContentType(file.getContentType());
        photo.setRpSize((int) file.getSize());

        return reviewPhotoRepository.save(photo);
    }

    public Resource loadAsResource(Integer rpIdx) {
        ReviewPhoto photo = reviewPhotoRepository.findById(rpIdx).orElseThrow();
        String stored = photo.getRpStoredName();

        File f = uploadRoot.resolve(stored).toFile();
        FileSystemResource res = new FileSystemResource(f);
        if (res.exists() && res.isReadable()) {
            return res;
        }

        File legacy = legacyUploadRoot.resolve(stored).toFile();
        FileSystemResource legacyRes = new FileSystemResource(legacy);
        if (legacyRes.exists() && legacyRes.isReadable()) {
            return legacyRes;
        }
        return null;
    }

    public ReviewPhoto getMeta(Integer rpIdx) {
        return reviewPhotoRepository.findById(rpIdx).orElseThrow();
    }

    public void delete(Integer rpIdx) {
        ReviewPhoto photo = reviewPhotoRepository.findById(rpIdx).orElseThrow();
        try {
            Path filePath = uploadRoot.resolve(photo.getRpStoredName());
            Files.deleteIfExists(filePath);
        } catch (Exception ignored) {}
        reviewPhotoRepository.deleteById(rpIdx);
    }

    public void saveAll(Integer rvIdx, MultipartFile[] files) throws Exception {
        if (files == null || files.length == 0) return;

        for (MultipartFile f : files) {
            if (f == null || f.isEmpty()) continue;
            
            //  [핵심 방어선 1] 실제 이미지 파일이 아니면 무조건 차단! (깨진 사진 원천 방지)
            String contentType = f.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                continue; 
            }
            
            save(rvIdx, f); 
        }
    }

    public void saveMany(Integer rvIdx, MultipartFile[] photos) throws Exception {
        if (photos == null) return;
        
        for (MultipartFile f : photos) {
            if (f == null || f.isEmpty()) continue;
            
            // 🚨 [핵심 방어선 2] 실제 이미지 파일이 아니면 무조건 차단!
            String contentType = f.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                continue; 
            }

            try {
                save(rvIdx, f);
            } catch (Exception ignored) {}
        }
    }

    public ReviewPhoto getPhoto(Integer rpIdx) {
        return reviewPhotoRepository.findById(rpIdx)
                .orElseThrow(() -> new IllegalArgumentException("사진이 없습니다. rpIdx=" + rpIdx));
    }
}