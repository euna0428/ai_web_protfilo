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
import jakarta.persistence.Table;

@Entity
@Table(name = "communityT")
public class Community {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "c_idx")
    private Integer rvIdx;          

    @Column(name = "m_idx")
    private Integer mIdx;           

    @Column(name = "s_idx")
    private Integer sIdx;           

    @Column(name = "c_title")
    private String rvTitle;         

    @Lob
    @Column(name = "c_cont", columnDefinition = "MEDIUMTEXT", nullable = false)
    private String rvCont;          

    @Column(name = "c_img", columnDefinition = "TEXT")
    private String rvImg;           

    @Column(name = "c_region")
    private String rvRegion;        

    @Column(name = "c_regDate")
    private LocalDateTime rvRegDate;

    @Column(name = "c_update")
    private LocalDateTime rvUpdate;

    @Column(name = "c_v_count")
    private Integer rvVCount;       

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "m_idx", insertable = false, updatable = false)
    private Member member;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "s_idx", insertable = false, updatable = false)
    private Spot spot;

    // ✅ [수정/추가된 부분] 기존의 @Transient를 지우고 DB 컬럼과 매핑되도록 @Column 추가
    @Column(name = "c_star")
    private Integer rvStar;

    // -------------------------
    // getter / setter
    // -------------------------
    public Integer getRvIdx() { return rvIdx; }
    public void setRvIdx(Integer rvIdx) { this.rvIdx = rvIdx; }

    public Integer getMIdx() { return mIdx; }
    public void setMIdx(Integer mIdx) { this.mIdx = mIdx; }

    public Integer getSIdx() { return sIdx; }
    public void setSIdx(Integer sIdx) { this.sIdx = sIdx; }

    public String getRvTitle() { return rvTitle; }
    public void setRvTitle(String rvTitle) { this.rvTitle = rvTitle; }

    public String getRvCont() { return rvCont; }
    public void setRvCont(String rvCont) { this.rvCont = rvCont; }

    public String getRvImg() { return rvImg; }
    public void setRvImg(String rvImg) { this.rvImg = rvImg; }

    public String getRvRegion() { return rvRegion; }
    public void setRvRegion(String rvRegion) { this.rvRegion = rvRegion; }

    public LocalDateTime getRvRegDate() { return rvRegDate; }
    public void setRvRegDate(LocalDateTime rvRegDate) { this.rvRegDate = rvRegDate; }

    public LocalDateTime getRvUpdate() { return rvUpdate; }
    public void setRvUpdate(LocalDateTime rvUpdate) { this.rvUpdate = rvUpdate; }

    public Integer getRvVCount() { return rvVCount; }
    public void setRvVCount(Integer rvVCount) { this.rvVCount = rvVCount; }

    public Member getMember() { return member; }
    public void setMember(Member member) { this.member = member; }

    public Spot getSpot() { return spot; }
    public void setSpot(Spot spot) { this.spot = spot; }

    public Integer getRvStar() { return rvStar; }
    public void setRvStar(Integer rvStar) { this.rvStar = rvStar; }
}