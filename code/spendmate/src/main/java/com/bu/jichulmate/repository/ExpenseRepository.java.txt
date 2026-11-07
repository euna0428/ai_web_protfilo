package com.bu.jichulmate.repository;

import com.bu.jichulmate.domain.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param; // 반드시 Spring Data의 Param을 써야 합니다!

import java.time.LocalDate;
import java.util.List;


public interface ExpenseRepository extends JpaRepository<Expense, Long> {


    @Query(value = "SELECT c.NAME as categoryName, NVL(SUM(e.AMOUNT), 0) as totalAmount " +
            "FROM CATEGORIES c " +
            "LEFT JOIN EXPENSES e ON c.CATEGORY_ID = e.CATEGORY_ID " +
            "AND e.USER_ID = :userId " +
            "AND TO_CHAR(e.EXPENSE_DATE, 'YYYY-MM') = :yearMonth " +
            "GROUP BY c.CATEGORY_ID, c.NAME " +
            "ORDER BY c.CATEGORY_ID", nativeQuery = true)
    List<Object[]> getMonthlyCategoryStats(@Param("userId") Long userId, @Param("yearMonth") String yearMonth);

    // 월별 지출 목록 조회
    @Query("SELECT e FROM Expense e JOIN FETCH e.category WHERE e.userId = :userId AND e.expenseDate BETWEEN :startDate AND :endDate ORDER BY e.expenseDate DESC")
    List<Expense> findMonthlyExpenses(@Param("userId") Long userId, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    // 카테고리별 월간 지출 합계
    @Query("SELECT e.category.name, SUM(e.amount) FROM Expense e WHERE e.userId = :userId AND e.expenseDate BETWEEN :startDate AND :endDate GROUP BY e.category.name")
    List<Object[]> findCategoryTotalAmount(@Param("userId") Long userId, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    // ==========================================
    // 월 평균 지출 계산 (저축 제외)
    // ==========================================
    @Query(value = "SELECT NVL(AVG(monthly_total), 0) " +
            "FROM (SELECT SUM(e.AMOUNT) as monthly_total " +
            "      FROM EXPENSES e " +
            "      JOIN CATEGORIES c ON e.CATEGORY_ID = c.CATEGORY_ID " +
            "      WHERE e.USER_ID = :userId AND c.NAME != '저축' " +
            "      GROUP BY TO_CHAR(e.EXPENSE_DATE, 'YYYY-MM'))", nativeQuery = true)
    Long getMonthlyAverageExpense(@Param("userId") Long userId);

    // ==========================================
    // 최근 5개월 월별 지출 합계 (저축 제외)
    // ==========================================
    @Query(value = "SELECT TO_CHAR(e.EXPENSE_DATE, 'YYYY-MM') as monthStr, NVL(SUM(e.AMOUNT), 0) as totalAmount " +
            "FROM EXPENSES e " +
            "JOIN CATEGORIES c ON e.CATEGORY_ID = c.CATEGORY_ID " +
            "WHERE e.USER_ID = :userId " +
            "AND c.NAME != '저축' " +
            "AND e.EXPENSE_DATE >= :startDate AND e.EXPENSE_DATE <= :endDate " +
            "GROUP BY TO_CHAR(e.EXPENSE_DATE, 'YYYY-MM') " +
            "ORDER BY monthStr ASC", nativeQuery = true)
    List<Object[]> get5MonthsTrend(@Param("userId") Long userId, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    // ==========================================
    // 목표별 월간 저축 합계 (진행률 차트용)
    // ==========================================
    @Query(value = "SELECT e.GOAL_ID, TO_CHAR(e.EXPENSE_DATE, 'YYYY-MM') as monthStr, SUM(e.AMOUNT) " +
            "FROM EXPENSES e " +
            "JOIN CATEGORIES c ON e.CATEGORY_ID = c.CATEGORY_ID " +
            "WHERE e.USER_ID = :userId AND c.NAME = '저축' AND e.GOAL_ID IS NOT NULL " +
            "GROUP BY e.GOAL_ID, TO_CHAR(e.EXPENSE_DATE, 'YYYY-MM') " +
            "ORDER BY monthStr ASC", nativeQuery = true)
    List<Object[]> getMonthlySavingsGroupedByGoal(@Param("userId") Long userId);

    // ==========================================
    // ★ 과거 전체 내역 조회 (지출+저축 모두 포함)
    // ==========================================
    @Query("SELECT e FROM Expense e WHERE e.userId = :userId AND e.expenseDate < :startDate ORDER BY e.expenseDate DESC")
    List<Expense> findPastAllRecords(@Param("userId") Long userId, @Param("startDate") LocalDate startDate);
}