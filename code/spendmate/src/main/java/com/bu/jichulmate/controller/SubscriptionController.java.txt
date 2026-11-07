package com.bu.jichulmate.controller;

import com.bu.jichulmate.domain.Account;
import com.bu.jichulmate.dto.subscription.SubscriptionCreateRequest;
import com.bu.jichulmate.dto.subscription.SubscriptionResponse;
import com.bu.jichulmate.service.AccountService;
import com.bu.jichulmate.service.SubscriptionService;
import com.bu.jichulmate.util.SessionUtils;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Controller
@RequiredArgsConstructor
@RequestMapping("/subscription")
public class SubscriptionController {

    private final SubscriptionService subscriptionService;
    private final AccountService accountService;

    @GetMapping("/mypage")
    public String mypageDashboard(
            HttpSession session,
            Model model
    ) {
        Long userId = SessionUtils.getLoginUserId(session);

        if (userId == null) {
            return "redirect:/";
        }

        List<SubscriptionResponse> top3Subs;

        try {
            top3Subs = subscriptionService.getTop3Subscriptions(userId);
        } catch (Exception e) {
            e.printStackTrace();
            top3Subs = new ArrayList<>();
        }

        model.addAttribute("top3Subscriptions", top3Subs);

        return "members/mypage/mypage";
    }

    @GetMapping("/ott")
    public String ottPage(
            HttpSession session,
            Model model
    ) {
        Long userId = SessionUtils.getLoginUserId(session);

        Account primaryAccount = null;

        if (userId != null) {
            List<Account> accounts = accountService.getAccountsByUser(userId);
            primaryAccount = getPrimaryAccount(accounts);
        }

        model.addAttribute("primaryAccount", primaryAccount);
        model.addAttribute("hasPaymentAccount", primaryAccount != null);

        return "subscription/ott";
    }

    @GetMapping("/buy")
    public String buyPage() {
        return "subscription/buy";
    }

    @PostMapping("/ott")
    public String create(
            SubscriptionCreateRequest request,
            HttpSession session,
            RedirectAttributes redirectAttributes
    ) {
        Long userId = SessionUtils.getLoginUserId(session);

        if (userId == null) {
            redirectAttributes.addFlashAttribute("errorMessage", "로그인이 필요합니다.");
            return "redirect:/subscription/ott";
        }

        try {
            subscriptionService.createSubscription(userId, request);
            return "redirect:/subscription/paymentSuccess";
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("errorMessage", e.getMessage());
            return "redirect:/subscription/ott";
        }
    }

    @GetMapping("/my")
    public String mySubscriptions(
            HttpSession session,
            Model model
    ) {
        Long userId = SessionUtils.getLoginUserId(session);

        if (userId == null) {
            return "redirect:/";
        }

        List<SubscriptionResponse> subs;

        try {
            subs = subscriptionService.getMySubscriptions(userId);
        } catch (Exception e) {
            e.printStackTrace();
            subs = new ArrayList<>();
        }

        model.addAttribute("subscriptions", subs);
        model.addAttribute("today", LocalDate.now());

        return "members/mypage/mysub";
    }

    @PostMapping("/cancel/{id}")
    public String cancel(
            @PathVariable Long id,
            HttpSession session,
            RedirectAttributes redirectAttributes
    ) {
        Long userId = SessionUtils.getLoginUserId(session);

        if (userId == null) {
            return "redirect:/";
        }

        try {
            subscriptionService.cancelSubscription(id);
            redirectAttributes.addFlashAttribute("successMessage", "구독이 해지되었습니다.");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("errorMessage", e.getMessage());
        }

        return "redirect:/subscription/my";
    }

    @GetMapping("/paymentSuccess")
    public String paymentSuccess() {
        return "subscription/paymentSuccess";
    }

    private Account getPrimaryAccount(List<Account> accounts) {
        if (accounts == null || accounts.isEmpty()) {
            return null;
        }

        return accounts.stream()
                .filter(account -> "Y".equals(account.getIsPrimary()))
                .findFirst()
                .orElse(accounts.get(0));
    }
}