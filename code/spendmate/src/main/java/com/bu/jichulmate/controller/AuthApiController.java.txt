package com.bu.jichulmate.controller;

import com.bu.jichulmate.domain.User;
import com.bu.jichulmate.dto.auth.FindPasswordRequest;
import com.bu.jichulmate.dto.auth.LoginRequest;
import com.bu.jichulmate.dto.auth.ResetPasswordRequest;
import com.bu.jichulmate.dto.auth.SignupRequest;
import com.bu.jichulmate.service.AuthService;
import com.bu.jichulmate.service.PasswordResetService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.bu.jichulmate.util.SessionUtils;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Optional;

@Slf4j
@RestController
@RequiredArgsConstructor
public class AuthApiController {

    private final AuthService authService;
    private final PasswordResetService passwordResetService;

    @PostMapping("/auth/login")
    public ResponseEntity<Map<String, Object>> login(
            LoginRequest request,
            HttpSession session
    ) {
        try {
            Optional<User> loginUser = authService.login(request.getId(), request.getPassword());

            if (loginUser.isEmpty()) {
                return fail(
                        HttpStatus.UNAUTHORIZED,
                        "아이디 또는 비밀번호가 올바르지 않습니다.",
                        "id"
                );
            }

            User user = loginUser.get();


            SessionUtils.setLoginUser(
                    session,
                    user,
                    user.getUserId(),
                    user.getLoginId(),
                    user.getNickname(),
                    user.getRole()
            );

            String role = user.getRole() == null ? "" : user.getRole().trim();
            String redirectTo = "ADMIN".equalsIgnoreCase(role) ? "/admin" : "/";

            Map<String, Object> body = new LinkedHashMap<>();
            body.put("ok", true);
            body.put("message", "로그인이 완료되었습니다.");
            body.put("redirectTo", redirectTo);
            body.put("nickname", user.getNickname());
            body.put("role", role);

            Map<String, Object> userBody = new LinkedHashMap<>();
            userBody.put("userId", user.getUserId());
            userBody.put("loginId", user.getLoginId());
            userBody.put("nickname", user.getNickname());
            userBody.put("role", user.getRole());
            body.put("user", userBody);

            return ResponseEntity.ok(body);

        } catch (DataAccessException e) {
            log.error("[AuthApiController] 로그인 DB 처리 오류", e);
            return fail(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "로그인 처리 중 서버 오류가 발생했습니다. 관리자에게 문의해 주세요.",
                    "id"
            );

        } catch (Exception e) {
            log.error("[AuthApiController] 로그인 처리 오류", e);
            return fail(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "로그인 처리 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.",
                    "id"
            );
        }
    }

    @PostMapping("/auth/register")
    public ResponseEntity<Map<String, Object>> register(SignupRequest request) {
        try {
            authService.register(request);

            Map<String, Object> body = new LinkedHashMap<>();
            body.put("ok", true);
            body.put("message", "회원가입이 완료되었습니다.");
//            body.put("redirectTo", "/");

            return ResponseEntity.ok(body);

        } catch (IllegalArgumentException e) {
            return fail(
                    HttpStatus.BAD_REQUEST,
                    e.getMessage(),
                    resolveSignupErrorField(e.getMessage())
            );

        } catch (DataAccessException e) {
            log.error("[AuthApiController] 회원가입 DB 처리 오류", e);
            return fail(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "회원가입 처리 중 서버 오류가 발생했습니다. 관리자에게 문의해 주세요.",
                    "mEmail"
            );

        } catch (Exception e) {
            log.error("[AuthApiController] 회원가입 처리 오류", e);
            return fail(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "회원가입 처리 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.",
                    "mEmail"
            );
        }
    }

