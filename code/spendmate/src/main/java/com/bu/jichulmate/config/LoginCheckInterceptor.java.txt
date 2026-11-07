package com.bu.jichulmate.config;



import com.bu.jichulmate.util.SessionUtils;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.HandlerInterceptor;

@Configuration
public class LoginCheckInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(
            HttpServletRequest request,
            HttpServletResponse response,
            Object handler
    ) throws Exception {

        HttpSession session = request.getSession(false);

        if (session != null && SessionUtils.isLoggedIn(session)) {
            return true;
        }

        String requestUri = request.getRequestURI();
        String contextPath = request.getContextPath();

        boolean ajaxRequest = "XMLHttpRequest".equals(request.getHeader("X-Requested-With"))
                || request.getHeader("Accept") != null
                && request.getHeader("Accept").contains("application/json");

        if (ajaxRequest) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json;charset=UTF-8");
            response.getWriter().write("{\"ok\":false,\"message\":\"로그인이 필요합니다.\"}");
            return false;
        }

        response.sendRedirect(contextPath + "/?loginRequired=true&redirect=" + requestUri);
        return false;
    }
}