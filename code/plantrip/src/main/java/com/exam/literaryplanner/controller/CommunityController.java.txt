package com.exam.literaryplanner.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.exam.literaryplanner.domain.Community;
import com.exam.literaryplanner.domain.Member;
import com.exam.literaryplanner.domain.Spot;
import com.exam.literaryplanner.repository.CommunityRepository;
import com.exam.literaryplanner.repository.ReviewPhotoRepository;
import com.exam.literaryplanner.repository.SpotRepository;
import com.exam.literaryplanner.service.ReviewPhotoService;
import com.exam.literaryplanner.service.SpotService;

import jakarta.servlet.http.HttpSession;

@Controller
@RequestMapping("/community")
public class CommunityController {

    private final CommunityRepository reviewRepository;
    private final ReviewPhotoRepository reviewPhotoRepository;
    private final ReviewPhotoService reviewPhotoService;
    private final SpotService spotService;
    private final SpotRepository spotRepository;

    public CommunityController(CommunityRepository reviewRepository,
                               ReviewPhotoRepository reviewPhotoRepository,
                               ReviewPhotoService reviewPhotoService,
                               SpotService spotService,
                               SpotRepository spotRepository) {
        this.reviewRepository = reviewRepository;
        this.reviewPhotoRepository = reviewPhotoRepository;
        this.reviewPhotoService = reviewPhotoService;
        this.spotService = spotService;
        this.spotRepository = spotRepository;
    }

    @GetMapping
    public String communityMain(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Integer minStar,
            @RequestParam(required = false) Integer sIdx,
            @RequestParam(required = false, defaultValue = "latest") String sort,
            Model model) {

        List<Community> reviews;

        if ("star".equals(sort)) {
            reviews = reviewRepository.searchOrderByStarDesc(keyword, minStar, sIdx);
        } else {
            reviews = reviewRepository.searchOrderByLatestDesc(keyword, minStar, sIdx);
        }

        model.addAttribute("reviews", reviews);
        model.addAttribute("keyword", keyword);
        model.addAttribute("minStar", minStar);
        model.addAttribute("sIdx", sIdx);
        model.addAttribute("sort", sort);

        return "community/community";
    }

    @GetMapping("/write")
    public String writeForm(@RequestParam(required = false) Integer sIdx,
                            HttpSession session,
                            Model model) {
        if (session.getAttribute("loginMember") == null) {
            return "redirect:/members/login";
        }

        model.addAttribute("spotList", spotRepository.findAll());

        if (sIdx != null) {
            try {
                Spot spot = spotService.findById(sIdx);
                model.addAttribute("selectedSpot", spot);
            } catch (Exception ignored) {}
            model.addAttribute("selectedSpotId", sIdx);
        }

        return "community/write";
    }

