package com.exam.literaryplanner.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.exam.literaryplanner.domain.Member;
import com.exam.literaryplanner.service.BoardService;
import com.exam.literaryplanner.service.SupportService;

import jakarta.servlet.http.HttpSession;

@Controller
@RequestMapping("/support")
public class SupportController {

    private final SupportService supportService;
    private final BoardService boardService;

    public SupportController(SupportService supportService, BoardService boardService) {
        this.supportService = supportService;
        this.boardService = boardService;
    }

    // ✅ 기존에 쓰던 고객센터 메인 (support/support.jsp)
    // URL: /support
    @GetMapping("")
    public String supportRoot(HttpSession session, Model model) {
        Member loginMember = (Member) session.getAttribute("loginMember");

        if (loginMember != null) {
            model.addAttribute("qnaPreview", supportService.myQnaViewList(loginMember.getMIdx()));
        }
        return "support/support";
    }

    // ✅ 공지사항(원하면 support.jsp에서 include로 처리해도 됨)
    // URL: /support/notice
    @GetMapping("/notice")
    public String noticeList(Model model) {
        model.addAttribute("noticeList", boardService.listNotices());
        return "support/notice"; // /WEB-INF/views/support/notice.jsp
    }

    @GetMapping("/notice/{bIdx}")
    public String noticeDetail(@PathVariable Integer bIdx, Model model) {
        model.addAttribute("notice", boardService.getNoticeDetail(bIdx));
        return "support/noticeDetail"; // /WEB-INF/views/support/noticeDetail.jsp
    }

    // ✅ 내 문의 목록 (로그인 필수)
    // URL: /support/qna
    @GetMapping("/qna")
    public String myQna(HttpSession session, Model model, RedirectAttributes ra) {
        Member loginMember = (Member) session.getAttribute("loginMember");
        if (loginMember == null) {
            ra.addFlashAttribute("msg", "로그인 후 이용 가능합니다.");
            return "redirect:/members/login";
        }

        model.addAttribute("qnaList", supportService.myQnaViewList(loginMember.getMIdx()));
        return "support/qna";
    }


    // ✅ 문의 작성 폼 (로그인 필수)
    // URL: /support/qna/new
    @GetMapping("/qna/new")
    public String qnaForm(HttpSession session, RedirectAttributes ra) {
        if (session.getAttribute("loginMember") == null) {
            ra.addFlashAttribute("msg", "로그인 후 이용 가능합니다.");
            return "redirect:/members/login";
        }
        return "support/qnaForm";
    }

    // ✅ 문의 등록 (로그인 필수)
    // URL: POST /support/qna
    @PostMapping("/qna")
    public String qnaSubmit(
            @RequestParam String qTitle,
            @RequestParam String qCont,
            HttpSession session,
            RedirectAttributes ra
    ) {
        Member loginMember = (Member) session.getAttribute("loginMember");
        if (loginMember == null) {
            ra.addFlashAttribute("msg", "로그인 후 이용 가능합니다.");
            return "redirect:/members/login";
        }

        supportService.createQna(loginMember, qTitle, qCont);
        ra.addFlashAttribute("msg", "문의가 등록되었습니다.");
        return "redirect:/support/qna";
    }

    // ✅ 내 문의 상세 (로그인 + 내 글만)
    // URL: /support/qna/{qIdx}
    @GetMapping("/qna/{qIdx}")
    public String qnaDetail(
            @PathVariable Integer qIdx,
            HttpSession session,
            Model model,
            RedirectAttributes ra
    ) {
        Member loginMember = (Member) session.getAttribute("loginMember");
        if (loginMember == null) {
            ra.addFlashAttribute("msg", "로그인 후 이용 가능합니다.");
            return "redirect:/members/login";
        }

        model.addAttribute("qna", supportService.getMyQnaDetailView(qIdx, loginMember.getMIdx()));

        return "support/qnaDetail";
    }

    @PostMapping("/qna/{qIdx}/delete")
    public String qnaDelete(
            @PathVariable Integer qIdx,
            HttpSession session,
            RedirectAttributes ra
    ) {
        Member loginMember = (Member) session.getAttribute("loginMember");
        if (loginMember == null) {
            ra.addFlashAttribute("msg", "로그인 후 이용 가능합니다.");
            return "redirect:/members/login";
        }

        try {
            supportService.deleteMyQna(qIdx, loginMember.getMIdx());
            ra.addFlashAttribute("msg", "문의가 삭제되었습니다.");
            return "redirect:/support/qna";
        } catch (Exception e) {
            ra.addFlashAttribute("msg", "삭제에 실패했습니다: " + e.getMessage());
            return "redirect:/support/qna/" + qIdx;
        }
    }

 // ✅ 문의 수정 폼 (로그인 + 내 글만)
    @GetMapping("/qna/{qIdx}/edit")
    public String qnaEditForm(
            @PathVariable Integer qIdx,
            HttpSession session,
            Model model,
            RedirectAttributes ra
    ) {
        Member loginMember = (Member) session.getAttribute("loginMember");
        if (loginMember == null) {
            ra.addFlashAttribute("msg", "로그인 후 이용 가능합니다.");
            return "redirect:/members/login";
        }

        try {
            model.addAttribute("qna", supportService.getMyQnaEditView(qIdx, loginMember.getMIdx()));
            return "support/qnaEdit";
        } catch (Exception e) {
            ra.addFlashAttribute("msg", e.getMessage());
            return "redirect:/support/qna/" + qIdx;
        }
    }

    // ✅ 문의 수정 처리 (POST)
    @PostMapping("/qna/{qIdx}/edit")
    public String qnaEditSubmit(
            @PathVariable Integer qIdx,
            @RequestParam String qTitle,
            @RequestParam String qCont,
            HttpSession session,
            RedirectAttributes ra
    ) {
        Member loginMember = (Member) session.getAttribute("loginMember");
        if (loginMember == null) {
            ra.addFlashAttribute("msg", "로그인 후 이용 가능합니다.");
            return "redirect:/members/login";
        }

        try {
            supportService.updateMyQna(qIdx, loginMember.getMIdx(), qTitle, qCont);
            ra.addFlashAttribute("msg", "문의가 수정되었습니다.");
            return "redirect:/support/qna/" + qIdx;
        } catch (Exception e) {
            ra.addFlashAttribute("msg", "수정에 실패했습니다: " + e.getMessage());
            return "redirect:/support/qna/" + qIdx + "/edit";
        }
    }

    @GetMapping("/faq")
    public String faq(Model model) {
        model.addAttribute("faqList", boardService.listFaqs());
        return "support/faq";
    }

    // ✅ 사용자 FAQ 상세
    @GetMapping("/faq/{bIdx}")
    public String faqDetail(@PathVariable Integer bIdx, Model model) {
        model.addAttribute("faq", boardService.getFaqDetail(bIdx));
        return "support/faqDetail";
    }


}
