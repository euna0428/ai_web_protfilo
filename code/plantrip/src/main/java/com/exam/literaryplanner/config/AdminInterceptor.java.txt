package com.exam.literaryplanner.config;

import org.springframework.web.servlet.HandlerInterceptor;

import com.exam.literaryplanner.domain.Member;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

public class AdminInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request,
                             HttpServletResponse response,
                             Object handler) throws Exception {

        HttpSession session = request.getSession(false);
        Member loginMember = (session == null) ? null : (Member) session.getAttribute("loginMember");

        // 로그인 안함 or 관리자 아님(9가 아님)
        if (loginMember == null || loginMember.getMRole() != 9) {
            response.sendRedirect("/members/login?admin=forbidden");
            return false;
        }
        return true;
    }
}
