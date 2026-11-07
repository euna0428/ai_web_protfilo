package com.bu.jichulmate.service;

import com.bu.jichulmate.domain.User;
import com.bu.jichulmate.dto.auth.SignupRequest;
import com.bu.jichulmate.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class AuthService {

    private static final Pattern EMAIL_PATTERN =
            Pattern.compile("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$");

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public User register(SignupRequest request) {
        String loginId = trim(request.getMEmail());
        String nickname = trim(request.getMNickname());
        String password = trim(request.getMPw());
        String gender = trim(request.getMGender());

        validateRegisterInput(request, loginId, nickname, password, gender);

        if (userRepository.existsByLoginId(loginId)) {
            throw new IllegalArgumentException("이미 사용 중인 이메일입니다.");
        }

        if (userRepository.existsByNickname(nickname)) {
            throw new IllegalArgumentException("이미 사용 중인 닉네임입니다.");
        }

        User user = User.builder()
                .loginId(loginId)
                .nickname(nickname)
                .password(passwordEncoder.encode(password))
                .gender(gender)
                .birthDate(request.getMBirthDate())
                .provider("LOCAL")
                .is2faEnabled("N")
                .mentorTone("MILD")
                .role("USER")
                .accountStatus("ACTIVE")
                .isNotiEnabled(Boolean.TRUE.equals(request.getMarketingAgreed()) ? "Y" : "N")
                .build();

        return userRepository.save(user);
    }

    @Transactional
    public Optional<User> login(String loginId, String rawPassword) {
        String cleanLoginId = trim(loginId);
        String cleanPassword = rawPassword == null ? "" : rawPassword;

        if (cleanLoginId == null || cleanLoginId.isEmpty()) {
            return Optional.empty();
        }

        if (cleanPassword.isEmpty()) {
            return Optional.empty();
        }

        Optional<User> userOptional = userRepository.findByLoginId(cleanLoginId);

        if (userOptional.isEmpty()) {
            return Optional.empty();
        }

        User user = userOptional.get();

        if (!"ACTIVE".equalsIgnoreCase(user.getAccountStatus())) {
            return Optional.empty();
        }

        String savedPassword = user.getPassword();

        if (savedPassword == null || savedPassword.isBlank()) {
            return Optional.empty();
        }

        if (isBcryptPassword(savedPassword)) {
            return passwordEncoder.matches(cleanPassword, savedPassword)
                    ? Optional.of(user)
                    : Optional.empty();
        }

        /*
         * 개발/초기 데이터 대응:
         * Spending_mate_Data 2.0.sql의 관리자 계정 비밀번호가 평문으로 들어가 있는 상태라
         * 최초 1회 평문 비교를 허용하고, 성공하면 즉시 BCrypt로 암호화해서 다시 저장한다.
         */
        if (savedPassword.equals(cleanPassword)) {
            user.setPassword(passwordEncoder.encode(cleanPassword));
            userRepository.save(user);
            return Optional.of(user);
        }

        return Optional.empty();
    }

    public boolean existsByLoginId(String loginId) {
        String cleanLoginId = trim(loginId);

        if (cleanLoginId == null || cleanLoginId.isEmpty()) {
            return false;
        }

        return userRepository.existsByLoginId(cleanLoginId);
    }

    public boolean existsByEmail(String email) {
        return existsByLoginId(email);
    }

    public boolean existsByNickname(String nickname) {
        String cleanNickname = trim(nickname);

        if (cleanNickname == null || cleanNickname.isEmpty()) {
            return false;
        }

        return userRepository.existsByNickname(cleanNickname);
    }

    private void validateRegisterInput(
            SignupRequest request,
            String loginId,
            String nickname,
            String password,
            String gender
    ) {
        if (loginId == null || loginId.isEmpty()) {
            throw new IllegalArgumentException("이메일을 입력해 주세요.");
        }

        if (!EMAIL_PATTERN.matcher(loginId).matches()) {
            throw new IllegalArgumentException("올바른 이메일 형식으로 입력해 주세요.");
        }

        if (nickname == null || nickname.isEmpty()) {
            throw new IllegalArgumentException("닉네임을 입력해 주세요.");
        }

        if (password == null || password.isEmpty()) {
            throw new IllegalArgumentException("비밀번호를 입력해 주세요.");
        }

        if (password.length() < 8) {
            throw new IllegalArgumentException("비밀번호는 8자 이상 입력해 주세요.");
        }

        if (gender == null || gender.isEmpty()) {
            throw new IllegalArgumentException("성별을 선택해 주세요.");
        }

        if (request.getMBirthDate() == null) {
            throw new IllegalArgumentException("생년월일을 입력해 주세요.");
        }
    }

    private boolean isBcryptPassword(String password) {
        return password.startsWith("$2a$")
                || password.startsWith("$2b$")
                || password.startsWith("$2y$");
    }

    private String trim(String value) {
        return value == null ? null : value.trim();
    }
}