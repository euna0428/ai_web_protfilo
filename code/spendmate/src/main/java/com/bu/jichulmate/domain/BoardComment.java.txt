package com.bu.jichulmate.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Entity
@Table(name = "COMMENTS")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BoardComment {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_comments_gen")
    @SequenceGenerator(
            name = "seq_comments_gen",
            sequenceName = "SEQ_COMMENTS",
            allocationSize = 1
    )
    @Column(name = "COMMENT_ID")
    private Long commentId;

    @Column(name = "BOARD_ID", nullable = false)
    private Long boardId;

    @Column(name = "USER_ID", nullable = false)
    private Long userId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "USER_ID", insertable = false, updatable = false)
    private User user;

    @Column(name = "CONTENT", nullable = false, length = 500)
    private String content;

    @Builder.Default
    @Column(name = "IS_DELETED", nullable = false, length = 1)
    private String isDeleted = "N";

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
        if (isDeleted == null || isDeleted.isBlank()) {
            isDeleted = "N";
        }

        LocalDateTime now = LocalDateTime.now();

        if (createdAt == null) {
            createdAt = now;
        }

        if (updatedAt == null) {
            updatedAt = now;
        }
    }

    @PreUpdate
    public void preUpdate() {
        if (isDeleted == null || isDeleted.isBlank()) {
            isDeleted = "N";
        }

        updatedAt = LocalDateTime.now();
    }

    public boolean isOwner(Long loginUserId) {
        return loginUserId != null && userId != null && userId.equals(loginUserId);
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