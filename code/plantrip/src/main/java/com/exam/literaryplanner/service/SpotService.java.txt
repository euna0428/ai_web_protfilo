package com.exam.literaryplanner.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.exam.literaryplanner.domain.Spot;
import com.exam.literaryplanner.domain.SpotStats;
import com.exam.literaryplanner.repository.SpotRepository;
import com.exam.literaryplanner.repository.SpotStatsRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SpotService {

    private static final Logger log = LoggerFactory.getLogger(SpotService.class);

	private final SpotRepository spotRepository;
	private final SpotStatsRepository spotStatsRepository;

	public Spot findById(Integer id) {
        return spotRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 장소가 존재하지 않습니다. id=" + id));
    }

	@Transactional(readOnly = true)
	public Page<Spot> list(String keyword, String catCode, Integer cityId, int page, int size) {
		Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
		return spotRepository.search(keyword, catCode, cityId, pageable);
	}

	@Transactional
	public Spot detailAndIncreaseView(Integer id) {
		Spot spot = spotRepository.findDetail(id)
				.orElseThrow(() -> new IllegalArgumentException("존재하지 않는 장소입니다. s_idx=" + id));

		SpotStats stats = spot.getStats();

		if (stats == null) {
			stats = new SpotStats();
			stats.setId(spot.getId()); // Spot 도메인의 sIdx를 id로 바꿨으므로 getId() 사용
			stats.setSpot(spot);
			stats.setViewCount(0);
			stats.setWishCount(0);
			stats.setRatingCount(0);
			stats.setRatingAvg(BigDecimal.ZERO);
		}

		stats.setViewCount(stats.getViewCount() + 1);
		spotStatsRepository.save(stats);

		return spot;
	}

	// SpotService.java (또는 클래스)에 추가
	public List<Spot> getTodayPopularSpots() {
	    // 1. 모든 관광지(TOUR) 데이터 가져오기 (이미 구현된 findByCatCode 등 활용)
	    List<Spot> allTourSpots = spotRepository.findByCatCode("TOUR");

	    if (allTourSpots.isEmpty()) {
			return new ArrayList<>();
		}

	    // 2. 오늘 날짜(yyyyMMdd)를 숫자로 바꿔서 랜덤 시드로 사용
	    // 이렇게 하면 오늘 하루 동안은 shuffle 결과가 항상 동일합니다.
	    long seed = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd")).hashCode();
	    Collections.shuffle(allTourSpots, new Random(seed));

	    // 3. 상위 6개만 잘라서 반환
	    return allTourSpots.stream()
	            .limit(6)
	            .collect(Collectors.toList());
	}

	public List<Spot> getRandomSpotsByCategory(String catCode) {
	    List<Spot> spots = spotRepository.findByCatCode(catCode);
	    if (spots.isEmpty()) {
			return new java.util.ArrayList<>();
		}

	    // 오늘 날짜(20260226)와 카테고리명을 조합해 매일 다른 고정 시드를 만듭니다.
	    String dateStr = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
	    long seed = (dateStr + catCode).hashCode();

	    // 이 시드로 섞으면 오늘 하루는 누가 몇 번을 클릭해도 같은 순서로 나옵니다.
	    java.util.Collections.shuffle(spots, new java.util.Random(seed));

	    return spots.stream().limit(10).collect(java.util.stream.Collectors.toList());
	}

	// 마이페이지 전체 찜한 목록 조회용
    @Transactional(readOnly = true)
    public List<Spot> getWishSpots(Integer mIdx) {
        if (mIdx == null) {
            return new ArrayList<>();
        }
        return spotRepository.findWishSpotsByMemberIdx(mIdx);
    }

    // 마이페이지 최근 찜한 8개 조회용
    @Transactional(readOnly = true)
    public List<Spot> getRecentWishSpots(Integer mIdx) {
        if (mIdx == null) {
            return new ArrayList<>();
        }

        try {
            /* 첫 번째 페이지(0)에서 8개의 id를 먼저 가져온 뒤, Spot+City를 한 번에 조회 */
            Pageable limit = PageRequest.of(0, 8);

            List<Integer> ids = spotRepository.findRecentWishSpotIds(mIdx, limit);
            if (ids == null || ids.isEmpty()) {
                return new ArrayList<>();
            }

            List<Spot> fetched = spotRepository.findByIdInWithCity(ids);
            if (fetched == null || fetched.isEmpty()) {
                return new ArrayList<>();
            }

            /* IN 조회는 순서가 보장되지 않으므로, wishList 최신순(ids 순서)대로 재정렬 */
            java.util.Map<Integer, Spot> map = new java.util.HashMap<>();
            for (Spot s : fetched) {
                map.put(s.getId(), s);
            }

            List<Spot> ordered = new ArrayList<>();
            for (Integer id : ids) {
                Spot s = map.get(id);
                if (s != null) ordered.add(s);
            }
            return ordered;

        } catch (Exception e) {
            /*
              ✅ mypage 진입 시 500이 터질 때 대부분 여기(최근 찜 조회)에서 DB 스키마/테이블명/컬럼명이
              맞지 않아 native query가 실패하는 케이스였습니다.
              페이지 전체가 죽지 않도록 빈 리스트로 내려주고, 원인은 로그로 남깁니다.
            */
            log.error("[MyPage] 최근 찜한 장소 조회 실패 (mIdx={}) - DB 테이블/컬럼명 확인 필요", mIdx, e);
            return new ArrayList<>();
        }
    }

}
