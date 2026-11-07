package com.exam.literaryplanner.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.exam.literaryplanner.domain.ReviewPhoto;

//Repository 추가
public interface ReviewPhotoRepository extends JpaRepository<ReviewPhoto, Integer> {
    List<ReviewPhoto> findByRvIdxOrderByRpIdxAsc(Integer long1);

    // ✅ 후기 삭제 시 사진 메타도 같이 정리
    void deleteByRvIdx(Integer rvIdx);

	/*
	 * Optional<ReviewPhoto> findById(Integer rpIdx);
	 *
	 * void deleteById(Integer rpIdx);
	 */
}