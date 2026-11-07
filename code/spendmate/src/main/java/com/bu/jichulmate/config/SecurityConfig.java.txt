package com.bu.jichulmate.config;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    /**
     * 비밀번호 암호화
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * 현재 프로젝트는 AuthApiController에서 직접 세션 로그인 처리
     * 따라서 Spring Security의 기본 formLogin은 비활성화한다.
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())

                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/",
                                "/index",
                                "/css/**",
                                "/js/**",
                                "/images/**",
                                "/img/**",
                                "/favicon.ico",

                                "/auth/login",
                                "/auth/logout",
                                "/auth/register",
                                "/auth/find-password",
                                "/auth/password/reset",

                                "/api/auth/**",
                                "/api/terms/**",

                                "/support",
                                "/support/type",
                                "/support/api/faqs/**",

                                "/oauth2/**",
                                "/login/oauth2/**"
                        ).permitAll()

                        /*
                         * 페이지 접근 제어는 WebConfig의 LoginCheckInterceptor에서 처리한다.
                         * 여기서는 일단 전체 요청을 허용해서 JSP 라우팅 충돌을 줄인다.
                         */
                        .anyRequest().permitAll()
                )

                .formLogin(form -> form.disable())
                .httpBasic(basic -> basic.disable())

                .logout(logout -> logout
                        .logoutUrl("/auth/logout")
                        .invalidateHttpSession(true)
                        .clearAuthentication(true)
                        .deleteCookies("JSESSIONID", "remember-me")
                        .logoutSuccessHandler((request, response, authentication) -> {
                            response.setStatus(HttpServletResponse.SC_OK);
                            response.setContentType("application/json;charset=UTF-8");
                            response.getWriter().write("{\"ok\":true,\"message\":\"로그아웃되었습니다.\"}");
                        })
                )

                .oauth2Login(oauth2 -> oauth2
                        .loginPage("/")
                        .defaultSuccessUrl("/?oauthLogin=success", true)
                        .failureUrl("/?loginError=true")
                );

        return http.build();
    }
}