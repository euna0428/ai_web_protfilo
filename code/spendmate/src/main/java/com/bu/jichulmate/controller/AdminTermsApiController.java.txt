package com.bu.jichulmate.controller;

import com.bu.jichulmate.domain.User;
import com.bu.jichulmate.dto.admin.TermsRequest;
import com.bu.jichulmate.dto.terms.TermsResponse;
import com.bu.jichulmate.service.AdminTermsService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/terms")
public class AdminTermsApiController {

    private final AdminTermsService adminTermsService;

    @GetMapping
    public List<TermsResponse> getAllTerms() {
        return adminTermsService.getAllTerms();
    }

    @PostMapping
    public ResponseEntity<TermsResponse> createNewVersion(
            @RequestBody TermsRequest request,
            HttpSession session, // ★ @AuthenticationPrincipal 지우고 HttpSession 추가!
            HttpServletRequest httpRequest) {

        // ★ SessionUtils에 저장된 키값 "loginUser"로 실제 관리자 엔티티를 꺼내옵니다.
        User admin = (User) session.getAttribute("loginUser");

        String ipAddress = httpRequest.getRemoteAddr();
        return ResponseEntity.ok(adminTermsService.createNewVersion(request, admin, ipAddress));
    }

    @PutMapping("/{termId}")
    public ResponseEntity<TermsResponse> updateTerms(
            @PathVariable("termId") Long termId,
            @RequestBody TermsRequest request,
            HttpSession session,
            HttpServletRequest httpRequest) {

        User admin = (User) session.getAttribute("loginUser");
        String ipAddress = httpRequest.getRemoteAddr();

        return ResponseEntity.ok(adminTermsService.updateTerms(termId, request, admin, ipAddress));
    }

}
