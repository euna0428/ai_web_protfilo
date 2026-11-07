package com.bu.jichulmate.repository;

import com.bu.jichulmate.domain.Board;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;

public interface CommunityBoardRepository extends JpaRepository<Board, Long> {

    @Query(
            value = """
                SELECT b
                FROM Board b
                LEFT JOIN FETCH b.user
                WHERE b.boardType = :category
                  AND (
                        :keyword IS NULL
                        OR :keyword = ''
                        OR LOWER(b.title) LIKE LOWER(CONCAT(CONCAT('%', :keyword), '%'))
                        OR LOWER(b.content) LIKE LOWER(CONCAT(CONCAT('%', :keyword), '%'))
                  )
                ORDER BY b.boardId DESC
            """,
            countQuery = """
                SELECT COUNT(b)
                FROM Board b
                WHERE b.boardType = :category
                  AND (
                        :keyword IS NULL
                        OR :keyword = ''
                        OR LOWER(b.title) LIKE LOWER(CONCAT(CONCAT('%', :keyword), '%'))
                        OR LOWER(b.content) LIKE LOWER(CONCAT(CONCAT('%', :keyword), '%'))
                  )
            """
    )
    Page<Board> findCategoryLatest(
            @Param("category") String category,
            @Param("keyword") String keyword,
            Pageable pageable
    );

    @Query(
            value = """
                SELECT b
                FROM Board b
                LEFT JOIN FETCH b.user
                WHERE b.boardType = :category
                  AND (
                        :keyword IS NULL
                        OR :keyword = ''
                        OR LOWER(b.title) LIKE LOWER(CONCAT(CONCAT('%', :keyword), '%'))
                        OR LOWER(b.content) LIKE LOWER(CONCAT(CONCAT('%', :keyword), '%'))
                  )
                ORDER BY b.viewsCount DESC, b.boardId DESC
            """,
            countQuery = """
                SELECT COUNT(b)
                FROM Board b
                WHERE b.boardType = :category
                  AND (
                        :keyword IS NULL
                        OR :keyword = ''
                        OR LOWER(b.title) LIKE LOWER(CONCAT(CONCAT('%', :keyword), '%'))
                        OR LOWER(b.content) LIKE LOWER(CONCAT(CONCAT('%', :keyword), '%'))
                  )
            """
    )
    Page<Board> findCategoryPopular(
            @Param("category") String category,
            @Param("keyword") String keyword,
            Pageable pageable
    );

    @Query(
            value = """
                SELECT b
                FROM Board b
                LEFT JOIN FETCH b.user
                WHERE b.boardType IN :categories
                  AND b.userId = :userId
                ORDER BY b.boardId DESC
            """,
            countQuery = """
                SELECT COUNT(b)
                FROM Board b
                WHERE b.boardType IN :categories
                  AND b.userId = :userId
            """
    )
    Page<Board> findMyCommunityPosts(
            @Param("userId") Long userId,
            @Param("categories") Collection<String> categories,
            Pageable pageable
    );

    @Query("""
        SELECT b
        FROM Board b
        LEFT JOIN FETCH b.user
        WHERE b.boardId = :boardId
          AND b.boardType IN :categories
    """)
    Board findCommunityPost(
            @Param("boardId") Long boardId,
            @Param("categories") Collection<String> categories
    );

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("""
        UPDATE Board b
        SET b.viewsCount = COALESCE(b.viewsCount, 0) + 1
        WHERE b.boardId = :boardId
          AND b.boardType IN :categories
    """)
    int increaseViewCount(
            @Param("boardId") Long boardId,
            @Param("categories") Collection<String> categories
    );
}