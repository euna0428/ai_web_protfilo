package com.bu.jichulmate.controller;

import com.bu.jichulmate.dto.terms.TermsSignupResponse;
import com.bu.jichulmate.service.TermsService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/terms")
public class TermsApiController {

    private final TermsService termsService;

    @GetMapping("/signup")
    public TermsSignupResponse getSignupTerms() {
        return termsService.getSignupTerms();
    }
}
