package com.bu.jichulmate.controller;

import com.bu.jichulmate.util.SessionUtils;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {



    // ==========================================
    // 1. 관리자 메인 대시보드
    // ==========================================
    @GetMapping({"", "/"})
    public String adminDashboard(HttpSession session) { // ★ HttpSession 파라미터 추가

        // ★ AdminPageController에 있던 보안 로직을 여기로 가져옵니다.
        if (!SessionUtils.isAdmin(session)) {
            return "redirect:/auth/login"; // 로그인 페이지 경로에 맞게 수정해주세요 (예: /login 또는 /auth/login)
        }

        return "admin/admin_index";
    }

    // ==========================================
    // 2. 회원 관리 (USERS 테이블)
    // ==========================================

    // ① 회원 목록 조회
    @GetMapping("/users")
    public String userList(@PageableDefault(size = 10) Pageable pageable, Model model) {
        // TODO: 서비스에서 전체 회원 목록을 페이징해서 가져옵니다.
        // Page<UserResponse> users = adminUserService.getAllUsers(pageable);
        // model.addAttribute("users", users);

        return "admin/admin_users";
    }

    // ② 회원 상세 보기
    @GetMapping("/users/detail")
    public String userDetail(@RequestParam("userId") Long userId, Model model) {
        // TODO: 서비스에서 특정 회원의 상세 정보를 가져옵니다.
        // UserDetailResponse user = adminUserService.getUserDetail(userId);
        // model.addAttribute("user", user);

        return "admin/admin_user_detail";
    }

    // ③ 회원 상태 변경 화면 (폼)
    @GetMapping("/users/status")
    public String userStatusForm(@RequestParam("userId") Long userId, Model model) {
        // TODO: 상태를 변경할 대상 회원의 현재 정보를 가져옵니다.
        // UserResponse user = adminUserService.getUserById(userId);
        // model.addAttribute("user", user);

        return "admin/admin_user_status";
    }

    // ④ 회원 상태 실제 변경 처리 (POST)
    @PostMapping("/users/status")
    public String updateUserStatus(
            @RequestParam("userId") Long userId,
            @RequestParam("accountStatus") String status,
            RedirectAttributes rttr) {

        // TODO: 서비스에서 실제로 DB의 ACCOUNT_STATUS 값을 업데이트합니다.
        // adminUserService.updateUserStatus(userId, status);

        // 처리가 끝나면 다시 회원 목록 페이지로 이동(Redirect)시킵니다.
        rttr.addFlashAttribute("message", "회원 상태가 성공적으로 변경되었습니다.");
        return "redirect:/admin/users";
    }

    // ==========================================
    // 3. 관리자 활동 로그 (ADMIN_AUDIT_LOGS 테이블)
    // ==========================================
    @GetMapping("/audit")
    public String auditLogList(@PageableDefault(size = 15) Pageable pageable, Model model) {
        return "admin/admin_audit";
    }
}