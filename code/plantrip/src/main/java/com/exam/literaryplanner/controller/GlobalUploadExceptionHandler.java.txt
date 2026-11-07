package com.exam.literaryplanner.controller;

import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.multipart.MultipartException;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import jakarta.servlet.http.HttpServletRequest;

/**
 * 사진 업로드 시(용량/요청 크기 초과 등) 브라우저에서 ERR_CONNECTION_RESET 처럼 보이는 상황을 방지하기 위한 공통 처리.
 * - 로직(기존 컨트롤러/서비스)에는 손대지 않고, 예외만 "작성 페이지로" 안전하게 되돌림.
 */
@ControllerAdvice
public class GlobalUploadExceptionHandler {

    @ExceptionHandler({ MaxUploadSizeExceededException.class, MultipartException.class })
    public String handleMultipartException(Exception ex,
                                           HttpServletRequest request,
                                           RedirectAttributes ra) {
        // 사용자가 이해하기 쉬운 안내 문구만 노출
        ra.addFlashAttribute("msg", "사진 용량이 너무 크거나 업로드 요청이 실패했습니다. (사진 크기/개수를 줄여서 다시 시도해 주세요)");

        // 가능하면 이전 페이지로, 없으면 후기 작성으로
        String referer = request.getHeader("Referer");
        if (referer != null && !referer.isBlank()) {
            return "redirect:" + referer;
        }
        return "redirect:/community/write";
    }
}
