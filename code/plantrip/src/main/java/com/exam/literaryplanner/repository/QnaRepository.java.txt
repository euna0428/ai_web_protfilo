package com.exam.literaryplanner.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.exam.literaryplanner.domain.Qna;

public interface QnaRepository extends JpaRepository<Qna, Integer> {

	@Query("select q from Qna q where q.member.id = :memberId order by q.qRegDate desc")
	List<Qna> findQnaByMemberId(@Param("memberId") Integer memberId);

	@Query("select count(q) from Qna q where q.qStatus = :status")
	int countPendingByStatus(@Param("status") Integer status);

	// ==============================
	// Admin 전용 목록 조회 (대시보드/문의관리)
	// - 고객센터(Qna) 데이터는 있는데 Admin 목록이 비어 보이는 현상 방지
	// - 최신순 정렬 보장
	// ==============================
	// ⚠️ Qna 엔티티의 getter가 getQStatus()/getQRegDate() 형태라서
	// JavaBeans 규칙에 의해 프로퍼티명이 "QStatus"/"QRegDate"로 잡힐 수 있음.
	// Spring-Data의 메서드명 파싱이 그 이름을 기준으로 해석되면,
	// 실제 JPA 필드(qStatus, qRegDate)와 불일치하여 부팅 시 QueryCreationException이 터짐.
	// => 메서드명 파싱을 피하려고 @Query로 명시해서 필드 기준으로 조회한다.
	@Query("select q from Qna q where q.qStatus = :qStatus order by q.qRegDate desc")
	List<Qna> findByQStatusOrderByQRegDateDesc(@Param("qStatus") Integer qStatus);

	@Query(value = "select * from qnaT where q_status = :qStatus order by q_reg_date desc limit 5", nativeQuery = true)
	List<Qna> findTop5ByQStatusOrderByQRegDateDesc(@Param("qStatus") Integer qStatus);

}
