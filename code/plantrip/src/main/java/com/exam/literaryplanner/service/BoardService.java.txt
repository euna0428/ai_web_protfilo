package com.exam.literaryplanner.service;

import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.stereotype.Service;

import com.exam.literaryplanner.domain.Board;
import com.exam.literaryplanner.repository.BoardRepository;

@Service
public class BoardService {

    private final BoardRepository boardRepository;

    public BoardService(BoardRepository boardRepository) {
        this.boardRepository = boardRepository;
    }

    public List<Board> listNotices() {
        return boardRepository.findByTypeOrdered("NOTICE");
    }

    public Board createNotice(String title, String cont, boolean isTop) {
        Board b = new Board();
        b.setBType("NOTICE");
        b.setBTitle(title);
        b.setBCont(cont);
        b.setBIsTop(isTop ? 1 : 0);
        return boardRepository.save(b);
    }

    public Board getNoticeDetail(Integer bIdx) {
        Board b = boardRepository.findById(bIdx)
                .orElseThrow(() -> new NoSuchElementException("공지사항이 존재하지 않습니다."));

        // NOTICE만 보여주고 싶으면 체크
        if (!"NOTICE".equals(b.getBType())) {
            throw new NoSuchElementException("공지사항이 존재하지 않습니다.");
        }
        return b;
    }

    public Board updateNotice(Integer bIdx, String title, String cont, boolean isTop) {
        Board b = boardRepository.findById(bIdx)
                .orElseThrow(() -> new NoSuchElementException("공지사항이 존재하지 않습니다."));

        if (!"NOTICE".equals(b.getBType())) {
            throw new NoSuchElementException("공지사항이 존재하지 않습니다.");
        }

        b.setBTitle(title);
        b.setBCont(cont);
        b.setBIsTop(isTop ? 1 : 0);

        return boardRepository.save(b);
    }

    public void deleteNotice(Integer bIdx) {
        Board b = boardRepository.findById(bIdx)
                .orElseThrow(() -> new NoSuchElementException("공지사항이 존재하지 않습니다."));

        if (!"NOTICE".equals(b.getBType())) {
            throw new NoSuchElementException("공지사항이 존재하지 않습니다.");
        }

        boardRepository.delete(b);
    }

    public List<Board> listFaqs() {
        return boardRepository.findByTypeOrdered("FAQ");
    }

    public Board createFaq(String title, String cont, boolean isTop) {
        Board b = new Board();
        b.setBType("FAQ");
        b.setBTitle(title);
        b.setBCont(cont);
        b.setBIsTop(isTop ? 1 : 0);
        return boardRepository.save(b);
    }

    public Board getFaqDetail(Integer bIdx) {
        Board b = boardRepository.findById(bIdx)
                .orElseThrow(() -> new NoSuchElementException("FAQ가 존재하지 않습니다."));
        if (!"FAQ".equals(b.getBType())) {
			throw new NoSuchElementException("FAQ가 존재하지 않습니다.");
		}
        return b;
    }

    public Board updateFaq(Integer bIdx, String title, String cont, boolean isTop) {
        Board b = getFaqDetail(bIdx);
        b.setBTitle(title);
        b.setBCont(cont);
        b.setBIsTop(isTop ? 1 : 0);
        return boardRepository.save(b);
    }

    public void deleteFaq(Integer bIdx) {
        Board b = getFaqDetail(bIdx);
        boardRepository.delete(b);
    }
}

