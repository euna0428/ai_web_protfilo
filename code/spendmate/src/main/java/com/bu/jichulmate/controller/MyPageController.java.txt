package com.bu.jichulmate.controller;

import com.bu.jichulmate.domain.Attachment;
import com.bu.jichulmate.domain.Inquiry;
import com.bu.jichulmate.domain.SavingGoal;
import com.bu.jichulmate.domain.Subscription;
import com.bu.jichulmate.dto.mypage.AccountRegisterRequest;
import com.bu.jichulmate.dto.mypage.NotificationResponse;
import com.bu.jichulmate.dto.subscription.SubscriptionResponse;
import com.bu.jichulmate.dto.user.UserUpdateRequest;
import com.bu.jichulmate.exception.BusinessException;
import com.bu.jichulmate.repository.ExpenseRepository;
import com.bu.jichulmate.repository.GoalRepository;
import com.bu.jichulmate.repository.InquiryRepository;
import com.bu.jichulmate.repository.PartySellerRepository;
import com.bu.jichulmate.response.ApiResponse;
import com.bu.jichulmate.dto.party.PartyDetailResponse;
import com.bu.jichulmate.service.AccountService;
import com.bu.jichulmate.service.FileService;
import com.bu.jichulmate.service.MyPageService;
import com.bu.jichulmate.service.NotificationService;
import com.bu.jichulmate.service.PartyService;
import com.bu.jichulmate.service.SubscriptionService;
import com.bu.jichulmate.util.SessionUtils;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Controller
@RequestMapping("/mypage")
@RequiredArgsConstructor
public class MyPageController {

    private final MyPageService myPageService;
    private final AccountService accountService;
    private final SubscriptionService subscriptionService;
    private final GoalRepository goalRepository;
    private final InquiryRepository inquiryRepository;
    private final NotificationService notificationService;
    private final FileService fileService;
    private final ExpenseRepository expenseRepository;
    private final PartySellerRepository partySellerRepository;
    private final PartyService partyService;

    @GetMapping("/editprofile")
    public String editProfile(HttpSession session) {
        if (SessionUtils.getLoginUserId(session) == null) {
            return "redirect:/";
        }

        return "members/mypage/editprofile";
    }

    @GetMapping({"", "/", "/mypage"})
    public String myPage(
            HttpSession session,
            Model model
    ) {
        Long userId = SessionUtils.getLoginUserId(session);

        if (userId == null) {
            return "redirect:/";
        }

        model.addAttribute("summary", myPageService.getMyPageSummary(userId));
        model.addAttribute("accounts", accountService.getAccountsByUser(userId));

        Pageable pageable = Pageable.ofSize(5);
        Page<Subscription> subscriptionPage = myPageService.getMySubscriptionList(userId, pageable);
        model.addAttribute("subscriptions", subscriptionPage.getContent());

        List<SubscriptionResponse> top3 = subscriptionService.getTop3Subscriptions(userId);
        model.addAttribute("top3Subscriptions", top3);

        List<SavingGoal> allGoals = goalRepository.findByUserUserId(userId);

        List<Object[]> savingDataRaw = expenseRepository.getMonthlySavingsGroupedByGoal(userId);
        Map<Long, Long> goalTotals = new HashMap<>();

        for (Object[] row : savingDataRaw) {
            Long goalId = ((Number) row[0]).longValue();
            Long amount = ((Number) row[2]).longValue();

            goalTotals.put(goalId, goalTotals.getOrDefault(goalId, 0L) + amount);
        }

        model.addAttribute("goalTotals", goalTotals);

        SavingGoal fixedGoal = allGoals.stream()
                .filter(goal -> "Y".equals(goal.getIsFixed()))
                .max((g1, g2) -> g1.getId().compareTo(g2.getId()))
                .orElse(null);

        model.addAttribute("fixedGoal", fixedGoal);

        List<SavingGoal> normalGoals = allGoals.stream()
                .filter(goal -> "N".equals(goal.getIsFixed()))
                .sorted((g1, g2) -> g2.getId().compareTo(g1.getId()))
                .limit(2)
                .collect(Collectors.toList());

        model.addAttribute("normalGoals", normalGoals);

        List<Attachment> attachments = fileService.findFiles("USERS", userId);

        if (!attachments.isEmpty()) {
            String latestProfileImage = attachments.get(attachments.size() - 1).getFilePath();
            model.addAttribute("profileImageUrl", latestProfileImage);
        }

        return "members/mypage/mypage";
    }

