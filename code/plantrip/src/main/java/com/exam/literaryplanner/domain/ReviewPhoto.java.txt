package com.exam.literaryplanner.domain;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

//DB/엔티티설계 :ReviewPhoto 테이블을 "별도"로 둠.
@Entity
@Table(name = "reviewPhotoT")
public class ReviewPhoto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "rp_idx")
    private Integer rpIdx;

    @Column(name = "rv_idx", nullable = false)
    private Integer rvIdx;   // reviewT.rv_idx

    @Column(name = "rp_original_name", nullable = false, length = 255)
    private String rpOriginalName;

    @Column(name = "rp_stored_name", nullable = false, length = 255)
    private String rpStoredName;

    @Column(name = "rp_content_type", length = 100)
    private String rpContentType;

    @Column(name = "rp_size")
    private Integer rpSize;

    @Column(name = "rp_created_at", nullable = false)
    private LocalDateTime rpCreatedAt = LocalDateTime.now();

    public ReviewPhoto() {}

    public Integer getRpIdx() { return rpIdx; }
    public void setRpIdx(Integer rpIdx) { this.rpIdx = rpIdx; }

    public Integer getRvIdx() { return rvIdx; }
    public void setRvIdx(Integer rvIdx2) { this.rvIdx = rvIdx2; }

    public String getRpOriginalName() { return rpOriginalName; }
    public void setRpOriginalName(String rpOriginalName) { this.rpOriginalName = rpOriginalName; }

    public String getRpStoredName() { return rpStoredName; }
    public void setRpStoredName(String rpStoredName) { this.rpStoredName = rpStoredName; }

    public String getRpContentType() { return rpContentType; }
    public void setRpContentType(String rpContentType) { this.rpContentType = rpContentType; }

    public Integer getRpSize() { return rpSize; }
    public void setRpSize(Integer l) { this.rpSize = l; }

    public LocalDateTime getRpCreatedAt() { return rpCreatedAt; }
    public void setRpCreatedAt(LocalDateTime rpCreatedAt) { this.rpCreatedAt = rpCreatedAt; }
}
