package com.exam.literaryplanner.controller;

import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes; // ✅ 필수 추가

import com.exam.literaryplanner.domain.Community;
import com.exam.literaryplanner.domain.Member;
import com.exam.literaryplanner.domain.Spot;
import com.exam.literaryplanner.domain.TravelPlan;
import com.exam.literaryplanner.repository.CityRepository;
import com.exam.literaryplanner.repository.CommunityRepository;
import com.exam.literaryplanner.repository.LiteraryRepository;
import com.exam.literaryplanner.repository.PlanDetailRepository;
import com.exam.literaryplanner.repository.SpotRepository;
import com.exam.literaryplanner.repository.TravelPlanRepository;
import com.exam.literaryplanner.service.MemberDeleteService;
import com.exam.literaryplanner.service.PlanMapService;
import com.exam.literaryplanner.service.SpotService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

@Controller
@RequestMapping("/members/mypage")
public class MyPageController {

    private final PasswordEncoder passwordEncoder;
    private final LiteraryRepository literaryRepository;
    private final CommunityRepository reviewRepository;
    private final MemberDeleteService memberDeleteService;
    private final TravelPlanRepository travelPlanRepository;
    private final PlanDetailRepository planDetailRepository;
    private final PlanMapService planMapService;
    private final SpotRepository spotRepository;
    private final CityRepository cityRepository;
    private final SpotService spotService;

    public MyPageController(LiteraryRepository literaryRepository,
                            CommunityRepository reviewRepository,
                            PasswordEncoder passwordEncoder,
                            MemberDeleteService memberDeleteService,
                            TravelPlanRepository travelPlanRepository,
                            PlanDetailRepository planDetailRepository,
                            PlanMapService planMapService,
                            SpotRepository spotRepository,
                            CityRepository cityRepository,
                            SpotService spotService) {
        this.literaryRepository = literaryRepository;
        this.reviewRepository = reviewRepository;
        this.passwordEncoder = passwordEncoder;
        this.memberDeleteService = memberDeleteService;
        this.travelPlanRepository = travelPlanRepository;
        this.planDetailRepository = planDetailRepository;
        this.planMapService = planMapService;
        this.spotRepository = spotRepository;
        this.cityRepository = cityRepository;
        this.spotService = spotService;
    }

    /* ================= 마이페이지 메인 ================= */
    @GetMapping
    public String mypage(HttpSession session, Model model) {
        Member loginMember = (Member) session.getAttribute("loginMember");
        if (loginMember == null) {
            return "redirect:/members/login";
        }
        List<Spot> recentWishList = spotService.getRecentWishSpots(loginMember.getMIdx());
        model.addAttribute("recentWishList", recentWishList);
        return "members/mypage/mypage";
    }

    /* ================= 내가 찜한 장소 (전체보기) ================= */
    @GetMapping("/wishlist")
    public String myWishList(HttpSession session, Model model) {
        Member loginMember = (Member) session.getAttribute("loginMember");
        if (loginMember == null) {
            return "redirect:/members/login";
        }
        List<Spot> allWishList = spotService.getWishSpots(loginMember.getMIdx());
        model.addAttribute("allWishList", allWishList);
        return "members/mypage/wishlist";
    }

    /* ================= 비밀번호 확인 ================= */
    @GetMapping("/check")
    public String checkForm(HttpSession session) {
        if (session.getAttribute("loginMember") == null) {
            return "redirect:/members/login";
        }
        return "members/mypage/check";
    }

    @PostMapping("/check")
    public String checkPassword(@RequestParam String password,
                                HttpSession session,
                                Model model) {
        Member loginMember = (Member) session.getAttribute("loginMember");
        if (loginMember == null) return "redirect:/members/login";

        Member member = literaryRepository.findById(loginMember.getMIdx()).orElseThrow();
        if (!passwordEncoder.matches(password, member.getMPw())) {
            model.addAttribute("error", "비밀번호가 일치하지 않습니다.");
            return "members/mypage/check";
        }
        session.setAttribute("authEdit", true);
        return "redirect:/members/mypage/edit";
    }

    /* ================= 회원정보 수정 (수정 완료 알림 추가) ================= */
    @GetMapping("/edit")
    public String editForm(HttpSession session, Model model) {
        Member loginMember = (Member) session.getAttribute("loginMember");
        Boolean authEdit = (Boolean) session.getAttribute("authEdit");
        if (loginMember == null || authEdit == null || !authEdit) {
            return "redirect:/members/mypage";
        }
        Member member = literaryRepository.findById(loginMember.getMIdx()).orElseThrow();
        model.addAttribute("member", member);
        return "members/mypage/edit";
    }

    @PostMapping("/edit")
    public String editMember(@RequestParam String mName,
                             @RequestParam String mEmail,
                             @RequestParam(required = false) String mPw,
                             @RequestParam(required = false) String mPwConfirm,
                             HttpSession session,
                             RedirectAttributes ra, // ✅ 필수: 파라미터에 추가됨
                             Model model) {

        Member loginMember = (Member) session.getAttribute("loginMember");
        Boolean authEdit = (Boolean) session.getAttribute("authEdit");

        if (loginMember == null || authEdit == null || !authEdit) {
            return "redirect:/members/login";
        }

        Member member = literaryRepository.findById(loginMember.getMIdx()).orElseThrow();
        member.setMName(mName);
        member.setMEmail(mEmail);

        // 비번 변경 요청 시 검증 로직
        if (mPw != null && !mPw.isBlank()) {
            if (mPwConfirm == null || !mPw.equals(mPwConfirm)) {
                model.addAttribute("member", member);
                model.addAttribute("error", "새 비밀번호가 일치하지 않습니다.");
                return "members/mypage/edit"; // 에러 시 수정 페이지 유지
            }
            member.setMPw(passwordEncoder.encode(mPw));
        }

        // DB 저장
        literaryRepository.save(member);

        // 세션 갱신 및 권한 삭제
        session.setAttribute("loginMember", member);
        session.removeAttribute("authEdit");
        
        // ✅ 성공 시: 대시보드로 이동하며 메시지 전달
        ra.addFlashAttribute("msg", "회원 정보 수정 완료"); 
        return "redirect:/members/mypage";
    }

