package com.bu.jichulmate.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "ATTACHMENTS")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Attachment {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_attachments_gen")
    @SequenceGenerator(
            name = "seq_attachments_gen",
            sequenceName = "SEQ_ATTACHMENTS",
            allocationSize = 1
    )
    @Column(name = "FILE_ID")
    private Long fileId;

    @Column(name = "REF_TABLE", nullable = false, length = 50)
    private String refTable;

    @Column(name = "REF_ID", nullable = false)
    private Long refId;

    @Column(name = "ORG_FILE_NAME", nullable = false, length = 255)
    private String orgFileName;

    @Column(name = "SAVED_FILE_NAME", nullable = false, length = 255)
    private String savedFileName;

    @Column(name = "FILE_PATH", nullable = false, length = 500)
    private String filePath;

    @Column(name = "FILE_SIZE", nullable = false)
    private Long fileSize;

    @Column(name = "REG_DATE", nullable = false, updatable = false)
    private LocalDateTime regDate;

    @PrePersist
    public void prePersist() {
        if (regDate == null) {
            regDate = LocalDateTime.now();
        }
    }
}