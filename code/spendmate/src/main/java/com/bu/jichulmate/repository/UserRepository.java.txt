package com.bu.jichulmate.repository;

import com.bu.jichulmate.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository; // 추가

import java.util.Optional;

@Repository // 스프링 빈으로 등록하기 위해 추가
public interface UserRepository extends JpaRepository<User, Long> {

    // [기존 기능] 로그인 시 사용
    Optional<User> findByLoginId(String loginId);

    // [기존 기능] 회원가입 시 이메일 중복 체크
    boolean existsByLoginId(String loginId);

    // [기존 기능] 회원가입 시 닉네임 중복 체크
    boolean existsByNickname(String nickname);

    /**
     * [추가 기능] 프로필 수정 시 이메일 중복 체크
     * 내 아이디(userId)를 제외하고 해당 이메일을 사용하는 다른 사람이 있는지 확인
     */
    boolean existsByLoginIdAndUserIdNot(String loginId, Long userId);

    /**
     * [추가 기능] 프로필 수정 시 닉네임 중복 체크
     * 내 아이디(userId)를 제외하고 해당 닉네임을 사용하는 다른 사람이 있는지 확인
     */
    boolean existsByNicknameAndUserIdNot(String nickname, Long userId);
}
