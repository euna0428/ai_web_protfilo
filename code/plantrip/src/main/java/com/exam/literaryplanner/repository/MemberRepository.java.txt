package com.exam.literaryplanner.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.exam.literaryplanner.domain.Member;

@Repository
public interface MemberRepository extends JpaRepository<Member, Integer> {
    // 아무것도 안 써도 됨
}