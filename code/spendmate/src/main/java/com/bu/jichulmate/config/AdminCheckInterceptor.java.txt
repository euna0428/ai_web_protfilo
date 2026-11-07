package com.bu.jichulmate.config;

import com.bu.jichulmate.util.SessionUtils;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Slf4j
@Component
public class AdminCheckInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        HttpSession session = request.getSession(false);


        if (!SessionUtils.isAdmin(session)) {
            log.warn("[보안 경고] 관리자 권한이 없는 사용자의 접근 시도: {}", request.getRequestURI());


            response.sendError(HttpServletResponse.SC_FORBIDDEN, "관리자 권한이 필요합니다.");
            return false;
        }

        return true;
    }
}