    @PostMapping("/accounts")
    public String registerOrUpdateAccount(
            @Valid @ModelAttribute AccountRegisterRequest request,
            BindingResult bindingResult,
            @RequestParam(value = "mode", defaultValue = "register") String mode,
            @RequestParam(value = "accountId", required = false) Long accountId,
            HttpSession session,
            RedirectAttributes redirectAttributes
    ) {
        Long userId = SessionUtils.getLoginUserId(session);

        if (userId == null) {
            return "redirect:/";
        }

        if (bindingResult.hasErrors()) {
            redirectAttributes.addFlashAttribute(
                    "errorMessage",
                    bindingResult.getAllErrors().get(0).getDefaultMessage()
            );

            return "redirect:/mypage";
        }

        try {
            if ("edit".equals(mode) && accountId != null) {
                accountService.updateAccount(userId, accountId, request);
                redirectAttributes.addFlashAttribute("successMessage", "계좌가 성공적으로 수정되었습니다.");
            } else {
                accountService.registerAccount(userId, request);
                redirectAttributes.addFlashAttribute("successMessage", "계좌가 성공적으로 등록되었습니다.");
            }

            return "redirect:/mypage";

        } catch (BusinessException e) {
            redirectAttributes.addFlashAttribute("errorMessage", e.getMessage());
            return "redirect:/mypage";

        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("errorMessage", "계좌 처리 중 오류가 발생했습니다.");
            return "redirect:/mypage";
        }
    }

    @GetMapping("/accounts/new")
    public String newAccountForm(HttpSession session) {
        if (SessionUtils.getLoginUserId(session) == null) {
            return "redirect:/";
        }

        return "members/mypage/mybank";
    }

