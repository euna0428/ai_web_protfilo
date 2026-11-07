package com.exam.literaryplanner.controller;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import com.exam.literaryplanner.domain.Community;
import com.exam.literaryplanner.domain.Member;
import com.exam.literaryplanner.domain.ReviewPhoto;
import com.exam.literaryplanner.repository.CommunityRepository;
import com.exam.literaryplanner.service.ReviewPhotoService;

import jakarta.servlet.http.HttpSession;

@Controller
@RequestMapping("/review-photos")
public class ReviewPhotoController {

    private final ReviewPhotoService reviewPhotoService;
    private final CommunityRepository reviewRepository;

    public ReviewPhotoController(ReviewPhotoService reviewPhotoService,
                                 CommunityRepository reviewRepository) {
        this.reviewPhotoService = reviewPhotoService;
        this.reviewRepository = reviewRepository;
    }
    
   

    @GetMapping("/list")
    @ResponseBody
    public List<ReviewPhoto> list(@RequestParam Integer rvIdx) {
        return reviewPhotoService.list(rvIdx);
    }

    @GetMapping({"/raw/{photoId}", "/file/{photoId}"})
    public ResponseEntity<Resource> file(@PathVariable("photoId") Integer photoId) {
    	System.out.println("현재 서버의 실행 위치(user.dir): " + System.getProperty("user.dir"));    
    	try {
            ReviewPhoto photo = reviewPhotoService.getPhoto(photoId);

            // ✅ Service와 동일하게 프로젝트 기준 경로 설정
            Path uploadRoot = Paths.get(System.getProperty("user.dir"), "uploads", "reviews");
            Path filePath = uploadRoot.resolve(photo.getRpStoredName());

            if (!Files.exists(filePath)) {
                return ResponseEntity.notFound().build();
            }

            Resource resource = new UrlResource(filePath.toUri());

            String contentType = photo.getRpContentType();
            if (contentType == null || contentType.isBlank()) {
                contentType = Files.probeContentType(filePath);
                if (contentType == null) {
					contentType = "application/octet-stream";
				}
            }

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CACHE_CONTROL, "no-cache, no-store, must-revalidate")
                    .body(resource);

        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/upload")
    public String upload(@RequestParam Integer rvIdx,
                         @RequestParam("photos") MultipartFile[] photos,
                         @RequestParam(required = false, defaultValue = "/community/view?rvIdx=") String redirectBase,
                         HttpSession session) throws Exception {

        Member loginMember = (Member) session.getAttribute("loginMember");
        if (loginMember == null) {
			return "redirect:/members/login";
		}

        Community review = reviewRepository.findById(rvIdx).orElse(null);
        if (review == null) {
			return "redirect:/community";
		}

        if (!review.getMIdx().equals(loginMember.getMIdx())) {
            return "redirect:" + redirectBase + rvIdx;
        }

        reviewPhotoService.saveAll(rvIdx, photos);
        return "redirect:" + redirectBase + rvIdx;
    }

    @GetMapping("/{rpIdx}")
    public ResponseEntity<Resource> serve(@PathVariable Integer rpIdx) {

        ReviewPhoto meta = reviewPhotoService.getMeta(rpIdx);
        Resource resource = reviewPhotoService.loadAsResource(rpIdx);

        try {
            if (resource == null || !resource.exists() || !resource.isReadable()) {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }

        MediaType mediaType = MediaType.APPLICATION_OCTET_STREAM;
        try {
            String ct = meta.getRpContentType();
            if (ct != null && !ct.isBlank()) {
                mediaType = MediaType.parseMediaType(ct);
            }
        } catch (Exception ignored) {
            mediaType = MediaType.APPLICATION_OCTET_STREAM;
        }

        return ResponseEntity.ok()
                .contentType(mediaType)
                .cacheControl(CacheControl.noCache())
                .body(resource);
    }

    @GetMapping("/name/{storedName:.+}")
    public ResponseEntity<Resource> serveByStoredName(@PathVariable String storedName) {
        try {
            // ✅ Service와 동일하게 프로젝트 기준 경로 설정
            Path root = Paths.get(System.getProperty("user.dir"), "uploads", "reviews");
            Path legacyRoot = Paths.get(System.getProperty("user.home"), "literaryplanner_uploads", "reviews");

            Path filePath = root.resolve(storedName);
            if (!Files.exists(filePath)) {
                filePath = legacyRoot.resolve(storedName);
            }
            if (!Files.exists(filePath)) {
                return ResponseEntity.notFound().build();
            }

            Resource resource = new UrlResource(filePath.toUri());
            String contentType = Files.probeContentType(filePath);
            if (contentType == null || contentType.isBlank()) {
                contentType = "application/octet-stream";
            }

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .cacheControl(CacheControl.noCache())
                    .body(resource);

        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/delete")
    public String delete(@RequestParam Integer rpIdx,
                         @RequestParam Integer rvIdx,
                         HttpSession session) {

        Member loginMember = (Member) session.getAttribute("loginMember");
        if (loginMember == null) {
			return "redirect:/members/login";
		}

        Community review = reviewRepository.findById(rvIdx).orElse(null);
        if (review == null) {
			return "redirect:/community";
		}

        if (!review.getMIdx().equals(loginMember.getMIdx())) {
            return "redirect:/community/view?rvIdx=" + rvIdx;
        }

        reviewPhotoService.delete(rpIdx);
        return "redirect:/community/view?rvIdx=" + rvIdx;
    }

    @PostMapping("/upload-multi")
    public String uploadMulti(@RequestParam Integer rvIdx,
                              @RequestParam("photos") MultipartFile[] photos,
                              HttpSession session) throws Exception {

        Member loginMember = (Member) session.getAttribute("loginMember");
        if (loginMember == null) {
			return "redirect:/members/login";
		}

        reviewPhotoService.saveMany(rvIdx, photos);
        return "redirect:/community/view?rvIdx=" + rvIdx;
    }
}