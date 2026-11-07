package com.exam.literaryplanner.controller;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.exam.literaryplanner.domain.Board;
import com.exam.literaryplanner.domain.Member;
import com.exam.literaryplanner.repository.LiteraryRepository;
import com.exam.literaryplanner.repository.QnaRepository;
import com.exam.literaryplanner.service.AdminQnaService;
import com.exam.literaryplanner.service.BoardService;

import jakarta.servlet.http.HttpSession;

@Controller
@RequestMapping("/admin")
public class AdminController {

    private final BoardService boardService;
    private final AdminQnaService adminQnaService;
    private final QnaRepository qnaRepository;
    private final LiteraryRepository literaryRepository;

    public AdminController(BoardService boardService,
                           AdminQnaService adminQnaService,
                           QnaRepository qnaRepository,
                           LiteraryRepository literaryRepository) {
        this.boardService = boardService;
        this.adminQnaService = adminQnaService;
        this.qnaRepository = qnaRepository;
        this.literaryRepository = literaryRepository;
    }

    @GetMapping({"", "/"})
    public String adminIndex(Model model) {

        long pendingQnaCount = qnaRepository.countPendingByStatus(0);
        model.addAttribute("pendingQnaCount", pendingQnaCount);

        // 최근 문의 목록(미처리만, 최신순)
        DateTimeFormatter df = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        List<java.util.Map<String, Object>> recentQnaList = new java.util.ArrayList<>();

        for (com.exam.literaryplanner.domain.Qna q : qnaRepository.findTop5ByQStatusOrderByQRegDateDesc(0)) {
            java.util.Map<String, Object> v = new java.util.HashMap<>();
            v.put("qIdx", q.getQIdx());
            v.put("qTitle", q.getQTitle());
            v.put("qStatus", q.getQStatus());
            v.put("qRegDate", q.getQRegDate());
            v.put("qRegDateText", (q.getQRegDate() == null ? "-" : q.getQRegDate().format(df)));
            v.put("mName", (q.getMember() != null ? q.getMember().getMName() : "-"));
            recentQnaList.add(v);
        }
        model.addAttribute("recentQnaList", recentQnaList);

        // ✅ 오늘 가입 회원 수(실시간)
        LocalDate today = LocalDate.now();
        LocalDateTime start = today.atStartOfDay();
        LocalDateTime end = start.plusDays(1);
        long todayJoinCount = literaryRepository.countMembersBetween(start, end);
        model.addAttribute("todayJoinCount", todayJoinCount);

        // ✅ 공지사항 수(실시간)
        int noticeCount = 0;
        try {
            List<Board> notices = boardService.listNotices();
            noticeCount = (notices == null ? 0 : notices.size());
        } catch (Exception ignore) {
            noticeCount = 0;
        }
        model.addAttribute("noticeCount", noticeCount);

        // ✅ 최근 FAQ (최신 5개) + FAQ 총 개수
        List<Board> allFaqs = boardService.listFaqs();
        List<Board> recentFaqList = new ArrayList<>();
        if (allFaqs != null) {
            for (int i = 0; i < allFaqs.size() && i < 5; i++) {
                recentFaqList.add(allFaqs.get(i));
            }
        }
        model.addAttribute("recentFaqList", recentFaqList);

        long faqCount = (allFaqs == null) ? 0 : allFaqs.size();
        model.addAttribute("faqCount", faqCount);

        return "admin/admin_index";
    }

    // ✅ 공지사항 목록 페이지
    @GetMapping("/notices")
    public String notices(Model model) {
        List<Board> notices = boardService.listNotices();
        model.addAttribute("notices", notices);
        return "admin/admin_notices";
    }

    // ✅ 공지 작성 페이지
    @GetMapping("/notice")
    public String noticeWriteForm() {
        return "admin/admin_notice";
    }

    // ✅ 공지 등록 처리
    @PostMapping("/notice")
    public String noticeWrite(@RequestParam String title,
                              @RequestParam String cont,
                              @RequestParam(required = false) String isTop) {

        boolean top = "1".equals(isTop) || "on".equalsIgnoreCase(isTop);
        boardService.createNotice(title, cont, top);

        return "redirect:/admin/notices";
    }

