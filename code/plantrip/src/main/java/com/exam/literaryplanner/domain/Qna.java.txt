package com.exam.literaryplanner.domain;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

@Entity
@Table(name = "qnaT")
public class Qna {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "q_idx", nullable = false)
    private Integer qIdx;

    // FK: qnaT.m_idx -> memberT.m_idx
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "m_idx", nullable = false)
    private Member member;

    @Column(name = "q_title", nullable = false, length = 200)
    private String qTitle;

    @Lob
    @Column(name = "q_cont", nullable = false)
    private String qCont;

    @Lob
    @Column(name = "q_answer")
    private String qAnswer;

    @Column(name = "q_status", nullable = false)
    private Integer qStatus = 0; // 0:대기, 1:완료

    // DB DEFAULT CURRENT_TIMESTAMP 쓰려면 insertable/updatable false
    @Column(name = "q_reg_date", nullable = false)
    private LocalDateTime qRegDate;


    @PrePersist
    private void prePersist() {
        if (this.qRegDate == null) {
			this.qRegDate = LocalDateTime.now();
		}
        if (this.qStatus == null) {
			this.qStatus = 0;
		}
    }

    public Qna() {}

    public Integer getQIdx() { return qIdx; }
    public void setQIdx(Integer qIdx) { this.qIdx = qIdx; }

    public Member getMember() { return member; }
    public void setMember(Member member) { this.member = member; }

    public String getQTitle() { return qTitle; }
    public void setQTitle(String qTitle) { this.qTitle = qTitle; }

    public String getQCont() { return qCont; }
    public void setQCont(String qCont) { this.qCont = qCont; }

    public String getQAnswer() { return qAnswer; }
    public void setQAnswer(String qAnswer) { this.qAnswer = qAnswer; }

    public Integer getQStatus() { return qStatus; }
    public void setQStatus(Integer qStatus) { this.qStatus = qStatus; }

    public LocalDateTime getQRegDate() { return qRegDate; }
    public void setQRegDate(LocalDateTime qRegDate) { this.qRegDate = qRegDate; }
}
