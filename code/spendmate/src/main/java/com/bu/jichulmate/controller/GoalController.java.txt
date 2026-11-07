package com.bu.jichulmate.controller;

import com.bu.jichulmate.domain.SavingGoal;
import com.bu.jichulmate.domain.User;
import com.bu.jichulmate.repository.GoalRepository;
import com.bu.jichulmate.repository.UserRepository;
import com.bu.jichulmate.service.SavingGoalService;
import lombok.RequiredArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpSession;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/goals")
public class GoalController {

    private final UserRepository userRepository;
    private final SavingGoalService savingGoalService;
    private final GoalRepository goalRepository; // ★ 기존 목표 수정을 위해 레포지토리 추가

    @Getter @Setter
    public static class GoalRequest {
        private Long userId;
        private String itemName;
        private Long itemPrice;
        private String isFixed;
    }

    // 1. 목표 생성
    @PostMapping
    public ResponseEntity<String> saveGoal(@RequestBody GoalRequest request,
                                           HttpSession session) {
        try {
            Long userId = (Long) session.getAttribute("loginUserId");

            if (userId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
            }

            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("유저를 찾을 수 없습니다."));

            String isFixed = (request.getIsFixed() != null) ? request.getIsFixed() : "N";

            savingGoalService.createGoal(
                    user,
                    request.getItemName(),
                    request.getItemPrice(),
                    isFixed
            );

            return ResponseEntity.ok("성공");

        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body("제한 초과: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("실패: " + e.getMessage());
        }
    }

    // ★ 2. 추가: 목표 수정 (Update)
    @PutMapping("/{goalId}")
    public ResponseEntity<String> updateGoal(@PathVariable Long goalId, @RequestBody GoalRequest request) {
        try {
            SavingGoal goal = goalRepository.findById(goalId)
                    .orElseThrow(() -> new RuntimeException("목표를 찾을 수 없습니다."));

            // 기존 목표의 이름과 가격을 새 값으로 덮어씁니다.
            goal.setGoalName(request.getItemName());
            goal.setTargetAmount(request.getItemPrice());
            goalRepository.save(goal);

            return ResponseEntity.ok("수정 성공");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("수정 실패: " + e.getMessage());
        }
    }

    // ★ 3. 추가: 목표 삭제 (Delete)
    @DeleteMapping("/{goalId}")
    public ResponseEntity<String> deleteGoal(@PathVariable Long goalId) {
        try {
            savingGoalService.deleteGoal(goalId); // 이미 만들어두신 서비스 로직 활용!
            return ResponseEntity.ok("삭제 성공");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("삭제 실패: " + e.getMessage());
        }
    }
}