package com.bu.jichulmate.service;

import com.bu.jichulmate.domain.PasswordResetToken;
import com.bu.jichulmate.domain.User;
import com.bu.jichulmate.repository.PasswordResetTokenRepository;
import com.bu.jichulmate.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PasswordResetService {

    private static final int TOKEN_EXPIRE_MINUTES = 30;

    private final UserRepository userRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final MailService mailService;

    @Transactional
    public void sendResetLink(String email, String baseUrl) {
        String trimmedEmail = trim(email);

        if (trimmedEmail == null || trimmedEmail.isEmpty()) {
            throw new IllegalArgumentException("이메일을 입력해 주세요.");
        }

        userRepository.findByLoginId(trimmedEmail).ifPresent(user -> {
            passwordResetTokenRepository.deleteByUserAndTokenType(
                    user,
                    PasswordResetToken.TYPE_PASSWORD_RESET
            );

            String token = UUID.randomUUID().toString();

            PasswordResetToken resetToken = new PasswordResetToken();
            resetToken.setUser(user);
            resetToken.setTargetValue(user.getLoginId());
            resetToken.setTokenValue(token);
            resetToken.setTokenType(PasswordResetToken.TYPE_PASSWORD_RESET);
            resetToken.setExpiresAt(LocalDateTime.now().plusMinutes(TOKEN_EXPIRE_MINUTES));
            resetToken.setIsUsed("N");
            resetToken.setCreatedAt(LocalDateTime.now());

            passwordResetTokenRepository.save(resetToken);

            String resetUrl = baseUrl + "/auth/password/reset?token=" + token;
            mailService.sendPasswordResetMail(user.getLoginId(), resetUrl);
        });

        /*
         * 보안상 가입되지 않은 이메일이어도 별도 에러를 노출하지 않는다.
         * 이유: 입력한 이메일이 회원인지 아닌지 외부에서 추측하지 못하게 하기 위함.
         */
    }

    @Transactional(readOnly = true)
    public boolean isValidToken(String token) {
        String trimmedToken = trim(token);

        if (trimmedToken == null || trimmedToken.isEmpty()) {
            return false;
        }

        return passwordResetTokenRepository
                .findByTokenValueAndTokenType(
                        trimmedToken,
                        PasswordResetToken.TYPE_PASSWORD_RESET
                )
                .filter(resetToken -> !resetToken.isUsed())
                .filter(resetToken -> !resetToken.isExpired())
                .isPresent();
    }

    @Transactional
    public void resetPassword(String token, String password, String passwordConfirm) {
        String trimmedToken = trim(token);
        String trimmedPassword = trim(password);
        String trimmedPasswordConfirm = trim(passwordConfirm);

        if (trimmedToken == null || trimmedToken.isEmpty()) {
            throw new IllegalArgumentException("재설정 토큰이 없습니다.");
        }

        if (trimmedPassword == null || trimmedPassword.isEmpty()) {
            throw new IllegalArgumentException("새 비밀번호를 입력해 주세요.");
        }

        if (trimmedPasswordConfirm == null || trimmedPasswordConfirm.isEmpty()) {
            throw new IllegalArgumentException("새 비밀번호 확인을 입력해 주세요.");
        }

        if (!trimmedPassword.equals(trimmedPasswordConfirm)) {
            throw new IllegalArgumentException("새 비밀번호와 비밀번호 확인이 일치하지 않습니다.");
        }

        if (trimmedPassword.length() < 8) {
            throw new IllegalArgumentException("비밀번호는 8자 이상으로 입력해 주세요.");
        }

        PasswordResetToken resetToken = passwordResetTokenRepository
                .findByTokenValueAndTokenType(
                        trimmedToken,
                        PasswordResetToken.TYPE_PASSWORD_RESET
                )
                .orElseThrow(() -> new IllegalArgumentException("유효하지 않은 재설정 링크입니다."));

        if (resetToken.isUsed()) {
            throw new IllegalArgumentException("이미 사용된 재설정 링크입니다.");
        }

        if (resetToken.isExpired()) {
            throw new IllegalArgumentException("재설정 링크가 만료되었습니다.");
        }

        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(trimmedPassword));

        resetToken.markUsed();
    }

    private String trim(String value) {
        return value == null ? null : value.trim();
    }
}