package com.exam.literaryplanner.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.exam.literaryplanner.domain.Member;
import com.exam.literaryplanner.domain.Qna;
import com.exam.literaryplanner.repository.QnaRepository;

@Service
@Transactional
public class SupportService {

    private final QnaRepository qnaRepository;

    public SupportService(QnaRepository qnaRepository) {
        this.qnaRepository = qnaRepository;
    }

    @Transactional(readOnly = true)
    public List<Qna> myQnaList(Integer mIdx) {
        return qnaRepository.findQnaByMemberId(mIdx);
    }

    public Qna createQna(Member loginMember, String qTitle, String qCont) {
        Qna q = new Qna();
        q.setMember(loginMember);
        q.setQTitle(qTitle);
        q.setQCont(qCont);
        q.setQStatus(0);

        q.setQRegDate(java.time.LocalDateTime.now());

        return qnaRepository.save(q);
    }

    @Transactional(readOnly = true)
    public Qna getMyQnaDetail(Integer qIdx, Integer mIdx) {
        Qna q = qnaRepository.findById(qIdx)
                .orElseThrow(() -> new IllegalArgumentException("문의가 없습니다."));

        if (!q.getMember().getMIdx().equals(mIdx)) {
            throw new IllegalStateException("권한이 없습니다.");
        }
        return q;
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> myQnaViewList(Integer mIdx) {

        List<Qna> list =
            qnaRepository.findQnaByMemberId(mIdx);

        List<Map<String, Object>> out = new ArrayList<>();

        for (Qna q : list) {
            Map<String, Object> row = new HashMap<>();

            row.put("qIdx", q.getQIdx());
            row.put("qTitle", q.getQTitle());
            row.put("qRegDate", q.getQRegDate());

            Integer status = q.getQStatus();
            row.put("qStatus", status);
            row.put("qStatusLabel", (status != null && status == 0) ? "대기" : "완료");

            out.add(row);
        }

        return out;
    }


    @Transactional(readOnly = true)
    public Map<String, Object> getMyQnaDetailView(Integer qIdx, Integer mIdx) {
        Qna q = qnaRepository.findById(qIdx)
                .orElseThrow(() -> new IllegalArgumentException("문의가 없습니다."));

        if (!q.getMember().getMIdx().equals(mIdx)) {
            throw new IllegalStateException("권한이 없습니다.");
        }

        Map<String, Object> v = new HashMap<>();
        v.put("qIdx", q.getQIdx());
        v.put("qTitle", q.getQTitle());
        v.put("qCont", q.getQCont());
        v.put("qAnswer", q.getQAnswer());
        v.put("qRegDate", q.getQRegDate());

        Integer status = q.getQStatus();
        v.put("qStatus", status);
        v.put("qStatusLabel", (status != null && status == 0) ? "대기" : "완료");

        return v;
    }

    @Transactional
    public void deleteMyQna(Integer qIdx, Integer mIdx) {
        Qna q = qnaRepository.findById(qIdx)
                .orElseThrow(() -> new IllegalArgumentException("문의가 없습니다."));
        if (!q.getMember().getMIdx().equals(mIdx)) {
            throw new IllegalStateException("권한이 없습니다.");
        }
        qnaRepository.delete(q);
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getMyQnaEditView(Integer qIdx, Integer mIdx) {
        Qna q = qnaRepository.findById(qIdx)
                .orElseThrow(() -> new IllegalArgumentException("문의가 없습니다."));

        if (!q.getMember().getMIdx().equals(mIdx)) {
            throw new IllegalStateException("권한이 없습니다.");
        }

        // 선택 정책: 답변 완료면 수정 금지(원하면 주석 해제)
        // if (q.getQStatus() != null && q.getQStatus() == 1) {
        //     throw new IllegalStateException("답변 완료된 문의는 수정할 수 없습니다.");
        // }

        Map<String, Object> v = new HashMap<>();
        v.put("qIdx", q.getQIdx());
        v.put("qTitle", q.getQTitle());
        v.put("qCont", q.getQCont());

        Integer status = q.getQStatus();
        v.put("qStatus", status);
        v.put("qStatusLabel", (status != null && status == 0) ? "대기" : "완료");
        return v;
    }

    @Transactional
    public void updateMyQna(Integer qIdx, Integer mIdx, String qTitle, String qCont) {
        Qna q = qnaRepository.findById(qIdx)
                .orElseThrow(() -> new IllegalArgumentException("문의가 없습니다."));

        if (!q.getMember().getMIdx().equals(mIdx)) {
            throw new IllegalStateException("권한이 없습니다.");
        }

        // 선택 정책: 답변 완료면 수정 금지(원하면 주석 해제)
        // if (q.getQStatus() != null && q.getQStatus() == 1) {
        //     throw new IllegalStateException("답변 완료된 문의는 수정할 수 없습니다.");
        // }

        q.setQTitle(qTitle);
        q.setQCont(qCont);
        // save 호출 없어도 @Transactional이면 dirty checking으로 업데이트 됨
    }

}