    @PostMapping("/write")
    public String writeReview(
            @RequestParam(required = false) Integer sIdx,
            // ✅ [수정/추가된 부분] 임시 파라미터가 아닌 실제 별점 파라미터로 세팅 (기본값 5점)
            @RequestParam(required = false, defaultValue = "5") Integer rvStar,   
            @RequestParam String rvCont,
            @RequestParam String rvTitle,
            @RequestParam(value = "photos", required = false) MultipartFile[] photos,
            HttpSession session,
            RedirectAttributes ra) {

        Member loginMember = (Member) session.getAttribute("loginMember");
        if (loginMember == null) {
            ra.addFlashAttribute("msg", "로그인이 필요합니다.");
            return "redirect:/members/login";
        }

        if (sIdx == null) {
            ra.addFlashAttribute("msg", "장소를 선택해 주세요.");
            return "redirect:/community/write";
        }

        Spot spot = spotRepository.findById(sIdx).orElse(null);
        if (spot == null) {
            ra.addFlashAttribute("msg", "선택한 장소 정보를 찾을 수 없습니다.");
            return "redirect:/community/write";
        }

        Community review = new Community();
        review.setMIdx(loginMember.getMIdx());
        review.setSIdx(sIdx);
        review.setMember(loginMember);
        review.setSpot(spot);

        review.setRvTitle(rvTitle);
        // ✅ [수정/추가된 부분] 가져온 별점 파라미터를 Entity에 실제로 저장
        review.setRvStar(rvStar); 

        if (rvCont != null) {
            final int MAX_CONT_LEN = 5000;
            if (rvCont.length() > MAX_CONT_LEN) {
                rvCont = rvCont.substring(0, MAX_CONT_LEN);
            }
        }
        review.setRvCont(rvCont);
        review.setRvRegion(extractRegion(spot));
        review.setRvVCount(0);
        review.setRvRegDate(LocalDateTime.now());
        review.setRvUpdate(null);

        Community savedReview;
        try {
            savedReview = reviewRepository.save(review);
        } catch (DataIntegrityViolationException e) {
            ra.addFlashAttribute("msg", "후기 내용이 너무 길어서 저장에 실패했습니다.");
            return "redirect:/community/write";
        }

        // ✅ 사진 업로드 시 파일명을 구분자(|)로 c_img 컬럼에 정상 저장합니다.
        try {
            Integer rvIdx = (savedReview != null ? savedReview.getRvIdx() : null);
            if (rvIdx != null && photos != null && photos.length > 0) {
                reviewPhotoService.saveMany(rvIdx, photos);

                try {
                    var savedPhotos = reviewPhotoRepository.findByRvIdxOrderByRpIdxAsc(rvIdx);
                    if (savedPhotos != null && !savedPhotos.isEmpty()) {
                        String joined = savedPhotos.stream()
                                .map(p -> p.getRpStoredName())
                                .filter(n -> n != null && !n.isBlank())
                                .distinct()
                                .reduce((a,b) -> a + "|" + b)
                                .orElse(null);
                        if (joined != null && !joined.isBlank()) {
                            savedReview.setRvImg(joined);
                            reviewRepository.save(savedReview);
                        }
                    }
                } catch (Exception ignored) {}
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        ra.addFlashAttribute("msg", "후기가 등록되었습니다.");
        return "redirect:/community";
    }

    @GetMapping("/my-reviews")
    public String myReviews(HttpSession session, Model model) {
        Member loginMember = (Member) session.getAttribute("loginMember");
        if (loginMember == null) {
            return "redirect:/members/login";
        }

        List<Community> myReviews = reviewRepository.findByMIdxOrderByRvIdxDesc(loginMember.getMIdx());
        model.addAttribute("myReviews", myReviews);
        return "community/myReview";
    }

    @PostMapping("/delete")
    public String delete(@RequestParam Integer rvIdx,
                         HttpSession session,
                         RedirectAttributes ra) {

        Member loginMember = (Member) session.getAttribute("loginMember");
        if (loginMember == null) {
            return "redirect:/members/login";
        }

        Community review = reviewRepository.findById(rvIdx).orElse(null);
        if (review == null) {
            return "redirect:/community/my-reviews";
        }

        if (!review.getMIdx().equals(loginMember.getMIdx())) {
            ra.addFlashAttribute("msg", "삭제 권한이 없습니다.");
            return "redirect:/community/my-reviews";
        }

        try {
            reviewPhotoRepository.deleteByRvIdx(rvIdx);
        } catch (Exception ignored) {}

        reviewRepository.deleteById(rvIdx);
        ra.addFlashAttribute("msg", "후기가 삭제되었습니다.");
        return "redirect:/community/my-reviews";
    }

    @GetMapping("/edit")
    public String editForm(@RequestParam Integer rvIdx, Model model, HttpSession session) {

        Member loginMember = (Member) session.getAttribute("loginMember");
        if (loginMember == null) {
            return "redirect:/members/login";
        }

        Community review = reviewRepository.findById(rvIdx).orElse(null);
        if ((review == null) || !review.getMIdx().equals(loginMember.getMIdx())) {
            return "redirect:/community/my-reviews";
        }

        model.addAttribute("review", review);
        model.addAttribute("photos", reviewPhotoRepository.findByRvIdxOrderByRpIdxAsc(rvIdx));

        return "community/editReview";
    }

    @PostMapping("/edit")
    public String editReview(@RequestParam Integer rvIdx,
                             @RequestParam String rvTitle,
                             @RequestParam String rvCont,
                             @RequestParam int rvStar,
                             @RequestParam(required = false) String from,
                             HttpSession session) {

        Member loginMember = (Member) session.getAttribute("loginMember");
        if (loginMember == null) {
            return "redirect:/members/login";
        }

        Community review = reviewRepository.findById(rvIdx).orElse(null);
        if (review == null || !review.getMIdx().equals(loginMember.getMIdx())) {
            return "redirect:/community/my-reviews";
        }

        review.setRvTitle(rvTitle);
        review.setRvCont(rvCont);
        review.setRvStar(rvStar);
        reviewRepository.save(review);

        if ("mypage".equals(from)) {
            return "redirect:/community/my-reviews";
        }

        return "redirect:/community/view?rvIdx=" + rvIdx;
    }

    @GetMapping("/view")
    public String view(@RequestParam Integer rvIdx, Model model) {

		Community review = reviewRepository.findDetail(rvIdx).orElse(null);
		if (review == null) {
            return "redirect:/community";
        }
		try {
			int current = (review.getRvVCount() == null) ? 0 : review.getRvVCount();
			reviewRepository.incrementViewCount(rvIdx);
			review.setRvVCount(current + 1); 
		} catch (Exception ignored) {}

        model.addAttribute("review", review);
        model.addAttribute("photos", reviewPhotoRepository.findByRvIdxOrderByRpIdxAsc(rvIdx));

        return "community/view";
    }

    private String extractRegion(Spot spot) {
        if (spot == null) {
			return null;
		}

        String addr = null;
        try {
            addr = spot.getAddr(); 
        } catch (Exception ignored) {}

        if (addr != null) {
            addr = addr.trim();
            if (!addr.isBlank()) {
                String[] tokens = addr.split("\\s+");
                if (tokens.length > 0 && !tokens[0].isBlank()) {
                    return tokens[0].trim();
                }
            }
        }

        try {
            if (spot.getCity() != null && spot.getCity().getName() != null) {
                String cityName = spot.getCity().getName().trim();
                if (!cityName.isBlank()) {
					return cityName;
				}
            }
        } catch (Exception ignored) {}

        return null;
    }
}