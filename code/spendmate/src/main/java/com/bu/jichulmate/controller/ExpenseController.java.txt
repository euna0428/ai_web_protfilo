package com.bu.jichulmate.controller;

import com.bu.jichulmate.domain.Category;
import com.bu.jichulmate.domain.Expense;
import com.bu.jichulmate.domain.SavingGoal;
import com.bu.jichulmate.repository.CategoryRepository;
import com.bu.jichulmate.repository.ExpenseRepository;
import com.bu.jichulmate.repository.GoalRepository;
import jakarta.servlet.http.HttpSession;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@Controller
@RequiredArgsConstructor
public class ExpenseController {

    private final ExpenseRepository expenseRepository;
    private final CategoryRepository categoryRepository;
    private final GoalRepository goalRepository; // ★ 추가: 목표 데이터를 찾기 위해 주입

    @GetMapping("/expense/input")
    public String showExpenseForm() {
        return "expense/form";
    }

    @PostMapping("/api/v1/expenses")
    @ResponseBody
    public ResponseEntity<String> saveExpense(@RequestBody ExpenseRequestDto dto,
                                              HttpSession session) {

        Long userId = (Long) session.getAttribute("loginUserId");

        if (userId == null) {
            return ResponseEntity.status(401).body("로그인이 필요합니다.");
        }

        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new IllegalArgumentException("해당 카테고리가 없습니다."));

        SavingGoal savingGoal = null;
        if (dto.getGoalId() != null) {
            savingGoal = goalRepository.findById(dto.getGoalId()).orElse(null);
        }

        Expense expense = Expense.builder()
                .userId(userId)
                .category(category)
                .amount(dto.getAmount())
                .expenseDate(dto.getExpenseDate())
                .isFixed(dto.getIsFixed())
                .savingGoal(savingGoal)
                .build();

        expenseRepository.save(expense);

        return ResponseEntity.ok("지출 내역 저장 성공!");
    }

    @Data
    static class ExpenseRequestDto {
        private Long userId;
        private Long categoryId;
        private Long amount;
        private LocalDate expenseDate;
        private String isFixed;
        private Long goalId;
    }

    @Data
    static class GoalRequestDto {
        private Long userId;
        private String itemName;
        private Long itemPrice;
    }

    @PutMapping("/api/v1/expenses/{id}")
    @ResponseBody
    public ResponseEntity<String> updateExpense(@PathVariable Long id, @RequestBody ExpenseRequestDto dto) {
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 지출 내역이 없습니다."));
        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new IllegalArgumentException("카테고리가 없습니다."));

        // ★ 추가: 수정할 때 목표가 바뀌었다면 다시 찾아옵니다.
        SavingGoal savingGoal = null;
        if (dto.getGoalId() != null) {
            savingGoal = goalRepository.findById(dto.getGoalId()).orElse(null);
        }

        // 엔티티 업데이트
        expense.updateExpense(category, dto.getAmount(), dto.getExpenseDate(), dto.getIsFixed(), savingGoal);
        expenseRepository.save(expense);

        return ResponseEntity.ok("지출 내역 수정 완료!");
    }

    @DeleteMapping("/api/v1/expenses/{id}")
    @ResponseBody
    public ResponseEntity<String> deleteExpense(@PathVariable Long id) {
        expenseRepository.deleteById(id);
        return ResponseEntity.ok("지출 내역 삭제 완료!");
    }
}