    /* ================= 나의 일정 ================= */
    @GetMapping("/plans")
    public String myPlans(HttpSession session, Model model) {
        Member loginMember = (Member) session.getAttribute("loginMember");
        if (loginMember == null) return "redirect:/members/login";

        List<TravelPlan> list = travelPlanRepository.findMyPlans(loginMember.getMIdx());
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        List<Map<String, Object>> plans = new ArrayList<>();
        for (int i = 0; i < list.size(); i++) {
            TravelPlan p = list.get(i);
            plans.add(Map.of(
                    "no", i + 1,
                    "pIdx", p.getPIdx(),
                    "title", p.getPTitle(),
                    "regDate", (p.getPRegDate() == null ? "" : p.getPRegDate().format(fmt))
            ));
        }
        model.addAttribute("plans", plans);
        return "members/mypage/plans";
    }

    /* ================= 내가 쓴 후기 ================= */
    @GetMapping("/reviews")
    public String myReviews(@RequestParam(required = false) String keyword,
                            HttpSession session,
                            Model model) {
        Member loginMember = (Member) session.getAttribute("loginMember");
        if (loginMember == null) return "redirect:/members/login";

        List<Community> reviews;
        if (keyword != null && !keyword.isBlank()) {
            reviews = reviewRepository.findByMIdxAndRvTitleContainingOrderByRvIdxDesc(loginMember.getMIdx(), keyword.trim());
        } else {
            reviews = reviewRepository.findByMIdxOrderByRvIdxDesc(loginMember.getMIdx());
        }
        model.addAttribute("myReviews", reviews);
        model.addAttribute("reviews", reviews);
        model.addAttribute("keyword", keyword);
        return "community/myReview";
    }

    /* ================= 회원 탈퇴 =================
       - 버튼 클릭 → confirm(프론트) → POST /withdraw
       - fetch 요청(X-Requested-With: fetch)일 때는 JSON 응답
       - 일반 요청(주소 직접 접근 등)일 때는 redirect fallback
     */
    @GetMapping("/withdraw")
    public String withdrawGet() {
        // 링크로 직접 접근 시에는 마이페이지로 돌려보냄 (탈퇴는 POST로만)
        return "redirect:/members/mypage";
    }

    @PostMapping("/withdraw")
    public ResponseEntity<Map<String, Object>> withdraw(HttpSession session, HttpServletRequest request) {
        // 프론트(fetch) 여부와 무관하게 POST는 JSON으로 응답한다.
        // (브라우저가 헤더를 누락/변형해도 성공 흐름이 깨지지 않도록)
        final String xrw = request.getHeader("X-Requested-With");
        @SuppressWarnings("unused")
        final boolean isAjax = (xrw != null && !xrw.isBlank());

        Member loginMember = (Member) session.getAttribute("loginMember");
        if (loginMember == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("ok", false, "message", "로그인이 필요합니다."));
        }

        try {
            // ✅ 연관 데이터 포함 안전 삭제
            memberDeleteService.deleteMemberAll(loginMember.getMIdx());
            session.invalidate();

            return ResponseEntity.ok(Map.of("ok", true));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("ok", false, "message", "회원 탈퇴 처리 중 오류가 발생했습니다."));
        }
    }

    @GetMapping("/plans/view")
    public String planView(@RequestParam Integer pIdx, HttpSession session, Model model) {
        Member loginMember = (Member) session.getAttribute("loginMember");
        if (loginMember == null) return "redirect:/members/login";

        var plan = travelPlanRepository.findMyPlanView(pIdx, loginMember.getMIdx()).orElseThrow();
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        model.addAttribute("plan", plan);
        model.addAttribute("regDateStr", plan.getpRegDate() == null ? "" : plan.getpRegDate().format(fmt));
        model.addAttribute("pointsJson", planMapService.buildPointsJson(pIdx));
        model.addAttribute("spotNamesByDay", planMapService.getSpotNamesByDay(pIdx));
        model.addAttribute("staysJson", planMapService.buildStaysJson(pIdx));
        model.addAttribute("stayNamesByDay", planMapService.getStayNamesByDay(pIdx));
        return "members/mypage/planView";
    }

    @GetMapping("/plans/delete")
    public String planDelete(@RequestParam Integer pIdx, HttpSession session) {
        Member loginMember = (Member) session.getAttribute("loginMember");
        if (loginMember == null) return "redirect:/members/login";
        travelPlanRepository.deleteMyPlan(pIdx, loginMember.getMIdx());
        return "redirect:/members/mypage/plans";
    }

    @GetMapping("/route")
    public String routePage(@RequestParam Integer pIdx, @RequestParam(required = false) Integer cityId, @RequestParam(required = false) List<String> purpose, Model model) {
        model.addAttribute("pIdx", pIdx);
        model.addAttribute("savedDetails", planDetailRepository.findByPIdxOrderByPDayAscPSeqAsc(pIdx));
        List<Spot> spots = List.of();
        if (cityId != null && purpose != null && !purpose.isEmpty()) {
            spots = spotRepository.findByCity_IdAndCatCodeInOrderByNameAsc(cityId, purpose);
        }
        model.addAttribute("cityId", cityId);
        model.addAttribute("purpose", purpose);
        model.addAttribute("spots", spots);
        return "plans/route";
    }
}