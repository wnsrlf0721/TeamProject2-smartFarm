package com.nova.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 1. 사용할 물리적 경로 (프로젝트 내 src/main/resources/static/img 폴더)
        String path = "file:///" + System.getProperty("user.dir") + "/src/main/resources/static/img/";

        // 2. "/img/**"로 접근하면 위 경로에서 파일을 찾음
        registry.addResourceHandler("/img/**")
                .addResourceLocations(path);
    }
}