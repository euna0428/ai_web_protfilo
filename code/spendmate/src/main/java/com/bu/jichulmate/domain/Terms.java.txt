package com.bu.jichulmate.domain;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "TERMS")
public class Terms {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_terms_gen")
    @SequenceGenerator(name = "seq_terms_gen", sequenceName = "SEQ_TERMS", allocationSize = 1)
    @Column(name = "TERM_ID")
    private Long termId;

    @Enumerated(EnumType.STRING)
    @Column(name = "TERM_TYPE", nullable = false)
    private TermsType termType;

    @Column(name = "VERSION", nullable = false)
    private String version;

    @Lob
    @Column(name = "CONTENT", nullable = false)
    private String content;

    @Builder.Default
    @Column(name = "IS_REQUIRED", nullable = false, length = 1)
    private String isRequired = "Y";

    @Column(name = "APPLY_DATE", nullable = false)
    private LocalDateTime applyDate;

    @Column(name = "CREATED_AT", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "UPDATED_AT")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (applyDate == null) this.applyDate = LocalDateTime.now();
    }
}