package com.bu.jichulmate.service;

import com.bu.jichulmate.domain.*;
import com.bu.jichulmate.dto.mypage.*;
import com.bu.jichulmate.dto.user.UserUpdateRequest;
import com.bu.jichulmate.exception.*;
import com.bu.jichulmate.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import java.util.HashMap;
import java.util.Map;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MyPageService {

    private final UserRepository userRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final GoalRepository goalRepository;
    private final AccountRepository accountRepository;
    private final BoardRepository boardRepository;
    private final InquiryRepository inquiryRepository;
    private final NotificationLogRepository notificationLogRepository;
    private final PartyRepository partyRepository;
    private final PartySellerRepository partySellerRepository;
    private final PasswordEncoder passwordEncoder;
    private final ExpenseRepository expenseRepository;

    public MyPageSummaryResponse getMyPageSummary(Long userId) {
        User user = getUser(userId);

        List<Subscription> activeSubscriptions =
                subscriptionRepository.findByUserAndStatus(user, "ACTIVE");

        SavingGoal currentGoal =
                goalRepository.findTopByUserUserIdOrderByIdDesc(userId).orElse(null);

        Account primaryAccount =
                accountRepository.findByUserAndIsPrimary(user, "Y").orElse(null);

        boolean isSeller =
                !partySellerRepository.findByUserId(userId).isEmpty();

        long unreadNotiCount =
                notificationLogRepository.countByUserAndIsSuccess(user, "N");

        List<MyPageSummaryResponse.GoalSummary> goalList = new ArrayList<>();

        Map<Long, Long> goalTotals = new HashMap<>();
        List<Object[]> savingDataRaw = expenseRepository.getMonthlySavingsGroupedByGoal(userId);

        for (Object[] row : savingDataRaw) {
            Long goalId = ((Number) row[0]).longValue();
            Long amount = ((Number) row[2]).longValue();

            goalTotals.put(goalId, goalTotals.getOrDefault(goalId, 0L) + amount);
        }

        if (currentGoal != null) {
            long savedAmount = goalTotals.getOrDefault(currentGoal.getId(), 0L);

            int rate = 0;
            if (currentGoal.getTargetAmount() > 0) {
                rate = (int) Math.round((double) savedAmount / currentGoal.getTargetAmount() * 100);

                if (rate > 100) {
                    rate = 100;
                }
            }

            goalList.add(MyPageSummaryResponse.GoalSummary.builder()
                    .goalId(currentGoal.getId())
                    .goalName(currentGoal.getGoalName())
                    .targetAmount(currentGoal.getTargetAmount())
                    .savedAmount(savedAmount)
                    .achievementRate(rate)
                    .build());
        }

        return MyPageSummaryResponse.builder()
                .userId(user.getUserId())
                .loginId(user.getLoginId())
                .email(user.getLoginId())
                .nickname(user.getNickname())
                .gender(user.getGender())
                .birthDate(user.getBirthDate())
                .role(user.getRole())
                .sellerRegistered(isSeller)
                .emailNotify(isNotificationEnabled(user))
                .activeSubscriptionCount(activeSubscriptions.size())
                .unreadNotificationCount((int) unreadNotiCount)
                .goals(goalList)
                .primaryBankName(primaryAccount != null ? primaryAccount.getBankName() : null)
                .primaryAccountNumber(primaryAccount != null ? primaryAccount.getAccountNumber() : null)
                .build();
    }

    public User getUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException(ErrorCode.USER_NOT_FOUND));
    }

    // MyPageService.java
    public Page<Subscription> getMySubscriptionList(Long userId, Pageable pageable) {
        User user = getUser(userId);

        return subscriptionRepository.findByUserOrderByCreatedAtDesc(user, pageable);
    }

    public Page<Account> getAccountList(Long userId, Pageable pageable) {
        User user = getUser(userId);

        List<Account> accounts =
                accountRepository.findByUserOrderByIsPrimaryDescCreatedAtDesc(user);

        return new PageImpl<>(accounts, pageable, accounts.size());
    }

    // ★ 수정된 부분: isDeleted 관련 로직("N" 전달 부분) 완전 제거
    public Page<Board> getMyBoardList(Long userId, Pageable pageable) {
        getUser(userId);

        return boardRepository.findByUserIdOrderByCreatedAtDesc(
                userId,
                pageable
        );
    }

    public Page<PartyPost> getMyPartyList(Long userId, Pageable pageable) {
        return partyRepository.findBySellerUserIdOrderByCreatedAtDesc(userId, pageable);
    }

    public PartyPost getPartyDetail(Long userId, Long pId) {
        PartyPost post = partyRepository.findById(pId)
                .orElseThrow(() -> new NotFoundException(ErrorCode.PARTY_NOT_FOUND));

        if (!post.getSeller().getUserId().equals(userId)) {
            throw new UnauthorizedException(ErrorCode.ACCESS_DENIED);
        }

        return post;
    }

    @Transactional
    public void completePartyTrade(Long userId, Long pId) {
        PartyPost post = partyRepository.findById(pId)
                .orElseThrow(() -> new NotFoundException(ErrorCode.PARTY_NOT_FOUND));

        if (!post.getSeller().getUserId().equals(userId)) {
            throw new UnauthorizedException(ErrorCode.ACCESS_DENIED);
        }

        post.setStatus("FULL");
        partyRepository.save(post);
    }

    @Transactional
    public void withdrawUser(Long userId, String password) {
        User user = getUser(userId);

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new ValidationException(ErrorCode.PASSWORD_MISMATCH);
        }

        user.setAccountStatus("WITHDRAWN");
        userRepository.save(user);
    }

    @Transactional
    public void updateProfile(Long userId, UserUpdateRequest request) {
        User user = getUser(userId);

        user.setNickname(request.getNickname());
        user.setLoginId(request.getLoginId());
        user.setGender(request.getGender());
        user.setBirthDate(request.getBirthDate());

        String mentorTone = request.getMentorTone();

        if (mentorTone == null || mentorTone.isBlank()) {
            mentorTone = "MILD";
        }

        mentorTone = mentorTone.toUpperCase();

        if (!mentorTone.equals("MILD")
                && !mentorTone.equals("MEDIUM")
                && !mentorTone.equals("HOT")) {
            mentorTone = "MILD";
        }

        user.setMentorTone(mentorTone);

        userRepository.save(user);
    }

    @Transactional
    public String updateProfileImage(Long userId, MultipartFile file) throws IOException {
        return "/display?fileName=" + file.getOriginalFilename();
    }

    private boolean isNotificationEnabled(User user) {
        return "Y".equalsIgnoreCase(user.getIsNotiEnabled());
    }
}