package com.bu.jichulmate.service;

import com.bu.jichulmate.domain.Terms;
import com.bu.jichulmate.domain.TermsType;
import com.bu.jichulmate.dto.terms.TermsResponse;
import com.bu.jichulmate.dto.terms.TermsSignupResponse;
import com.bu.jichulmate.repository.TermsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TermsService {

    private final TermsRepository termsRepository;

    public TermsSignupResponse getSignupTerms() {
        List<Terms> latestTerms = getLatestTermsForSignup();

        List<TermsResponse> termsResponses = latestTerms.stream()
                .map(TermsResponse::from)
                .sorted(Comparator.comparingInt(TermsResponse::getDisplayOrder))
                .toList();

        List<String> requiredTermTypes = latestTerms.stream()
                .filter(terms -> "Y".equals(terms.getIsRequired()))
                .map(terms -> terms.getTermType().name())
                .toList();

        return new TermsSignupResponse(termsResponses, requiredTermTypes);
    }

    public List<Terms> getLatestTermsForSignup() {
        LocalDateTime now = LocalDateTime.now();
        List<Terms> result = new ArrayList<>();

        for (TermsType type : TermsType.values()) {
            termsRepository
                    .findFirstByTermTypeAndApplyDateLessThanEqualOrderByApplyDateDescTermIdDesc(type, now)
                    .ifPresent(result::add);
        }

        return result.stream()
                .sorted(Comparator.comparingInt(terms -> terms.getTermType().getDisplayOrder()))
                .toList();
    }

    public List<Terms> findAgreedTerms(List<Long> agreedTermIds) {
        if (agreedTermIds == null || agreedTermIds.isEmpty()) {
            return List.of();
        }

        return termsRepository.findByTermIdIn(agreedTermIds);
    }
}
