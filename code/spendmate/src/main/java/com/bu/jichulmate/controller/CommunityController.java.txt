package com.bu.jichulmate.controller;

import com.bu.jichulmate.domain.Attachment;
import com.bu.jichulmate.domain.Board;
import com.bu.jichulmate.domain.BoardComment;
import com.bu.jichulmate.service.CommunityService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.lang.reflect.Method;
import java.util.List;

@Controller
@RequiredArgsConstructor
@RequestMapping("/community")
public class CommunityController {

    private static final int PAGE_SIZE = 9;
    private static final int PAGE_BLOCK_SIZE = 5;

    private final CommunityService communityService;

    @GetMapping
    public String list(
            @RequestParam(required = false, defaultValue = "FREE") String category,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false, defaultValue = "latest") String sort,
            @RequestParam(required = false, defaultValue = "1") int page,
            HttpSession session,
            Model model
    ) {
        String normalizedCategory = communityService.normalizeCategory(category);
        Long loginUserId = getLoginUserId(session);

        int safePage = Math.max(page, 1);

        Pageable pageable = PageRequest.of(safePage - 1, PAGE_SIZE);
        Page<Board> postPage = communityService.findCommunityPosts(
                normalizedCategory,
                keyword,
                sort,
                pageable
        );

        if (postPage.getTotalPages() > 0 && safePage > postPage.getTotalPages()) {
            safePage = postPage.getTotalPages();
            pageable = PageRequest.of(safePage - 1, PAGE_SIZE);
            postPage = communityService.findCommunityPosts(
                    normalizedCategory,
                    keyword,
                    sort,
                    pageable
            );
        }

        String userAgeCategory = communityService.getUserAgeCategory(loginUserId);

        model.addAttribute("posts", postPage.getContent());
        model.addAttribute("category", normalizedCategory);
        model.addAttribute("categoryLabel", communityService.getCategoryLabel(normalizedCategory));
        model.addAttribute("keyword", keyword);
        model.addAttribute("sort", sort);
        model.addAttribute("loginUserId", loginUserId);
        model.addAttribute("userAgeCategory", userAgeCategory);
        model.addAttribute("userAgeCategoryLabel", communityService.getCategoryLabel(userAgeCategory));
        model.addAttribute("canWriteCurrentCategory", communityService.canWriteCategory(loginUserId, normalizedCategory));
        model.addAttribute("categoryWriteGuideMessage", communityService.getCategoryWriteGuideMessage(loginUserId, normalizedCategory));

        addPaginationAttributes(model, postPage, safePage);

        return "community/list";
    }

    @GetMapping("/write")
    public String writeForm(
            @RequestParam(required = false, defaultValue = "FREE") String category,
            HttpSession session,
            Model model,
            RedirectAttributes ra
    ) {
        Long loginUserId = getLoginUserId(session);

        if (loginUserId == null) {
            ra.addFlashAttribute("msg", "로그인이 필요합니다.");
            return "redirect:/auth/login";
        }

        String normalizedCategory = communityService.normalizeCategory(category);

        try {
            communityService.validateWritableCategory(loginUserId, normalizedCategory);
        } catch (Exception e) {
            ra.addFlashAttribute("msg", e.getMessage());
            return "redirect:/community?category=" + normalizedCategory;
        }

        String userAgeCategory = communityService.getUserAgeCategory(loginUserId);

        model.addAttribute("category", normalizedCategory);
        model.addAttribute("categoryLabel", communityService.getCategoryLabel(normalizedCategory));
        model.addAttribute("userAgeCategory", userAgeCategory);
        model.addAttribute("userAgeCategoryLabel", communityService.getCategoryLabel(userAgeCategory));

        return "community/write";
    }

    @PostMapping("/write")
    public String write(
            @RequestParam(required = false, defaultValue = "FREE") String category,
            @RequestParam String title,
            @RequestParam String content,
            @RequestParam(value = "photos", required = false) MultipartFile[] photos,
            HttpSession session,
            RedirectAttributes ra
    ) {
        Long loginUserId = getLoginUserId(session);
        String normalizedCategory = communityService.normalizeCategory(category);

        if (loginUserId == null) {
            ra.addFlashAttribute("msg", "로그인이 필요합니다.");
            return "redirect:/auth/login";
        }

        try {
            Board savedBoard = communityService.createPost(
                    loginUserId,
                    normalizedCategory,
                    title,
                    content,
                    photos
            );

            ra.addFlashAttribute("msg", "게시글이 등록되었습니다.");
            return "redirect:/community/detail/" + savedBoard.getBoardId();
        } catch (Exception e) {
            ra.addFlashAttribute("msg", e.getMessage());
            return "redirect:/community/write?category=" + normalizedCategory;
        }
    }

    @GetMapping("/detail/{boardId}")
    public String detail(
            @PathVariable Long boardId,
            HttpSession session,
            Model model,
            RedirectAttributes ra
    ) {
        try {
            communityService.increaseViewCount(boardId);

            Board post = communityService.findCommunityPost(boardId);
            List<Attachment> attachments = communityService.findAttachments(boardId);
            List<BoardComment> comments = communityService.findComments(boardId);

            Long loginUserId = getLoginUserId(session);
            boolean owner = post.isOwner(loginUserId);

            String category = communityService.normalizeCategory(post.getBoardType());
            boolean canComment = communityService.canCommentOnPost(post, loginUserId);

            model.addAttribute("post", post);
            model.addAttribute("attachments", attachments);
            model.addAttribute("comments", comments);
            model.addAttribute("loginUserId", loginUserId);
            model.addAttribute("owner", owner);
            model.addAttribute("category", category);
            model.addAttribute("categoryLabel", communityService.getCategoryLabel(category));
            model.addAttribute("secretCategory", communityService.isSecretCategory(category));
            model.addAttribute("ageCategory", communityService.isAgeCategory(category));
            model.addAttribute("canComment", canComment);
            model.addAttribute("commentGuideMessage", communityService.getCommentGuideMessage(post, loginUserId));

            return "community/detail";
        } catch (Exception e) {
            ra.addFlashAttribute("msg", e.getMessage());
            return "redirect:/community";
        }
    }

    @PostMapping("/detail/{boardId}/comments")
    public String createComment(
            @PathVariable Long boardId,
            @RequestParam String content,
            HttpSession session,
            RedirectAttributes ra
    ) {
        Long loginUserId = getLoginUserId(session);

        if (loginUserId == null) {
            ra.addFlashAttribute("msg", "로그인이 필요합니다.");
            return "redirect:/auth/login";
        }

        try {
            communityService.createComment(boardId, loginUserId, content);
            ra.addFlashAttribute("msg", "댓글이 등록되었습니다.");
        } catch (Exception e) {
            ra.addFlashAttribute("msg", e.getMessage());
        }

        return "redirect:/community/detail/" + boardId;
    }

    @PostMapping("/detail/{boardId}/comments/{commentId}/delete")
    public String deleteComment(
            @PathVariable Long boardId,
            @PathVariable Long commentId,
            HttpSession session,
            RedirectAttributes ra
    ) {
        Long loginUserId = getLoginUserId(session);

        if (loginUserId == null) {
            ra.addFlashAttribute("msg", "로그인이 필요합니다.");
            return "redirect:/auth/login";
        }

        try {
            communityService.deleteComment(boardId, commentId, loginUserId);
            ra.addFlashAttribute("msg", "댓글이 삭제되었습니다.");
        } catch (Exception e) {
            ra.addFlashAttribute("msg", e.getMessage());
        }

        return "redirect:/community/detail/" + boardId;
    }

    @GetMapping("/edit/{boardId}")
    public String editForm(
            @PathVariable Long boardId,
            HttpSession session,
            Model model,
            RedirectAttributes ra
    ) {
        Long loginUserId = getLoginUserId(session);

        if (loginUserId == null) {
            ra.addFlashAttribute("msg", "로그인이 필요합니다.");
            return "redirect:/auth/login";
        }

        try {
            Board post = communityService.findCommunityPost(boardId);

            if (!post.isOwner(loginUserId)) {
                ra.addFlashAttribute("msg", "수정 권한이 없습니다.");
                return "redirect:/community/detail/" + boardId;
            }

            List<Attachment> attachments = communityService.findAttachments(boardId);
            String category = communityService.normalizeCategory(post.getBoardType());
            String userAgeCategory = communityService.getUserAgeCategory(loginUserId);

            model.addAttribute("post", post);
            model.addAttribute("attachments", attachments);
            model.addAttribute("category", category);
            model.addAttribute("categoryLabel", communityService.getCategoryLabel(category));
            model.addAttribute("userAgeCategory", userAgeCategory);
            model.addAttribute("userAgeCategoryLabel", communityService.getCategoryLabel(userAgeCategory));

            return "community/edit";
        } catch (Exception e) {
            ra.addFlashAttribute("msg", e.getMessage());
            return "redirect:/community";
        }
    }

    @PostMapping("/edit/{boardId}")
    public String edit(
            @PathVariable Long boardId,
            @RequestParam(required = false) String category,
            @RequestParam String title,
            @RequestParam String content,
            @RequestParam(value = "photos", required = false) MultipartFile[] photos,
            HttpSession session,
            RedirectAttributes ra
    ) {
        Long loginUserId = getLoginUserId(session);

        if (loginUserId == null) {
            ra.addFlashAttribute("msg", "로그인이 필요합니다.");
            return "redirect:/auth/login";
        }

        try {
            communityService.updatePost(
                    boardId,
                    loginUserId,
                    category,
                    title,
                    content,
                    photos
            );

            ra.addFlashAttribute("msg", "게시글이 수정되었습니다.");
            return "redirect:/community/detail/" + boardId;
        } catch (Exception e) {
            ra.addFlashAttribute("msg", e.getMessage());
            return "redirect:/community/edit/" + boardId;
        }
    }

    @PostMapping("/delete/{boardId}")
    public String delete(
            @PathVariable Long boardId,
            HttpSession session,
            RedirectAttributes ra
    ) {
        Long loginUserId = getLoginUserId(session);

        if (loginUserId == null) {
            ra.addFlashAttribute("msg", "로그인이 필요합니다.");
            return "redirect:/auth/login";
        }

        String redirectCategory = "FREE";

        try {
            Board post = communityService.findCommunityPost(boardId);
            redirectCategory = communityService.normalizeCategory(post.getBoardType());

            communityService.deletePost(boardId, loginUserId);

            ra.addFlashAttribute("msg", "게시글이 삭제되었습니다.");
            return "redirect:/community?category=" + redirectCategory;
        } catch (Exception e) {
            ra.addFlashAttribute("msg", e.getMessage());
            return "redirect:/community/detail/" + boardId;
        }
    }

    @GetMapping("/my")
    public String myPosts(
            @RequestParam(required = false, defaultValue = "1") int page,
            HttpSession session,
            Model model,
            RedirectAttributes ra
    ) {
        Long loginUserId = getLoginUserId(session);

        if (loginUserId == null) {
            ra.addFlashAttribute("msg", "로그인이 필요합니다.");
            return "redirect:/auth/login";
        }

        int safePage = Math.max(page, 1);

        Pageable pageable = PageRequest.of(safePage - 1, 10);
        Page<Board> postPage = communityService.findMyCommunityPosts(loginUserId, pageable);

        if (postPage.getTotalPages() > 0 && safePage > postPage.getTotalPages()) {
            safePage = postPage.getTotalPages();
            pageable = PageRequest.of(safePage - 1, PAGE_SIZE);
            postPage = communityService.findMyCommunityPosts(loginUserId, pageable);
        }


        model.addAttribute("boards", postPage);

        addPaginationAttributes(model, postPage, safePage);

        return "community/my";
    }

    private void addPaginationAttributes(Model model, Page<Board> postPage, int currentPage) {
        int totalPages = Math.max(postPage.getTotalPages(), 1);
        int startPage = ((currentPage - 1) / PAGE_BLOCK_SIZE) * PAGE_BLOCK_SIZE + 1;
        int endPage = Math.min(startPage + PAGE_BLOCK_SIZE - 1, totalPages);

        int prevBlockPage = Math.max(startPage - 1, 1);
        int nextBlockPage = Math.min(endPage + 1, totalPages);

        int emptyLineCount = Math.max(PAGE_SIZE - postPage.getNumberOfElements(), 0);
        int startNo = (currentPage - 1) * PAGE_SIZE;

        model.addAttribute("postPage", postPage);
        model.addAttribute("currentPage", currentPage);
        model.addAttribute("totalPages", totalPages);
        model.addAttribute("startPage", startPage);
        model.addAttribute("endPage", endPage);
        model.addAttribute("hasPrevBlock", startPage > 1);
        model.addAttribute("hasNextBlock", endPage < totalPages);
        model.addAttribute("prevBlockPage", prevBlockPage);
        model.addAttribute("nextBlockPage", nextBlockPage);
        model.addAttribute("emptyLineCount", emptyLineCount);
        model.addAttribute("startNo", startNo);
        model.addAttribute("pageSize", PAGE_SIZE);
    }

    private Long getLoginUserId(HttpSession session) {
        if (session == null) {
            return null;
        }

        String[] idSessionNames = {
                "loginUserId",
                "userId",
                "USER_ID",
                "LOGIN_USER_ID",
                "memberId"
        };

        for (String sessionName : idSessionNames) {
            Object value = session.getAttribute(sessionName);
            Long id = convertToLong(value);

            if (id != null) {
                return id;
            }
        }

        String[] objectSessionNames = {
                "loginUser",
                "user",
                "loginMember",
                "currentUser"
        };

        for (String sessionName : objectSessionNames) {
            Object loginUser = session.getAttribute(sessionName);

            if (loginUser == null) {
                continue;
            }

            Long id = extractId(loginUser, "getUserId");
            if (id != null) return id;

            id = extractId(loginUser, "getId");
            if (id != null) return id;

            id = extractId(loginUser, "getUserIdx");
            if (id != null) return id;

            id = extractId(loginUser, "getMIdx");
            if (id != null) return id;
        }

        return null;
    }

    private Long extractId(Object target, String methodName) {
        try {
            Method method = target.getClass().getMethod(methodName);
            Object value = method.invoke(target);
            return convertToLong(value);
        } catch (Exception e) {
            return null;
        }
    }

    private Long convertToLong(Object value) {
        if (value == null) {
            return null;
        }

        if (value instanceof Long) {
            return (Long) value;
        }

        if (value instanceof Integer) {
            return ((Integer) value).longValue();
        }

        if (value instanceof Number) {
            return ((Number) value).longValue();
        }

        if (value instanceof String) {
            try {
                return Long.parseLong((String) value);
            } catch (NumberFormatException e) {
                return null;
            }
        }

        return null;
    }
}