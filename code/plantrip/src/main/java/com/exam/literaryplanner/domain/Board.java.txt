package com.exam.literaryplanner.domain;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;

@Entity
@Table(name = "boardT")
public class Board {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "b_idx")
    private Integer bIdx;

    @Column(name = "b_type", nullable = false, length = 10)
    private String bType; // NOTICE / FAQ

    @Column(name = "b_title", nullable = false, length = 200)
    private String bTitle;

    @Lob
    @Column(name = "b_cont", nullable = false)
    private String bCont;

    @Column(name = "b_is_top", nullable = false)
    private Integer bIsTop = 0; // 0/1

    @CreationTimestamp
    @Column(name="b_reg_date", updatable = false)
    private LocalDateTime bRegDate;

    public Board() {}

    public Integer getBIdx() { return bIdx; }
    public void setBIdx(Integer bIdx) { this.bIdx = bIdx; }

    public String getBType() { return bType; }
    public void setBType(String bType) { this.bType = bType; }

    public String getBTitle() { return bTitle; }
    public void setBTitle(String bTitle) { this.bTitle = bTitle; }

    public String getBCont() { return bCont; }
    public void setBCont(String bCont) { this.bCont = bCont; }

    public Integer getBIsTop() { return bIsTop; }
    public void setBIsTop(Integer bIsTop) { this.bIsTop = bIsTop; }

    public LocalDateTime getBRegDate() { return bRegDate; }
    public void setBRegDate(LocalDateTime bRegDate) { this.bRegDate = bRegDate; }
}
