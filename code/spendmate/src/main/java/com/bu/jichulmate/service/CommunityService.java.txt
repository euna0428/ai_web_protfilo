package com.bu.jichulmate.service;

import com.bu.jichulmate.domain.Attachment;
import com.bu.jichulmate.domain.Board;
import com.bu.jichulmate.domain.BoardComment;
import com.bu.jichulmate.domain.User;
import com.bu.jichulmate.repository.BoardCommentRepository;
import com.bu.jichulmate.repository.CommunityBoardRepository;
import com.bu.jichulmate.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.time.Period;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class CommunityService {

    private static final String ATTACH_REF_TABLE = "BOARDS";

    private static final String CATEGORY_FREE = "FREE";
    private static final String CATEGORY_SECRET = "SECRET";
    private static final String CATEGORY_TEENS = "TEENS";
    private static final String CATEGORY_TWENTIES = "TWENTIES";
    private static final String CATEGORY_THIRTIES = "THIRTIES";
    private static final String CATEGORY_FORTIES = "FORTIES";
    private static final String CATEGORY_FIFTIES = "FIFTIES";

    private static final Set<String> COMMUNITY_CATEGORIES = Set.of(
            CATEGORY_FREE,
            CATEGORY_SECRET,
            CATEGORY_TEENS,
            CATEGORY_TWENTIES,
            CATEGORY_THIRTIES,
            CATEGORY_FORTIES,
            CATEGORY_FIFTIES
    );

    private static final Set<String> AGE_CATEGORIES = Set.of(
            CATEGORY_TEENS,
            CATEGORY_TWENTIES,
            CATEGORY_THIRTIES,
            CATEGORY_FORTIES,
            CATEGORY_FIFTIES
    );

    private final CommunityBoardRepository communityBoardRepository;
    private final BoardCommentRepository boardCommentRepository;
    private final UserRepository userRepository;
    private final FileService fileService;

    @Transactional(readOnly = true)
    public Page<Board> findCommunityPosts(
            String category,
            String keyword,
            String sort,
            Pageable pageable
    ) {
        String normalizedCategory = normalizeCategory(category);
        String normalizedSort = sort == null ? "latest" : sort.trim().toLowerCase();

        Page<Board> postPage;

        if ("popular".equals(normalizedSort)) {
            postPage = communityBoardRepository.findCategoryPopular(normalizedCategory, keyword, pageable);
        } else {
            postPage = communityBoardRepository.findCategoryLatest(normalizedCategory, keyword, pageable);
        }

        postPage.getContent().forEach(this::applyPostDisplayInfo);

        return postPage;
    }

    @Transactional(readOnly = true)
    public Page<Board> findMyCommunityPosts(Long userId, Pageable pageable) {
        Page<Board> postPage = communityBoardRepository.findMyCommunityPosts(userId, COMMUNITY_CATEGORIES, pageable);
        postPage.getContent().forEach(this::applyPostDisplayInfo);
        return postPage;
    }

    @Transactional(readOnly = true)
    public Board findCommunityPost(Long boardId) {
        Board board = communityBoardRepository.findCommunityPost(boardId, COMMUNITY_CATEGORIES);

        if (board == null) {
            throw new IllegalArgumentException("게시글을 찾을 수 없습니다.");
        }

        applyPostDisplayInfo(board);

        return board;
    }

    @Transactional(readOnly = true)
    public List<Attachment> findAttachments(Long boardId) {
        return fileService.findFiles(ATTACH_REF_TABLE, boardId);
    }

    @Transactional(readOnly = true)
    public List<BoardComment> findComments(Long boardId) {
        Board board = findCommunityPost(boardId);

        // ★ 수정됨: findActiveCommentsByBoardId -> findByBoardId 로 변경
        List<BoardComment> comments = boardCommentRepository.findByBoardId(boardId);

        if (isSecretCategory(board.getBoardType())) {
            applySecretCommentDisplayInfo(board, comments);
        }

        return comments;
    }

    @Transactional
    public void increaseViewCount(Long boardId) {
        communityBoardRepository.increaseViewCount(boardId, COMMUNITY_CATEGORIES);
    }

    @Transactional
    public Board createPost(
            Long userId,
            String category,
            String title,
            String content,
            MultipartFile[] photos
    ) throws Exception {
        String normalizedCategory = normalizeCategory(category);

        validateWritableCategory(userId, normalizedCategory);
        validate(title, content);

        // ★ 수정됨: likesCount, isDeleted 필드 제거
        Board board = Board.builder()
                .userId(userId)
                .boardType(normalizedCategory)
                .title(title.trim())
                .content(content.trim())
                .viewsCount(0L)
                .build();

        Board savedBoard = communityBoardRepository.save(board);

        fileService.uploadFiles(photos, ATTACH_REF_TABLE, savedBoard.getBoardId());

        applyPostDisplayInfo(savedBoard);

        return savedBoard;
    }

    @Transactional
    public Board updatePost(
            Long boardId,
            Long loginUserId,
            String category,
            String title,
            String content,
            MultipartFile[] photos
    ) throws Exception {
        validate(title, content);

        Board board = findCommunityPost(boardId);

        if (!board.isOwner(loginUserId)) {
            throw new IllegalStateException("수정 권한이 없습니다.");
        }

        String targetCategory = normalizeCategory(board.getBoardType());

        if (category != null && !category.trim().isEmpty()) {
            targetCategory = normalizeCategory(category);
        }

        validateWritableCategory(loginUserId, targetCategory);

        board.setBoardType(targetCategory);
        board.setTitle(title.trim());
        board.setContent(content.trim());

        Board updatedBoard = communityBoardRepository.save(board);

        fileService.uploadFiles(photos, ATTACH_REF_TABLE, updatedBoard.getBoardId());

        applyPostDisplayInfo(updatedBoard);

        return updatedBoard;
    }

    @Transactional
    public void deletePost(Long boardId, Long loginUserId) {
        Board board = findCommunityPost(boardId);

        if (!board.isOwner(loginUserId)) {
            throw new IllegalStateException("삭제 권한이 없습니다.");
        }

        // ★ 수정됨: 상태값 변경이 아닌 실제 DB 삭제로 변경
        communityBoardRepository.delete(board);

        fileService.deleteFilesWithPhysicalFile(ATTACH_REF_TABLE, boardId);
    }

    @Transactional
    public BoardComment createComment(Long boardId, Long loginUserId, String content) {
        if (loginUserId == null) {
            throw new IllegalStateException("로그인이 필요합니다.");
        }

        Board board = findCommunityPost(boardId);

        validateCommentWritable(board, loginUserId);
        validateComment(content);

        // ★ 수정됨: isDeleted 필드 제거
        BoardComment comment = BoardComment.builder()
                .boardId(board.getBoardId())
                .userId(loginUserId)
                .content(content.trim())
                .build();

        return boardCommentRepository.save(comment);
    }

    @Transactional
    public void deleteComment(Long boardId, Long commentId, Long loginUserId) {
        if (loginUserId == null) {
            throw new IllegalStateException("로그인이 필요합니다.");
        }

        findCommunityPost(boardId);

        // ★ 수정됨: findActiveComment -> findById 로 일반 조회
        BoardComment comment = boardCommentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("댓글을 찾을 수 없습니다."));

        if (!comment.isOwner(loginUserId)) {
            throw new IllegalStateException("댓글 삭제 권한이 없습니다.");
        }

        // ★ 수정됨: 상태값 변경이 아닌 실제 DB 삭제로 변경
        boardCommentRepository.delete(comment);
    }

    public String normalizeCategory(String category) {
        if (category == null || category.trim().isEmpty()) {
            return CATEGORY_FREE;
        }

        String normalized = category.trim().toUpperCase();

        if (!COMMUNITY_CATEGORIES.contains(normalized)) {
            return CATEGORY_FREE;
        }

        return normalized;
    }

    public String getCategoryLabel(String category) {
        if (category == null || category.trim().isEmpty()) {
            return "";
        }

        String normalized = normalizeCategory(category);

        return switch (normalized) {
            case CATEGORY_SECRET -> "비밀";
            case CATEGORY_TEENS -> "10대";
            case CATEGORY_TWENTIES -> "20대";
            case CATEGORY_THIRTIES -> "30대";
            case CATEGORY_FORTIES -> "40대";
            case CATEGORY_FIFTIES -> "50대 이상";
            default -> "자유";
        };
    }

    public boolean isSecretCategory(String category) {
        return CATEGORY_SECRET.equals(normalizeCategory(category));
    }

    public boolean isAgeCategory(String category) {
        return AGE_CATEGORIES.contains(normalizeCategory(category));
    }

    @Transactional(readOnly = true)
    public String getUserAgeCategory(Long userId) {
        if (userId == null) {
            return null;
        }

        User user = findUser(userId);
        return calculateAgeCategory(user.getBirthDate());
    }

    @Transactional(readOnly = true)
    public boolean canWriteCategory(Long userId, String category) {
        if (userId == null) {
            return false;
        }

        String normalizedCategory = normalizeCategory(category);

        if (!isAgeCategory(normalizedCategory)) {
            return true;
        }

        return normalizedCategory.equals(getUserAgeCategory(userId));
    }

    @Transactional(readOnly = true)
    public String getCategoryWriteGuideMessage(Long userId, String category) {
        String normalizedCategory = normalizeCategory(category);

        if (userId == null) {
            return "로그인이 필요합니다.";
        }

        if (!isAgeCategory(normalizedCategory)) {
            return "";
        }

        String userAgeCategory = getUserAgeCategory(userId);

        if (normalizedCategory.equals(userAgeCategory)) {
            return "";
        }

        return "해당 게시판은 " + getCategoryLabel(normalizedCategory)
                + " 사용자만 작성할 수 있습니다. 내 나이대 게시판은 "
                + getCategoryLabel(userAgeCategory) + " 게시판입니다.";
    }

    @Transactional(readOnly = true)
    public void validateWritableCategory(Long userId, String category) {
        if (userId == null) {
            throw new IllegalStateException("로그인이 필요합니다.");
        }

        String normalizedCategory = normalizeCategory(category);

        if (!isAgeCategory(normalizedCategory)) {
            return;
        }

        String userAgeCategory = getUserAgeCategory(userId);

        if (!normalizedCategory.equals(userAgeCategory)) {
            throw new IllegalStateException("본인 나이대 게시판에만 글을 작성할 수 있습니다.");
        }
    }

    public boolean canCommentOnPost(Board board, Long userId) {
        if (board == null || userId == null) {
            return false;
        }

        String category = normalizeCategory(board.getBoardType());

        if (!isAgeCategory(category)) {
            return true;
        }

        return category.equals(getUserAgeCategory(userId));
    }

    public String getCommentGuideMessage(Board board, Long userId) {
        if (userId == null) {
            return "댓글을 작성하려면 로그인이 필요합니다.";
        }

        if (board == null) {
            return "게시글 정보를 확인할 수 없습니다.";
        }

        String category = normalizeCategory(board.getBoardType());

        if (!isAgeCategory(category)) {
            return "";
        }

        String userAgeCategory = getUserAgeCategory(userId);

        if (category.equals(userAgeCategory)) {
            return "";
        }

        return "해당 게시판은 " + getCategoryLabel(category)
                + " 사용자만 댓글을 작성할 수 있습니다. 내 나이대 게시판은 "
                + getCategoryLabel(userAgeCategory) + " 게시판입니다.";
    }

    private void validateCommentWritable(Board board, Long userId) {
        if (!canCommentOnPost(board, userId)) {
            throw new IllegalStateException("본인 나이대 게시판에만 댓글을 작성할 수 있습니다.");
        }
    }

    private void applyPostDisplayInfo(Board board) {
        if (board == null) {
            return;
        }

        if (!isSecretCategory(board.getBoardType())) {
            board.setDisplayWriterName(null);
            board.setDisplayAvatarText(null);
            board.setDisplayAvatarClass(null);
            return;
        }

        User writer = findUserOrNull(board.getUserId());

        board.setDisplayWriterName("익명");
        board.setDisplayAvatarText(getGenderAvatarText(writer));
        board.setDisplayAvatarClass(getGenderAvatarClass(writer));
    }

    private void applySecretCommentDisplayInfo(Board board, List<BoardComment> comments) {
        Map<Long, String> anonymousNameMap = new LinkedHashMap<>();
        int anonymousIndex = 1;

        for (BoardComment comment : comments) {
            Long commentUserId = comment.getUserId();
            User commentUser = comment.getUser();

            if (board.isOwner(commentUserId)) {
                comment.setDisplayWriterName("작성자");
            } else {
                String anonymousName = anonymousNameMap.get(commentUserId);

                if (anonymousName == null) {
                    anonymousName = "익명 " + anonymousIndex;
                    anonymousNameMap.put(commentUserId, anonymousName);
                    anonymousIndex++;
                }

                comment.setDisplayWriterName(anonymousName);
            }

            comment.setDisplayAvatarText(getGenderAvatarText(commentUser));
            comment.setDisplayAvatarClass(getGenderAvatarClass(commentUser));
        }
    }

    private User findUser(Long userId) {
        if (userId == null) {
            throw new IllegalStateException("로그인이 필요합니다.");
        }

        return userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자 정보를 찾을 수 없습니다."));
    }

    private User findUserOrNull(Long userId) {
        if (userId == null) {
            return null;
        }

        return userRepository.findById(userId).orElse(null);
    }

    private String calculateAgeCategory(LocalDate birthDate) {
        if (birthDate == null) {
            throw new IllegalStateException("생년월일 정보가 없어 나이대 게시판을 사용할 수 없습니다.");
        }

        int age = Period.between(birthDate, LocalDate.now()).getYears();

        if (age < 20) {
            return CATEGORY_TEENS;
        }

        if (age < 30) {
            return CATEGORY_TWENTIES;
        }

        if (age < 40) {
            return CATEGORY_THIRTIES;
        }

        if (age < 50) {
            return CATEGORY_FORTIES;
        }

        return CATEGORY_FIFTIES;
    }

    private String getGenderAvatarText(User user) {
        String gender = user == null ? null : user.getGender();

        if (gender == null || gender.isBlank()) {
            return "익명";
        }

        String normalizedGender = gender.trim().toUpperCase();

        if (normalizedGender.contains("여") || normalizedGender.contains("F")) {
            return "여";
        }

        if (normalizedGender.contains("남") || normalizedGender.contains("M")) {
            return "남";
        }

        return "익명";
    }

    private String getGenderAvatarClass(User user) {
        String gender = user == null ? null : user.getGender();

        if (gender == null || gender.isBlank()) {
            return "board-avatar-secret";
        }

        String normalizedGender = gender.trim().toUpperCase();

        if (normalizedGender.contains("여") || normalizedGender.contains("F")) {
            return "board-avatar-female";
        }

        if (normalizedGender.contains("남") || normalizedGender.contains("M")) {
            return "board-avatar-male";
        }

        return "board-avatar-secret";
    }

    private void validate(String title, String content) {
        if (title == null || title.trim().isEmpty()) {
            throw new IllegalArgumentException("제목을 입력해 주세요.");
        }

        if (title.trim().length() > 150) {
            throw new IllegalArgumentException("제목은 150자 이하로 입력해 주세요.");
        }

        if (content == null || content.trim().isEmpty()) {
            throw new IllegalArgumentException("내용을 입력해 주세요.");
        }

        if (content.trim().length() > 4000) {
            throw new IllegalArgumentException("내용은 4000자 이하로 입력해 주세요.");
        }
    }

    private void validateComment(String content) {
        if (content == null || content.trim().isEmpty()) {
            throw new IllegalArgumentException("댓글 내용을 입력해 주세요.");
        }

        if (content.trim().length() > 500) {
            throw new IllegalArgumentException("댓글은 500자 이하로 입력해 주세요.");
        }
    }
}