package com.bu.jichulmate.repository;

import com.bu.jichulmate.domain.PasswordResetToken;
import com.bu.jichulmate.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {

    Optional<PasswordResetToken> findByTokenValueAndTokenType(String tokenValue, String tokenType);

    void deleteByUserAndTokenType(User user, String tokenType);
}