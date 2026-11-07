package com.exam.literaryplanner.domain;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "memberT")
public class Member {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "m_idx", nullable = false)
    private Integer mIdx; // PK (BIGINT AI)

    @Column(name = "m_id", nullable = false, unique = true, length = 40)
    private String mId; // 로그인 ID

    @Column(name = "m_pw", nullable = false, length = 100)
    private String mPw; // PW(암호화 저장)

    @Column(name = "m_name", nullable = false, length = 30)
    private String mName; // 이름/닉네임

    @Column(name = "m_email", nullable = false, unique = true, length = 60)
    private String mEmail; // 이메일

    @Column(name = "m_role", nullable = false)
    private Integer mRole; // 1:일반, 9:관리자

    @Column(name = "sns_id", length = 100)
    private String snsId; // 소셜 로그인 식별자(보류)

 // 2. DB 컬럼명 m_regDate(사용자님 설정)와 일치시키고, 이름 차이(m_reg_date) 에러 방지
    @Column(name = "m_regDate", insertable = false, updatable = false)
    private LocalDateTime mRegDate;


    public Member() {}

    // --- getters/setters ---
    public Integer getMIdx() { return mIdx; }
    public void setMIdx(Integer mIdx) { this.mIdx = mIdx; }

    public String getMId() { return mId; }
    public void setMId(String mId) { this.mId = mId; }

    public String getMPw() { return mPw; }
    public void setMPw(String mPw) { this.mPw = mPw; }

    public String getMName() { return mName; }
    public void setMName(String mName) { this.mName = mName; }

    public String getMEmail() { return mEmail; }
    public void setMEmail(String mEmail) { this.mEmail = mEmail; }

    public Integer getMRole() { return mRole; }
    public void setMRole(Integer mRole) { this.mRole = mRole; }

    public String getSnsId() { return snsId; }
    public void setSnsId(String snsId) { this.snsId = snsId; }

    public LocalDateTime getMRegDate() { return mRegDate; }
    public void setMRegDate(LocalDateTime mRegDate) { this.mRegDate = mRegDate; }
}