    @PostMapping("/profile/image")
    @ResponseBody
    public ResponseEntity<ApiResponse<String>> updateProfileImage(
            @RequestParam("profileImage") MultipartFile file,
            HttpSession session
    ) {
        Long userId = SessionUtils.getLoginUserId(session);

        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("로그인이 필요합니다."));
        }

        try {
            String imageUrl = myPageService.updateProfileImage(userId, file);
            return ResponseEntity.ok(ApiResponse.success(imageUrl));

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("프로필 이미지 업로드에 실패했습니다."));
        }
    }

    @GetMapping("/alarm")
    public String myAlarm(
            @PageableDefault(size = 10) Pageable pageable,
            HttpSession session,
            Model model
    ) {
        Long userId = SessionUtils.getLoginUserId(session);

        if (userId == null) {
            return "redirect:/";
        }

        Page<NotificationResponse> alarms = notificationService.getMyNotifications(userId, pageable);
        model.addAttribute("alarms", alarms);

        return "members/mypage/myalarm";
    }

    @GetMapping("/posts")
    public String myPosts(
            @PageableDefault(size = 10) Pageable pageable,
            HttpSession session,
            Model model
    ) {
        Long userId = SessionUtils.getLoginUserId(session);

        if (userId == null) {
            return "redirect:/";
        }

        model.addAttribute("boards", myPageService.getMyBoardList(userId, pageable));

        return "members/mypage/mypost";
    }

    @GetMapping("/questions")
    public String myQuestions(
            @RequestParam(required = false) String status,
            @PageableDefault(size = 10) Pageable pageable,
            HttpSession session,
            Model model
    ) {
        Long userId = SessionUtils.getLoginUserId(session);

        if (userId == null) {
            return "redirect:/";
        }

        Page<Inquiry> inquiries;

        if (status == null || "ALL".equals(status)) {
            inquiries = inquiryRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable);
        } else {
            inquiries = inquiryRepository.findByUserIdAndStatusOrderByCreatedAtDesc(userId, status, pageable);
        }

        model.addAttribute("inquiries", inquiries);
        model.addAttribute("currentStatus", status == null ? "ALL" : status);

        return "members/mypage/myque";
    }

    @PostMapping("/questions/delete/{id}")
    public String deleteInquiry(
            @PathVariable Long id,
            HttpSession session
    ) {
        Long userId = SessionUtils.getLoginUserId(session);

        if (userId == null) {
            return "redirect:/";
        }

        inquiryRepository.deleteById(id);

        return "redirect:/mypage/questions";
    }

    @GetMapping("/reports")
    public String myReports(HttpSession session) {
        if (SessionUtils.getLoginUserId(session) == null) {
            return "redirect:/";
        }

        return "members/mypage/myreport";
    }

    @GetMapping("/sales")
    public String mySales(
            @PageableDefault(size = 10) Pageable pageable, // ★ 추가
            HttpSession session,
            Model model
    ) {
        Long userId = SessionUtils.getLoginUserId(session);
        if (userId == null) return "redirect:/";

        boolean isSeller = !partySellerRepository.findByUserId(userId).isEmpty();

        // ★ 에러 해결: 변경된 서비스에 맞게 Page 객체로 받아옵니다.
        Page<PartyDetailResponse> salesPage = isSeller
                ? partyService.getPostsBySeller(userId, pageable)
                : new org.springframework.data.domain.PageImpl<>(java.util.List.of(), pageable, 0);

        model.addAttribute("isSeller", isSeller);
        model.addAttribute("salesPage", salesPage);
        model.addAttribute("salesList", salesPage.getContent());

        return "members/mypage/mysales";
    }

    @GetMapping("/sales/list")
    public String mySalesList(
            @PageableDefault(size = 10) Pageable pageable, // ★ 추가
            HttpSession session,
            Model model
    ) {
        Long userId = SessionUtils.getLoginUserId(session);
        if (userId == null) return "redirect:/";

        boolean isSeller = !partySellerRepository.findByUserId(userId).isEmpty();
        Page<PartyDetailResponse> salesPage = isSeller
                ? partyService.getPostsBySeller(userId, pageable)
                : new org.springframework.data.domain.PageImpl<>(java.util.List.of(), pageable, 0);

        model.addAttribute("isSeller", isSeller);
        model.addAttribute("salesPage", salesPage);
        model.addAttribute("salesList", salesPage.getContent());

        return "members/mypage/mysaleslist";
    }

    @GetMapping("/subscriptions")
    public String mySubscriptions(
            HttpSession session,
            Model model
    ) {
        Long userId = SessionUtils.getLoginUserId(session);

        if (userId == null) {
            return "redirect:/";
        }

        List<SubscriptionResponse> subscriptions = subscriptionService.getMySubscriptions(userId);

        model.addAttribute("subscriptions", subscriptions);
        model.addAttribute("today", LocalDate.now());

        return "members/mypage/mysub";
    }

    @GetMapping("/profile")
    public String profileUpdatePage(
            HttpSession session,
            Model model
    ) {
        Long userId = SessionUtils.getLoginUserId(session);

        if (userId == null) {
            return "redirect:/";
        }

        model.addAttribute("user", myPageService.getUser(userId));

        return "members/mypage/profile";
    }

    @PostMapping("/profile")
    @ResponseBody
    public ResponseEntity<ApiResponse<String>> updateProfile(
            @Valid @RequestBody UserUpdateRequest request,
            BindingResult bindingResult,
            HttpSession session
    ) {
        Long userId = SessionUtils.getLoginUserId(session);

        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("로그인이 필요합니다."));
        }

        if (bindingResult.hasErrors()) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(bindingResult.getAllErrors().get(0).getDefaultMessage()));
        }

        try {
            myPageService.updateProfile(userId, request);
            return ResponseEntity.ok(ApiResponse.success("프로필 정보가 수정되었습니다."));

        } catch (BusinessException e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/boards")
    public String myBoards(
            @PageableDefault(size = 10) Pageable pageable,
            HttpSession session,
            Model model
    ) {
        Long userId = SessionUtils.getLoginUserId(session);

        if (userId == null) {
            return "redirect:/";
        }

        model.addAttribute("boards", myPageService.getMyBoardList(userId, pageable));

        return "members/mypage/mypost";
    }

    @GetMapping("/parties")
    public String myParties(
            @PageableDefault(size = 10) Pageable pageable, // ★ 5에서 10으로 통일
            HttpSession session,
            Model model
    ) {
        Long userId = SessionUtils.getLoginUserId(session);
        if (userId == null) return "redirect:/";

        boolean isSeller = !partySellerRepository.findByUserId(userId).isEmpty();
        Page<PartyDetailResponse> salesPage = isSeller
                ? partyService.getPostsBySeller(userId, pageable)
                : new org.springframework.data.domain.PageImpl<>(java.util.List.of(), pageable, 0);

        model.addAttribute("parties", myPageService.getMyPartyList(userId, pageable));
        model.addAttribute("isSeller", isSeller);
        model.addAttribute("salesPage", salesPage);
        model.addAttribute("salesList", salesPage.getContent());

        return "members/mypage/mysaleslist";
    }

    @DeleteMapping("/sales/{partyId}")
    @ResponseBody
    public ResponseEntity<ApiResponse<String>> deleteMySale(
            @PathVariable Long partyId,
            HttpSession session
    ) {
        Long userId = SessionUtils.getLoginUserId(session);

        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("로그인이 필요합니다."));
        }

        try {
            partyService.deleteMyPost(userId, partyId);
            return ResponseEntity.ok(ApiResponse.success("판매글이 삭제되었습니다."));

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/withdraw")
    @ResponseBody
    public ResponseEntity<ApiResponse<String>> withdraw(
            @RequestParam String password,
            HttpSession session
    ) {
        Long userId = SessionUtils.getLoginUserId(session);

        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("로그인이 필요합니다."));
        }

        try {
            myPageService.withdrawUser(userId, password);
            session.invalidate();
            return ResponseEntity.ok(ApiResponse.success("회원 탈퇴가 완료되었습니다."));

        } catch (BusinessException e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/goals")
    public String myGoals(
            HttpSession session,
            Model model
    ) {
        Long userId = SessionUtils.getLoginUserId(session);

        if (userId == null) {
            return "redirect:/";
        }

        SavingGoal fixedGoal = goalRepository.findTopByUserUserIdOrderByIdDesc(userId)
                .filter(goal -> "Y".equals(goal.getIsFixed()))
                .orElse(null);

        List<SavingGoal> normalGoals = goalRepository.findByUserUserId(userId)
                .stream()
                .filter(goal -> "N".equals(goal.getIsFixed()))
                .collect(Collectors.toList());

        model.addAttribute("fixedGoal", fixedGoal);
        model.addAttribute("normalGoals", normalGoals);

        return "members/mypage/mygoals";
    }

    @GetMapping("/sales/register-identity")
    public String salesRegisterForm(HttpSession session) {
        if (SessionUtils.getLoginUserId(session) == null) {
            return "redirect:/";
        }

        return "party/seller-identity";
    }
}