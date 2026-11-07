package com.exam.literaryplanner.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    SecurityFilterChain filterChain(HttpSecurity http,
                                    OAuth2LoginSuccessHandler successHandler) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // ✅ 개발 중 403(POST) 방지

            .authorizeHttpRequests(auth -> auth
                .requestMatchers(
                    "/", "/css/**", "/js/**", "/images/**", "/img/**", "/favicon.ico",
                    "/members/**",
                    "/plan/**",
                    "/oauth2/**", "/login/oauth2/**"
                ).permitAll()
                .anyRequest().permitAll()
            )

            .oauth2Login(o -> o.successHandler(successHandler))
            .formLogin(form -> form.disable())
            .httpBasic(basic -> basic.disable());

        return http.build();
    }
}
