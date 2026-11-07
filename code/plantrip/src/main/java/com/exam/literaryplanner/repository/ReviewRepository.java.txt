package com.exam.literaryplanner.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.exam.literaryplanner.domain.Review;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Integer> {

    /* =========================
     * 조회수 증가 (상세 보기에서 사용)
     * - save(entity)로 전체를 갱신하면 연관관계가 null로 덮이는 경우가 있어
     *   UPDATE 쿼리로 안전하게 카운팅만 올림
     * ========================= */
    @Modifying
    @Transactional
	    /*
	     * ✅ 조회수 증가
	     * JPQL bulk update가 환경에 따라 갱신이 반영되지 않는 케이스가 있어
	     * 실제 테이블 컬럼을 native로 안전하게 올립니다.
	     */
	    @Query(value = "UPDATE communityT SET c_v_count = IFNULL(c_v_count,0) + 1 WHERE c_idx = :rvIdx", nativeQuery = true)
    int incrementViewCount(@Param("rvIdx") Integer rvIdx);

    // ✅ 상세(뷰/수정폼에서 사용) - member/spot/city 까지 같이 로딩
    @Query("""
        SELECT r
        FROM Review r
        JOIN FETCH r.member m
        JOIN FETCH r.spot s
        JOIN FETCH s.city c
        WHERE r.rvIdx = :rvIdx
    """)
    Optional<Review> findDetail(@Param("rvIdx") Integer rvIdx);

    // ===== 내 후기 =====
    @Query("""
        SELECT r
        FROM Review r
        JOIN FETCH r.member m
        JOIN FETCH r.spot s
        JOIN FETCH s.city c
        WHERE r.mIdx = :mIdx
        ORDER BY r.rvIdx DESC
    """)
    List<Review> findByMIdxOrderByRvIdxDesc(@Param("mIdx") Integer mIdx);

    @Query("""
        SELECT r
        FROM Review r
        JOIN FETCH r.member m
        JOIN FETCH r.spot s
        JOIN FETCH s.city c
        WHERE r.mIdx = :mIdx
          AND r.rvTitle LIKE CONCAT('%', :rvTitle, '%')
        ORDER BY r.rvIdx DESC
    """)
    List<Review> findByMIdxAndRvTitleContainingOrderByRvIdxDesc(
            @Param("mIdx") Integer mIdx,
            @Param("rvTitle") String rvTitle
    );

    // ===== 커뮤니티 검색 최신순 =====
    @Query("""
        SELECT r
        FROM Review r
        JOIN FETCH r.member m
        JOIN FETCH r.spot s
        JOIN FETCH s.city c
        WHERE (:kw IS NULL OR :kw = '' OR r.rvTitle LIKE CONCAT('%', :kw, '%') OR r.rvCont LIKE CONCAT('%', :kw, '%'))
          AND (:minStar IS NULL OR :minStar IS NOT NULL)
          AND (:sIdx IS NULL OR r.sIdx = :sIdx)
        ORDER BY r.rvIdx DESC
    """)
    List<Review> searchOrderByLatestDesc(@Param("kw") String keyword,
                                        @Param("minStar") Integer minStar,
                                        @Param("sIdx") Integer sIdx);

    // ===== 커뮤니티 검색 별점순 =====
    @Query("""
        SELECT r
        FROM Review r
        JOIN FETCH r.member m
        JOIN FETCH r.spot s
        JOIN FETCH s.city c
        WHERE (:kw IS NULL OR :kw = '' OR r.rvTitle LIKE CONCAT('%', :kw, '%') OR r.rvCont LIKE CONCAT('%', :kw, '%'))
          AND (:minStar IS NULL OR :minStar IS NOT NULL)
          AND (:sIdx IS NULL OR r.sIdx = :sIdx)
        ORDER BY COALESCE(r.rvVCount,0) DESC, r.rvIdx DESC
    """)
    List<Review> searchOrderByStarDesc(@Param("kw") String keyword,
                                      @Param("minStar") Integer minStar,
                                      @Param("sIdx") Integer sIdx);

    // 전체
    @Query("""
        SELECT r
        FROM Review r
        JOIN FETCH r.member m
        JOIN FETCH r.spot s
        JOIN FETCH s.city c
        ORDER BY r.rvIdx DESC
    """)
    List<Review> findAllLatest();

    @Query("""
        SELECT r
        FROM Review r
        JOIN FETCH r.member m
        JOIN FETCH r.spot s
        JOIN FETCH s.city c
        ORDER BY COALESCE(r.rvVCount,0) DESC, r.rvIdx DESC
    """)
    List<Review> findAllStar();
}