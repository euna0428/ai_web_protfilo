package com.bu.jichulmate.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Entity
@Table(name = "BOARDS")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Board {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_boards_gen")
    @SequenceGenerator(name = "seq_boards_gen", sequenceName = "SEQ_BOARDS", allocationSize = 1)
    @Column(name = "BOARD_ID") // ID에서 BOARD_ID로 수정
    private Long boardId;

    @Column(name = "USER_ID", nullable = false)
    private Long userId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "USER_ID", insertable = false, updatable = false)
    private User user;

    @Column(name = "BOARD_TYPE", nullable = false, length = 30)
    private String boardType;

    @Column(name = "TITLE", nullable = false, length = 150)
    private String title;

    @Column(name = "CONTENT", nullable = false, length = 4000)
    private String content;

    @Builder.Default
    @Column(name = "VIEWS_COUNT", nullable = false)
    private Long viewsCount = 0L;

    @Column(name = "CREATED_AT", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "UPDATED_AT")
    private LocalDateTime updatedAt;

    @Transient
    private String displayWriterName;

    @Transient
    private String displayAvatarText;

    @Transient
    private String displayAvatarClass;

    @PrePersist
    public void prePersist() {

        LocalDateTime now = LocalDateTime.now();

        if (createdAt == null) {
            createdAt = now;
        }

        if (updatedAt == null) {
            updatedAt = now;
        }

        if (viewsCount == null) {
            viewsCount = 0L;
        }

    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();

        if (viewsCount == null) {
            viewsCount = 0L;
        }
    }


    public boolean isOwner(Long loginUserId) {
        return loginUserId != null && userId != null && userId.equals(loginUserId);
    }

    public boolean isSecretPost() {
        return "SECRET".equalsIgnoreCase(boardType);
    }

    public String getCreatedAtText() {
        if (createdAt == null) {
            return "";
        }

        return createdAt.format(DateTimeFormatter.ofPattern("yyyy.MM.dd HH:mm"));
    }

    public String getWriterName() {
        if (displayWriterName != null && !displayWriterName.isBlank()) {
            return displayWriterName;
        }

        if (isSecretPost()) {
            return "익명";
        }

        if (user == null || user.getNickname() == null || user.getNickname().isBlank()) {
            if (userId == null) {
                return "알 수 없음";
            }

            return "사용자 " + userId;
        }

        return user.getNickname();
    }

    public String getAvatarText() {
        if (displayAvatarText != null && !displayAvatarText.isBlank()) {
            return displayAvatarText;
        }

        String writerName = getWriterName();

        if (writerName == null || writerName.isBlank()) {
            return "M";
        }

        return writerName.substring(0, 1);
    }

    public String getAvatarClass() {
        if (displayAvatarClass != null && !displayAvatarClass.isBlank()) {
            return displayAvatarClass;
        }

        return "board-avatar-default";
    }
}