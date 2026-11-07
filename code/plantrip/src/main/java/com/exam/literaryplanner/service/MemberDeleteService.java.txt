package com.exam.literaryplanner.service;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class MemberDeleteService {

    private final JdbcTemplate jdbcTemplate;

    public MemberDeleteService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Transactional
    public void deleteMemberAll(Integer mIdx) {

        // 1) FK로 직접 member를 참조하는 테이블부터 삭제
        jdbcTemplate.update("DELETE FROM password_reset_token WHERE member_idx = ?", mIdx);
        jdbcTemplate.update("DELETE FROM wishListT WHERE m_idx = ?", mIdx);
        jdbcTemplate.update("DELETE FROM reviewT WHERE m_idx = ?", mIdx);
        jdbcTemplate.update("DELETE FROM qnaT WHERE m_idx = ?", mIdx);

        // 2) travelPlanT는 planDetailT가 매달려 있으므로
        //    (스키마상 planDetailT는 travelPlanT ON DELETE CASCADE라서 원래는 여행계획만 지워도 됨)
        //    그래도 안전하게 하려면 travelPlan 먼저 지우기 OK
        jdbcTemplate.update("DELETE FROM travelPlanT WHERE m_idx = ?", mIdx);

        // 3) 마지막에 member 삭제
        int deleted = jdbcTemplate.update("DELETE FROM memberT WHERE m_idx = ?", mIdx);
        if (deleted == 0) {
            // 이미 삭제됐거나 없는 회원일 수 있음
            throw new IllegalStateException("삭제할 회원이 없습니다.");
        }
    }
}
