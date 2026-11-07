package com.bu.jichulmate.domain;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "AUTH_TOKENS") // DB 테이블명: AUTH_TOKENS
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class PasswordResetToken {

    public static final String TYPE_PASSWORD_RESET = "PWD_RESET"; //

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_auth_tokens_gen")
    @SequenceGenerator(name = "seq_auth_tokens_gen", sequenceName = "SEQ_AUTH_TOKENS", allocationSize = 1)
    @Column(name = "TOKEN_ID") //
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY) //
    @JoinColumn(name = "USER_ID", nullable = false) //
    private User user; //

    @Column(name = "TARGET_VALUE") //
    private String targetValue; //

    @Column(name = "TOKEN_VALUE", nullable = false, unique = true) //
    private String tokenValue; //

    @Column(name = "TOKEN_TYPE", nullable = false) //
    private String tokenType; //

    @Column(name = "EXPIRES_AT", nullable = false) //
    private LocalDateTime expiresAt; //

    @Builder.Default // 빌더 경고 방지
    @Column(name = "IS_USED", nullable = false, length = 1) //
    private String isUsed = "N"; //

    @Builder.Default // 빌더 경고 방지
    @Column(name = "CREATED_AT", nullable = false, updatable = false) //
    private LocalDateTime createdAt = LocalDateTime.now();


    public boolean isExpired() {
        return LocalDateTime.now().isAfter(expiresAt);
    }

    public boolean isUsed() {
        return "Y".equalsIgnoreCase(isUsed);
    }

    public void markUsed() {
        this.isUsed = "Y";
    }
}