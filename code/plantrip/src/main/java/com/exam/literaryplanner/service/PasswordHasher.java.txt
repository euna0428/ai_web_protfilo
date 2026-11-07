package com.exam.literaryplanner.service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HexFormat;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class PasswordHasher {

    // BCrypt는 내부적으로 salt 포함
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    /**
     * 비밀번호 BCrypt 암호화
     */
    public String bcrypt(String rawPassword) {
        return encoder.encode(rawPassword);
    }

    /**
     * 로그인 시 비밀번호 비교
     */
    public boolean matches(String rawPassword, String hashedPassword) {
        return encoder.matches(rawPassword, hashedPassword);
    }

    /**
     * 토큰 SHA-256 해시 (64 hex)
     */
    public String sha256Hex(String rawToken) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] digest = md.digest(rawToken.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(digest);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 not available", e);
        }
    }
}
