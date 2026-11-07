package com.exam.literaryplanner.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.exam.literaryplanner.domain.Qna;
import com.exam.literaryplanner.repository.QnaRepository;

@Service
public class AdminQnaService {

    private final QnaRepository qnaRepository;

    public AdminQnaService(QnaRepository qnaRepository) {
        this.qnaRepository = qnaRepository;
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> listAllQna() {

        // ✅ 리포지터리 수정 없이 전부 조회
        List<Qna> list = qnaRepository.findAll();

        // ✅ 자바에서 정렬: 대기(0) 먼저, 그 다음 최신순
        list.sort((a, b) -> {
            Integer sa = a.getQStatus();
            Integer sb = b.getQStatus();

            // null이면 대기(0) 취급
            int va = (sa == null ? 0 : sa);
            int vb = (sb == null ? 0 : sb);

            // 1) status 오름차순 (0 대기 -> 1 완료)
            int c1 = Integer.compare(va, vb);
            if (c1 != 0) {
				return c1;
			}

            // 2) regDate 내림차순 (최신 먼저)
            // null 안전 처리
            if (a.getQRegDate() == null && b.getQRegDate() == null) {
				return 0;
			}
            if (a.getQRegDate() == null) {
				return 1;
			}
            if (b.getQRegDate() == null) {
				return -1;
			}
            return b.getQRegDate().compareTo(a.getQRegDate());
        });

        List<Map<String, Object>> out = new ArrayList<>();

        for (Qna q : list) {
            Map<String, Object> v = new HashMap<>();
            v.put("qIdx", q.getQIdx());
            v.put("qTitle", q.getQTitle());
            v.put("qCont", q.getQCont());
            v.put("qAnswer", q.getQAnswer());
            v.put("qRegDate", q.getQRegDate());

            Integer status = q.getQStatus();
            v.put("qStatus", status);
            v.put("qStatusLabel", (status != null && status == 0) ? "대기" : "완료");

            // 작성자 정보 (있으면)
            if (q.getMember() != null) {
                v.put("mIdx", q.getMember().getMIdx());
                v.put("mId", q.getMember().getMId());
                v.put("mName", q.getMember().getMName());
            } else {
                v.put("mIdx", null);
                v.put("mId", "-");
                v.put("mName", "-");
            }

            out.add(v);
        }

        return out;
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getQnaDetail(Integer qIdx) {
        Qna q = qnaRepository.findById(qIdx)
                .orElseThrow(() -> new IllegalArgumentException("문의가 없습니다."));

        Map<String, Object> v = new HashMap<>();
        v.put("qIdx", q.getQIdx());
        v.put("qTitle", q.getQTitle());
        v.put("qCont", q.getQCont());
        v.put("qAnswer", q.getQAnswer());
        v.put("qRegDate", q.getQRegDate());

        Integer status = q.getQStatus();
        v.put("qStatus", status);
        v.put("qStatusLabel", (status != null && status == 0) ? "대기" : "완료");

        if (q.getMember() != null) {
            v.put("mIdx", q.getMember().getMIdx());
            v.put("mId", q.getMember().getMId());
            v.put("mName", q.getMember().getMName());
        } else {
            v.put("mIdx", null);
            v.put("mId", "-");
            v.put("mName", "-");
        }

        return v;
    }

    @Transactional
    public void saveAnswer(Integer qIdx, String qAnswer) {
        Qna q = qnaRepository.findById(qIdx)
                .orElseThrow(() -> new IllegalArgumentException("문의가 없습니다."));

        q.setQAnswer(qAnswer);

        // 답변 저장하면 완료(1)
        q.setQStatus(1);

        qnaRepository.save(q);
    }
}