    // ✅ 공지 상세
    @GetMapping("/notices/{bIdx}")
    public String adminNoticeDetail(@PathVariable Integer bIdx, Model model) {
        model.addAttribute("notice", boardService.getNoticeDetail(bIdx));
        return "admin/admin_noticeDetail";
    }

    // ✅ 공지 수정 폼
    @GetMapping("/notices/{bIdx}/edit")
    public String adminNoticeEditForm(@PathVariable Integer bIdx, Model model) {
        model.addAttribute("notice", boardService.getNoticeDetail(bIdx));
        return "admin/admin_noticeEdit";
    }

    // ✅ 공지 수정 처리
    @PostMapping("/notices/{bIdx}/edit")
    public String adminNoticeEditSubmit(@PathVariable Integer bIdx,
                                        @RequestParam String title,
                                        @RequestParam String cont,
                                        @RequestParam(required = false) String isTop) {

        boolean top = "1".equals(isTop) || "on".equalsIgnoreCase(isTop);
        boardService.updateNotice(bIdx, title, cont, top);

        return "redirect:/admin/notices/" + bIdx;
    }

    // ✅ 공지 삭제 처리
    @PostMapping("/notices/{bIdx}/delete")
    public String adminNoticeDelete(@PathVariable Integer bIdx) {
        boardService.deleteNotice(bIdx);
        return "redirect:/admin/notices";
    }

    // ✅ FAQ 목록
    @GetMapping("/faqs")
    public String adminFaqList(Model model) {
        model.addAttribute("faqList", boardService.listFaqs());
        return "admin/admin_faqs";
    }

    // ✅ FAQ 작성 폼
    @GetMapping("/faq")
    public String adminFaqWriteForm() {
        return "admin/admin_faq";
    }

    // ✅ FAQ 등록
    @PostMapping("/faq")
    public String adminFaqWrite(@RequestParam String title,
                                @RequestParam String cont,
                                @RequestParam(required = false) String isTop) {
        boolean top = "1".equals(isTop) || "on".equalsIgnoreCase(isTop);
        boardService.createFaq(title, cont, top);
        return "redirect:/admin/faqs";
    }

    // ✅ FAQ 상세
    @GetMapping("/faqs/{bIdx}")
    public String adminFaqDetail(@PathVariable Integer bIdx, Model model) {
        model.addAttribute("faq", boardService.getFaqDetail(bIdx));
        return "admin/admin_faqDetail";
    }

    // ✅ FAQ 수정 폼
    @GetMapping("/faqs/{bIdx}/edit")
    public String adminFaqEditForm(@PathVariable Integer bIdx, Model model) {
        model.addAttribute("faq", boardService.getFaqDetail(bIdx));
        return "admin/admin_faqEdit";
    }

    // ✅ FAQ 수정 처리
    @PostMapping("/faqs/{bIdx}/edit")
    public String adminFaqEditSubmit(@PathVariable Integer bIdx,
                                     @RequestParam String title,
                                     @RequestParam String cont,
                                     @RequestParam(required = false) String isTop) {
        boolean top = "1".equals(isTop) || "on".equalsIgnoreCase(isTop);
        boardService.updateFaq(bIdx, title, cont, top);
        return "redirect:/admin/faqs/" + bIdx;
    }

    // ✅ FAQ 삭제 처리
    @PostMapping("/faqs/{bIdx}/delete")
    public String adminFaqDelete(@PathVariable Integer bIdx) {
        boardService.deleteFaq(bIdx);
        return "redirect:/admin/faqs";
    }