    @PostMapping("/auth/find-password")
    public ResponseEntity<Map<String, Object>> findPassword(
            FindPasswordRequest request,
            HttpServletRequest servletRequest
    ) {
        try {
            String baseUrl = getBaseUrl(servletRequest);

            passwordResetService.sendResetLink(request.getEmail(), baseUrl);

            Map<String, Object> body = new LinkedHashMap<>();
            body.put("ok", true);
            body.put("message", "입력하신 이메일로 비밀번호 재설정 안내를 보냈습니다.");

            return ResponseEntity.ok(body);

        } catch (IllegalArgumentException e) {
            return fail(HttpStatus.BAD_REQUEST, e.getMessage(), "email");

        } catch (Exception e) {
            log.error("[AuthApiController] 비밀번호 찾기 처리 오류", e);
            return fail(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "메일 발송 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.",
                    "email"
            );
        }
    }

    @PostMapping("/auth/password/reset")
    public ResponseEntity<Map<String, Object>> resetPassword(ResetPasswordRequest request) {
        try {
            passwordResetService.resetPassword(
                    request.getToken(),
                    request.getPassword(),
                    request.getPasswordConfirm()
            );

            Map<String, Object> body = new LinkedHashMap<>();
            body.put("ok", true);
            body.put("message", "비밀번호가 변경되었습니다. 새 비밀번호로 로그인해 주세요.");
            body.put("redirectTo", "/auth/login");

            return ResponseEntity.ok(body);

        } catch (IllegalArgumentException e) {
            return fail(HttpStatus.BAD_REQUEST, e.getMessage(), "password");

        } catch (Exception e) {
            log.error("[AuthApiController] 비밀번호 재설정 처리 오류", e);
            return fail(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "비밀번호 재설정 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.",
                    "password"
            );
        }
    }

    @GetMapping("/api/auth/id-exists")
    public Map<String, Object> idExists(@RequestParam String id) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("exists", authService.existsByLoginId(id));
        return body;
    }

    @GetMapping("/api/auth/email-exists")
    public Map<String, Object> emailExists(@RequestParam String email) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("exists", authService.existsByEmail(email));
        return body;
    }

    @GetMapping("/api/auth/nickname-exists")
    public Map<String, Object> nicknameExists(@RequestParam String nickname) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("exists", authService.existsByNickname(nickname));
        return body;
    }

    @PostMapping("/auth/logout")
    public Map<String, Object> logout(HttpSession session) {
        session.invalidate();

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("ok", true);
        body.put("message", "로그아웃되었습니다.");

        return body;
    }

    @GetMapping("/api/auth/status")
    public Map<String, Object> status(HttpSession session) {
        Map<String, Object> body = new LinkedHashMap<>();

        Object loginUser = session.getAttribute("loginUser");
        Object loginUserId = session.getAttribute("loginUserId");

        boolean loggedIn = loginUser != null || loginUserId != null;

        body.put("ok", true);
        body.put("loggedIn", loggedIn);
        body.put("nickname", session.getAttribute("nickname"));
        body.put("role", session.getAttribute("role"));

        return body;
    }

    private ResponseEntity<Map<String, Object>> fail(
            HttpStatus status,
            String message,
            String field
    ) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("ok", false);
        body.put("message", message);

        if (field != null && !field.isBlank()) {
            body.put("field", field);
        }

        return ResponseEntity.status(status).body(body);
    }

    private String resolveSignupErrorField(String message) {
        if (message == null) {
            return "mEmail";
        }

        if (message.contains("이메일")) {
            return "mEmail";
        }

        if (message.contains("비밀번호")) {
            return "mPw";
        }

        if (message.contains("닉네임")) {
            return "mNickname";
        }

        if (message.contains("성별")) {
            return "mGender";
        }

        if (message.contains("생년월일")) {
            return "mBirthDate";
        }

        return "mEmail";
    }

    private String getBaseUrl(HttpServletRequest request) {
        String scheme = request.getScheme();
        String serverName = request.getServerName();
        int serverPort = request.getServerPort();

        boolean isDefaultHttp = "http".equals(scheme) && serverPort == 80;
        boolean isDefaultHttps = "https".equals(scheme) && serverPort == 443;

        if (isDefaultHttp || isDefaultHttps) {
            return scheme + "://" + serverName;
        }

        return scheme + "://" + serverName + ":" + serverPort;
    }
}