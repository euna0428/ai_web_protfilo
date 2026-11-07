package com.bu.jichulmate.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "USERS")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "userSeq")
    @SequenceGenerator(
            name = "userSeq",
            sequenceName = "SEQ_USERS",
            allocationSize = 1
    )
    @Column(name = "USER_ID")
    private Long userId;

    @Column(name = "LOGIN_ID", nullable = false, unique = true, length = 100)
    private String loginId;

    @Column(name = "NICKNAME", nullable = false, unique = true, length = 100)
    private String nickname;

    @Column(name = "PASSWORD", nullable = false, length = 255)
    private String password;

    @Column(name = "GENDER", length = 10)
    private String gender;

    @Column(name = "BIRTH_DATE", nullable = false)
    private LocalDate birthDate;

    @Builder.Default
    @Column(name = "PROVIDER", nullable = false, length = 20)
    private String provider = "LOCAL";

    @Builder.Default
    @Column(name = "IS_2FA_ENABLED", nullable = false, length = 1)
    private String is2faEnabled = "N";

    @Builder.Default
    @Column(name = "MENTOR_TONE", nullable = false, length = 20)
    private String mentorTone = "MILD";

    @Builder.Default
    @Column(name = "ROLE", nullable = false, length = 20)
    private String role = "USER";

    @Builder.Default
    @Column(name = "ACCOUNT_STATUS", nullable = false, length = 20)
    private String accountStatus = "ACTIVE";

    @Builder.Default
    @Column(name = "IS_NOTI_ENABLED", nullable = false, length = 1)
    private String isNotiEnabled = "Y";
}