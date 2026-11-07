package com.bu.jichulmate.service;

import com.bu.jichulmate.domain.Terms;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TermsAgreementService {

    private final TermsService termsService;

    public void validateRequiredTerms(List<Long> agreedTermIds) {
        List<Terms> latestTerms = termsService.getLatestTermsForSignup();
        Set<Long> agreedIdSet = agreedTermIds == null
                ? Set.of()
                : new HashSet<>(agreedTermIds);

        List<Terms> requiredTerms = latestTerms.stream()
                .filter(terms -> "Y".equals(terms.getIsRequired()))
                .toList();

        boolean allRequiredAgreed = requiredTerms.stream()
                .allMatch(terms -> agreedIdSet.contains(terms.getTermId()));

        if (!allRequiredAgreed) {
            throw new IllegalArgumentException("필수 이용약관에 모두 동의해야 회원가입을 진행할 수 있습니다.");
        }
    }
}
