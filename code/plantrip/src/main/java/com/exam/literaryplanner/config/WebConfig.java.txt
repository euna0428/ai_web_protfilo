//package com.exam.literaryplanner.config;
//
//import org.springframework.context.annotation.Configuration;
//import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
//import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
//import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
//
//@Configuration
//public class WebConfig implements WebMvcConfigurer {
//
//    @Override
//    public void addInterceptors(InterceptorRegistry registry) {
//        registry.addInterceptor(new AdminInterceptor())
//                .addPathPatterns("/admin/**");
//    }
//
//    // ✅ 외부 컴퓨터에서 /uploads/... 경로로 접속하면 내 프로젝트 안의 uploads 폴더를 보여줌
//    @Override
//    public void addResourceHandlers(ResourceHandlerRegistry registry) {
//        String uploadDir = System.getProperty("user.dir") + "/uploads/";
//        registry.addResourceHandler("/uploads/**")
//                .addResourceLocations("file:" + uploadDir);
//    }
//}
package com.exam.literaryplanner.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new AdminInterceptor())
                .addPathPatterns("/admin/**");
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // ✅ 윈도우 환경에서도 절대 에러가 나지 않도록 슬래시(/)를 완벽하게 보정한 코드입니다.
        String uploadPath = "file:///" + System.getProperty("user.dir").replace("\\", "/") + "/uploads/";
        
        // 🔍 [확인용] 서버를 켤 때 콘솔창에 진짜 연결된 경로가 뜹니다!
        System.out.println("====== 정적 리소스 매핑 경로 ======");
        System.out.println(uploadPath); 
        System.out.println("===================================");

        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(uploadPath);
    }
}