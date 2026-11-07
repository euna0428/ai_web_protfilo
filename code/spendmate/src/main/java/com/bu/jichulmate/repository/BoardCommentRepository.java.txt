package com.bu.jichulmate.repository;

import com.bu.jichulmate.domain.BoardComment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BoardCommentRepository extends JpaRepository<BoardComment, Long> {

    @Query("""
        SELECT c
        FROM BoardComment c
        LEFT JOIN FETCH c.user
        WHERE c.boardId = :boardId
        ORDER BY c.commentId ASC
    """)
    List<BoardComment> findByBoardId(@Param("boardId") Long boardId);

    // Service에서 기본 JpaRepository의 findById를 쓰도록 변경했기 때문에
    // 불필요한 findActiveComment 메서드는 깔끔하게 지웠습니다.
}