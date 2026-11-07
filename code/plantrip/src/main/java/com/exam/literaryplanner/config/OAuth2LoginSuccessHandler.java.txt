package com.exam.literaryplanner.config;

import java.io.IOException;
import java.security.SecureRandom;

import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.exam.literaryplanner.domain.Member;
import com.exam.literaryplanner.repository.LiteraryRepository;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

@Component
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    private final LiteraryRepository literaryRepository;
    private final PasswordEncoder passwordEncoder;

    public OAuth2LoginSuccessHandler(LiteraryRepository literaryRepository,
                                     PasswordEncoder passwordEncoder) {
        this.literaryRepository = literaryRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {

        Object principal = authentication.getPrincipal();

        // 구글은 보통 OIDC라서 OidcUser로 들어옴(아니면 OAuth2User)
        String subject;
        String email;
        String name;

        if (principal instanceof OidcUser oidcUser) {
            subject = oidcUser.getSubject();                 // 구글 고유ID(sub)
            email = oidcUser.getEmail();                     // 이메일
            name = oidcUser.getFullName();                   // 이름(없으면 아래로 대체)
            if (name == null || name.isBlank()) {
				name = oidcUser.getGivenName();
			}
        } else {
            OAuth2User user = (OAuth2User) principal;
            subject = String.valueOf(user.getAttribute("sub"));
            email = user.getAttribute("email");
            name = user.getAttribute("name");
        }

        // ✅ sns_id 저장 규칙
        String snsId = "google:" + subject;

        // 1) snsId로 기존 회원 찾기
        Member member = literaryRepository.findBySnsId(snsId).orElse(null);

        // 2) snsId로 못 찾으면, "같은 이메일"로 기존 계정이 있는지 먼저 확인해서 연동
        //    (이걸 안 하면 m_email UNIQUE 때문에 구글 로그인에서 500이 터질 수 있음)
        if (member == null && email != null && !email.isBlank()) {
            member = literaryRepository.findByMEmail(email).orElse(null);
            if (member != null) {
                member.setSnsId(snsId);
                member = literaryRepository.save(member);
            }
        }

        // 3) 그래도 없으면 자동 회원가입
        if (member == null) {
            member = new Member();

            // m_id 유니크 충돌 방지: 기본값 + 필요 시 뒤에 숫자를 붙여서 보정
            String baseId = "google_" + subject.substring(0, Math.min(10, subject.length()));
            String newId = baseId;
            int tries = 0;
            while (literaryRepository.existsByMId(newId) && tries < 20) {
                tries++;
                newId = baseId + "_" + tries;
            }
            member.setMId(newId);

            // pw는 소셜로그인에서는 안 쓰지만 NOT NULL이라 랜덤+암호화로 채움
            member.setMPw(passwordEncoder.encode(randomPassword(20)));

            member.setMName((name != null && !name.isBlank()) ? name : "구글사용자");
            member.setMEmail((email != null && !email.isBlank()) ? email : (member.getMId() + "@google.local"));
            member.setMRole(1);
            member.setSnsId(snsId);

            member = literaryRepository.save(member);
        }

        // ✅ 여기서 너희 방식대로 “세션 로그인”을 만들어줌
        HttpSession session = request.getSession();
        session.setAttribute("loginMember", member);
        session.setAttribute("loginUserName", member.getMName()); // 너 JSP에서 쓰는 값도 같이

        // 원하는 곳으로 이동
        response.sendRedirect(request.getContextPath() + "/");
    }

    private String randomPassword(int len) {
        final String chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*";
        SecureRandom r = new SecureRandom();
        StringBuilder sb = new StringBuilder(len);
        for (int i = 0; i < len; i++) {
			sb.append(chars.charAt(r.nextInt(chars.length())));
		}
        return sb.toString();
    }
}
