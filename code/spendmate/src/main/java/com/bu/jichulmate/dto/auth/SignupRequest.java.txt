package com.bu.jichulmate.dto.auth;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class SignupRequest {

    // 이메일을 로그인 아이디로 사용
    private String mEmail;

    // 닉네임
    private String mNickname;

    // 비밀번호
    private String mPw;

    // 성별
    private String mGender;

    // 생년월일
    private LocalDate mBirthDate;

    // 회원가입 전 이용약관 모달에서 동의한 TERMS.TERM_ID 목록
    private List<Long> agreedTermIds = new ArrayList<>();

    // 선택 약관인 마케팅 정보 수신 동의 여부
    private Boolean marketingAgreed = false;
}
