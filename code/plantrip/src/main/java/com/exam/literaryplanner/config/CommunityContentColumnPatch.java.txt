package com.exam.literaryplanner.config;

import java.util.Map;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

/**
 * 커뮤니티 글 내용(c_cont) 컬럼이 너무 짧아서(Data truncation) 등록이 실패하는 문제를 막기 위한 패치.
 *
 * - ddl-auto=none 환경에서도 "communityT.c_cont" 만 TEXT로 확장한다.
 * - 이미 TEXT/MEDIUMTEXT/LONGTEXT면 아무것도 하지 않는다.
 */
@Component
public class CommunityContentColumnPatch implements ApplicationRunner {

    private final JdbcTemplate jdbcTemplate;

    public CommunityContentColumnPatch(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void run(ApplicationArguments args) {
        try {
            Map<String, Object> col = jdbcTemplate.queryForMap(
                    """
                    SELECT DATA_TYPE AS dataType
                    FROM information_schema.COLUMNS
                    WHERE TABLE_SCHEMA = DATABASE()
                      AND TABLE_NAME = 'communityT'
                      AND COLUMN_NAME = 'c_cont'
                    """
            );

            String dataType = String.valueOf(col.get("dataType")).toLowerCase();
            if ("text".equals(dataType) || "mediumtext".equals(dataType) || "longtext".equals(dataType)) {
                return; // 이미 충분히 큼
            }

            jdbcTemplate.execute("ALTER TABLE communityT MODIFY COLUMN c_cont TEXT");
        } catch (Exception ignore) {
            // ✅ 권한/테이블/컬럼 상황이 다를 수 있어서 앱이 죽지는 않게 둔다.
        }
    }
}
