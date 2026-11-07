package com.bu.jichulmate.config;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;

@Configuration
@RequiredArgsConstructor
public class WebConfig implements WebMvcConfigurer {

    @Value("${file.upload.dir}")
    private String uploadDir;

    private final AdminCheckInterceptor adminCheckInterceptor;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {


        registry.addResourceHandler("/css/**")
                .addResourceLocations("classpath:/static/css/");

        registry.addResourceHandler("/js/**")
                .addResourceLocations("classpath:/static/js/");


        registry.addResourceHandler("/images/**")
                .addResourceLocations(
                        "file:///" + uploadDir,
                        "classpath:/static/images/"
                );


        registry.addResourceHandler("/img/**")
                .addResourceLocations("classpath:/static/img/");


        registry.addResourceHandler("/favicon.ico")
                .addResourceLocations("classpath:/static/");
    }


    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new LoginCheckInterceptor())
                .addPathPatterns(
                        "/mypage/**",
                        "/expense/**",
                        "/expenses/**",
                        "/dashboard/**",
                        "/goal/**",
                        "/subscription/**",
                        "/subscriptions/**",
                        "/party/**",
                        "/community/write",
                        "/community/edit/**",
                        "/community/delete/**",
                        "/community/my",

                        "/support/qna/**",
                        "/ai/**",
                        "/mentor/**"
                )
                .excludePathPatterns(
                        "/",
                        "/index",
                        "/auth/**",
                        "/api/auth/**",
                        "/api/terms/**",
                        "/css/**",
                        "/js/**",
                        "/images/**",
                        "/img/**",
                        "/favicon.ico",
                        "/support",
                        "/support/type",
                        "/support/api/faqs/**",
                        "/subscription/ott"
                );
        //  관리자 페이지 권한 체크 인터셉터
        registry.addInterceptor(adminCheckInterceptor)
                .addPathPatterns("/admin/**", "/api/admin/**");
    }
}