package com.bu.jichulmate.repository;

import com.bu.jichulmate.domain.Terms;
import com.bu.jichulmate.domain.TermsType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface TermsRepository extends JpaRepository<Terms, Long> {

    Optional<Terms> findFirstByTermTypeAndApplyDateLessThanEqualOrderByApplyDateDescTermIdDesc(
            TermsType termType,
            LocalDateTime applyDate
    );

    List<Terms> findByApplyDateLessThanEqualOrderByApplyDateDescTermIdDesc(LocalDateTime applyDate);

    List<Terms> findByTermTypeOrderByApplyDateDescTermIdDesc(TermsType termType);

    List<Terms> findByTermIdIn(Collection<Long> termIds);
}
