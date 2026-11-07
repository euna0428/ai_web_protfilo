package com.exam.literaryplanner.controller;

import java.net.URI;
import java.util.Map;
import java.util.Optional;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.exam.literaryplanner.domain.Member;
import com.exam.literaryplanner.service.LiteraryService;
import com.exam.literaryplanner.service.MailService;
import com.exam.literaryplanner.service.PasswordResetService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

@Controller
@RequestMapping("/members")
public class MembersController {

    private final LiteraryService literaryService;
    private final PasswordResetService passwordResetService;
    private final MailService mailService;

    public MembersController(LiteraryService literaryService,
                             PasswordResetService passwordResetService,
                             MailService mailService) {
        this.literaryService = literaryService;
        this.passwordResetService = passwordResetService;
        this.mailService = mailService;
    }

    /* =====================
       로그인 화면
       ===================== */
    @GetMapping("/login")
    public String loginForm() {
        return "members/login";
    }

    /* =====================
       로그인 처리 (페이지)
       ===================== */
    @PostMapping("/login")
    public String login(@RequestParam String id,
                        @RequestParam String password,
                        HttpSession session,
                        Model model,
                        HttpServletRequest request) {

        Optional<Member> loginMemberOpt = literaryService.login(id, password);

        if (loginMemberOpt.isEmpty()) {
            model.addAttribute("error", "아이디 또는 비밀번호가 틀렸습니다.");
            return "members/login";
        }

        Member member = loginMemberOpt.get();
        session.setAttribute("loginMember", member);
        String redirectTo = safeRedirectPath(request);
        return "redirect:" + redirectTo;
    }

    /* =====================
       로그인 처리 (AJAX)
       ===================== */
    @PostMapping(value = "/login", headers = "X-Requested-With=XMLHttpRequest")
    @ResponseBody
    public ResponseEntity<?> loginAjax(@RequestParam String id,
                                       @RequestParam String password,
                                       HttpSession session,
                                       HttpServletRequest request) {

        Optional<Member> loginMemberOpt = literaryService.login(id, password);

        if (loginMemberOpt.isEmpty()) {
            return ResponseEntity.status(401).body(Map.of(
                    "ok", false,
                    "message", "아이디 또는 비밀번호가 틀렸습니다."
            ));
        }

        Member member = loginMemberOpt.get();
        session.setAttribute("loginMember", member);

        String redirectTo = safeRedirectPath(request);

        return ResponseEntity.ok(Map.of(
                "ok", true,
                "redirectTo", redirectTo
        ));
    }

    /* =====================
       로그인 성공 후 이동 경로(현재 페이지 유지)
       - 모달 로그인이라도 서버가 / 또는 /admin으로 강제 이동시키면 UX가 깨짐
       - Referer를 기준으로 현재 보고 있던 페이지로 되돌리되,
         외부 URL/로그인 페이지/회원가입 페이지 등은 차단하고 안전하게 fallback 처리
       ===================== */
    private String safeRedirectPath(HttpServletRequest request) {
        String contextPath = (request.getContextPath() != null ? request.getContextPath() : "");
        String referer = request.getHeader("Referer");

        if (referer == null || referer.isBlank()) {
            return contextPath + "/";
        }

        try {
            URI uri = URI.create(referer);
            String path = (uri.getPath() != null ? uri.getPath() : "");
            String query = (uri.getQuery() != null && !uri.getQuery().isBlank()) ? ("?" + uri.getQuery()) : "";

            // 앱 내부 경로만 허용 (contextPath로 시작해야 함)
            if (!path.startsWith(contextPath + "/") && !path.equals(contextPath)) {
                return contextPath + "/";
            }

            // 로그인/회원가입/비번찾기 같은 인증 페이지로 돌아가는 건 막기
            String noCtxPath = contextPath.isEmpty() ? path : path.substring(contextPath.length());
            if (noCtxPath.startsWith("/members/login")
                    || noCtxPath.startsWith("/members/register")
                    || noCtxPath.startsWith("/members/find")
                    || noCtxPath.startsWith("/members/password")) {
                return contextPath + "/";
            }

            return path + query;
        } catch (Exception e) {
            return contextPath + "/";
        }
    }

    /* =====================
       아이디 찾기
       ===================== */
    @GetMapping("/find-id")
    public String findIdForm() {
        return "members/find-id";
    }

    @PostMapping("/find-id")
    public String findId(@RequestParam String email, Model model) {
        model.addAttribute("message", "입력하신 이메일로 가입된 계정이 있다면 안내해 드립니다.");
        return "members/find-id";
    }