    // =========================
    // ✅ 문의 관리
    // =========================
    @GetMapping("/inquiries")
    public String inquiries(HttpSession session, Model model, RedirectAttributes ra) {
        Member m = (Member) session.getAttribute("loginMember");
        if (m == null || m.getMRole() == null || m.getMRole() != 9) {
            ra.addFlashAttribute("msg", "관리자만 접근 가능합니다.");
            return "redirect:/";
        }

        // 사이드바 배지(미처리 문의 수)
        model.addAttribute("pendingQnaCount", qnaRepository.countPendingByStatus(0));

        List<java.util.Map<String, Object>> pending = new ArrayList<>();
        List<java.util.Map<String, Object>> done = new ArrayList<>();

        for (com.exam.literaryplanner.domain.Qna q : qnaRepository.findByQStatusOrderByQRegDateDesc(0)) {
            java.util.Map<String, Object> v = new java.util.HashMap<>();
            v.put("qIdx", q.getQIdx());
            v.put("qTitle", q.getQTitle());
            v.put("qStatus", q.getQStatus());
            v.put("qRegDate", q.getQRegDate());
            v.put("mName", (q.getMember() != null ? q.getMember().getMName() : "-"));
            pending.add(v);
        }

        for (com.exam.literaryplanner.domain.Qna q : qnaRepository.findByQStatusOrderByQRegDateDesc(1)) {
            java.util.Map<String, Object> v = new java.util.HashMap<>();
            v.put("qIdx", q.getQIdx());
            v.put("qTitle", q.getQTitle());
            v.put("qStatus", q.getQStatus());
            v.put("qRegDate", q.getQRegDate());
            v.put("mName", (q.getMember() != null ? q.getMember().getMName() : "-"));
            done.add(v);
        }

        int total = pending.size() + done.size();
        int pendingCnt = pending.size();
        int doneCnt = done.size();
        int donePct = (total == 0) ? 0 : (int) Math.round((doneCnt * 100.0) / total);

        model.addAttribute("qnaTotal", total);
        model.addAttribute("qnaPendingCount", pendingCnt);
        model.addAttribute("qnaDoneCount", doneCnt);
        model.addAttribute("qnaDonePct", donePct);

        model.addAttribute("qnaPendingList", pending);
        model.addAttribute("qnaDoneList", done);

        return "admin/inquiries";
    }

    @GetMapping("/inquiries/{qIdx}")
    public String inquiryDetail(@PathVariable Integer qIdx, HttpSession session, Model model, RedirectAttributes ra) {
        Member m = (Member) session.getAttribute("loginMember");
        if (m == null || m.getMRole() == null || m.getMRole() != 9) {
            ra.addFlashAttribute("msg", "관리자만 접근 가능합니다.");
            return "redirect:/";
        }

        model.addAttribute("qna", adminQnaService.getQnaDetail(qIdx));
        return "admin/inquiry_detail";
    }

    @PostMapping("/inquiries/{qIdx}/answer")
    public String inquiryAnswer(@PathVariable Integer qIdx,
                                @RequestParam String qAnswer,
                                HttpSession session,
                                RedirectAttributes ra) {
        Member m = (Member) session.getAttribute("loginMember");
        if (m == null || m.getMRole() == null || m.getMRole() != 9) {
            ra.addFlashAttribute("msg", "관리자만 접근 가능합니다.");
            return "redirect:/";
        }

        adminQnaService.saveAnswer(qIdx, qAnswer);
        ra.addFlashAttribute("msg", "답변이 저장되었습니다.");
        return "redirect:/admin";
    }

    // =========================
    // ✅ 회원 관리 (삭제 기능 제거됨)
    // =========================
    @GetMapping("/members")
    public String adminMembers(HttpSession session, Model model, RedirectAttributes ra,
                               @RequestParam(required = false) String kw) {
        Member m = (Member) session.getAttribute("loginMember");
        if (m == null || m.getMRole() == null || m.getMRole() != 9) {
            ra.addFlashAttribute("msg", "관리자만 접근 가능합니다.");
            return "redirect:/";
        }

        List<Member> members;
        if (kw != null && !kw.trim().isEmpty()) {
            members = literaryRepository.searchMembers(kw.trim());
        } else {
            members = literaryRepository.findAllOrderByRegDateDesc();
        }

        model.addAttribute("members", members);
        model.addAttribute("kw", kw);
        return "admin/admin_members";
    }
}