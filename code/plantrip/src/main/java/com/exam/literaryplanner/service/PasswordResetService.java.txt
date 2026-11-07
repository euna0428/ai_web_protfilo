package com.exam.literaryplanner.service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.exam.literaryplanner.domain.Member;
import com.exam.literaryplanner.domain.PasswordResetToken;
import com.exam.literaryplanner.repository.LiteraryRepository;
import com.exam.literaryplanner.repository.PasswordResetTokenRepository;

@Service
public class PasswordResetService {

    private final LiteraryRepository literaryRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final PasswordHasher passwordHasher;
    private final MailService mailService;

    public PasswordResetService(LiteraryRepository literaryRepository,
                                PasswordResetTokenRepository tokenRepository,
                                PasswordHasher passwordHasher,
                                MailService mailService) {
        this.literaryRepository = literaryRepository;
        this.tokenRepository = tokenRepository;
        this.passwordHasher = passwordHasher;
        this.mailService = mailService;
    }

    @Transactional
    public void sendResetLink(String email, String baseUrl) {
        if (email == null || email.isBlank()) {
			return;
		}

        Optional<Member> memberOpt = literaryRepository.findByMEmail(email);
        if (memberOpt.isEmpty()) {
            // 보안상 존재 여부 노출 X
            return;
        }

        Member member = memberOpt.get();

        // 최신 링크만 유효하게 (선택)
        tokenRepository.deleteByMemberIdx(member.getMIdx());

        String rawToken = UUID.randomUUID().toString().replace("-", "")  // 32
                + UUID.randomUUID().toString().replace("-", "");        // 64로 늘림(권장)

        LocalDateTime expiresAt = LocalDateTime.now().plusMinutes(15);

        PasswordResetToken prt = new PasswordResetToken();
        prt.setMember(member);
        prt.setTokenHash(passwordHasher.sha256Hex(rawToken)); // ✅ DB엔 해시만
        prt.setExpiresAt(expiresAt);

        tokenRepository.save(prt);

        String normalizedBase = baseUrl.endsWith("/") ? baseUrl.substring(0, baseUrl.length() - 1) : baseUrl;
        String link = normalizedBase + "/members/password/reset?token=" + rawToken;

        mailService.sendPasswordResetMail(member.getMEmail(), link);
    }

    @Transactional(readOnly = true)
    public PasswordResetToken validateToken(String rawToken) {
        if (rawToken == null || rawToken.isBlank()) {
            throw new IllegalArgumentException("INVALID_TOKEN");
        }

        String tokenHash = passwordHasher.sha256Hex(rawToken);

        PasswordResetToken prt = tokenRepository.findByTokenHash(tokenHash)
                .orElseThrow(() -> new IllegalArgumentException("INVALID_TOKEN"));

        if (prt.isUsed()) {
			throw new IllegalArgumentException("TOKEN_USED");
		}
        if (prt.isExpired()) {
			throw new IllegalArgumentException("TOKEN_EXPIRED");
		}

        return prt;
    }

    @Transactional
    public void resetPassword(String rawToken, String newPassword) {
        if (newPassword == null || newPassword.isBlank()) {
            throw new IllegalArgumentException("PASSWORD_REQUIRED");
        }

        // ✅ write 트랜잭션에서 다시 조회/검증까지 한 번에 처리
        String tokenHash = passwordHasher.sha256Hex(rawToken);

        PasswordResetToken prt = tokenRepository.findByTokenHash(tokenHash)
                .orElseThrow(() -> new IllegalArgumentException("INVALID_TOKEN"));

        if (prt.isUsed()) {
			throw new IllegalArgumentException("TOKEN_USED");
		}
        if (prt.isExpired()) {
			throw new IllegalArgumentException("TOKEN_EXPIRED");
		}

        Member member = prt.getMember();
        // ✅ 여기서 newPassword를 해시로 저장해야 함 (BCrypt든 뭐든)
        // 네 프로젝트가 PasswordEncoder를 계속 쓸 거면, PasswordHasher 대신 encoder를 주입해도 됨.
        member.setMPw(passwordHasher.bcrypt(newPassword));

        prt.setUsedAt(LocalDateTime.now());
    }
}