    /* =====================
       로그아웃
       ===================== */
    @PostMapping("/logout")
    public String logout(HttpSession session) {
        session.invalidate();
        return "redirect:/";
    }

    /* =====================
       회원가입 화면
       ===================== */
    @GetMapping("/register")
    public String registerForm() {
        return "members/register";
    }

    /* =====================
       회원가입 처리 (페이지)
       ===================== */
    @PostMapping("/register")
    public String register(Member member, Model model) {
        try {
            literaryService.register(member);
        } catch (DataIntegrityViolationException e) {
            model.addAttribute("error", resolveDuplicateMessage(e));
            return "members/register";
        } catch (IllegalArgumentException e) {
            model.addAttribute("error", e.getMessage());
            return "members/register";
        }
        return "redirect:/members/login";
    }

    /* =====================
       회원가입 처리 (AJAX)
       ===================== */
    @PostMapping(value = "/register", headers = "X-Requested-With=XMLHttpRequest")
    @ResponseBody
    public ResponseEntity<?> registerAjax(Member member, HttpSession session) {

        String rawId = member.getMId();
        String rawPw = member.getMPw();

        try {
            literaryService.register(member);
        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "ok", false,
                    "message", resolveDuplicateMessage(e)
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "ok", false,
                    "message", e.getMessage()
            ));
        }

        // 가입 직후 자동 로그인
        if (rawId != null && rawPw != null) {
            literaryService.login(rawId, rawPw)
                    .ifPresent(m -> session.setAttribute("loginMember", m));
        }

        return ResponseEntity.ok(Map.of(
                "ok", true,
                "redirectTo", "/"
        ));
    }

    private String resolveDuplicateMessage(DataIntegrityViolationException e) {
        String msg = "이미 사용 중인 정보가 있습니다. 다시 확인해 주세요.";
        String m = (e.getMostSpecificCause() != null ? e.getMostSpecificCause().getMessage() : e.getMessage());
        if (m != null) {
            String lower = m.toLowerCase();
            if (lower.contains("m_email") || lower.contains("email")) {
				msg = "이미 가입된 이메일입니다.";
			} else if (lower.contains("m_id") || lower.contains("id")) {
				msg = "이미 사용 중인 아이디입니다.";
			}
        }
        return msg;
    }

    /* =====================
       비밀번호 재설정
       ===================== */
    @GetMapping("/find-password")
    public String findPasswordForm() {
        return "members/find-password";
    }

    @PostMapping("/find-password")
    public String sendResetLink(@RequestParam String email,
                                HttpServletRequest request,
                                Model model) {

        String baseUrl = buildBaseUrl(request);
        passwordResetService.sendResetLink(email, baseUrl);

        model.addAttribute("message", "입력하신 이메일로 재설정 링크를 발송했습니다. 메일함을 확인해주세요.");
        return "members/find-password";
    }

    @GetMapping("/password/reset")
    public String resetPasswordForm(@RequestParam String token, Model model) {
        try {
            passwordResetService.validateToken(token);
            model.addAttribute("token", token);
            return "members/reset-password";
        } catch (IllegalArgumentException e) {
            model.addAttribute("error", e.getMessage());
            return "members/reset-password-invalid";
        }
    }

    @PostMapping("/password/reset")
    public String resetPassword(@RequestParam String token,
                                @RequestParam String password,
                                @RequestParam String passwordConfirm,
                                Model model) {

        if (password == null || password.isBlank()) {
            model.addAttribute("token", token);
            model.addAttribute("error", "비밀번호를 입력해 주세요.");
            return "members/reset-password";
        }

        if (!password.equals(passwordConfirm)) {
            model.addAttribute("token", token);
            model.addAttribute("error", "비밀번호가 일치하지 않습니다.");
            return "members/reset-password";
        }

        try {
            passwordResetService.resetPassword(token, password);
            return "redirect:/members/login?reset=success";
        } catch (IllegalArgumentException e) {
            model.addAttribute("error", e.getMessage());
            return "members/reset-password-invalid";
        }
    }

    private String buildBaseUrl(HttpServletRequest request) {
        String scheme = request.getScheme();
        String host = request.getServerName();
        int port = request.getServerPort();

        boolean isDefaultPort = ("http".equalsIgnoreCase(scheme) && port == 80)
                || ("https".equalsIgnoreCase(scheme) && port == 443);

        return scheme + "://" + host + (isDefaultPort ? "" : ":" + port);
    }
}
