package com.ssafy.ddingga.global.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;
import java.nio.file.Paths;


@Configuration
public class FileConfig implements WebMvcConfigurer {
    /**
     * application.yml에 설정한 업로드 디렉토리 경로를 주입받음
     */
    @Value("${spring.file.upload-dir")
    private String uploadDir;

    /**
     * 업로드된 파일에 대한 URL 매핑을 설정함
     * /uploads/** 경로로 들어오는 요청을 실제 파일 시스템의 업로드 디렉토리로 연결
     */
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        Path uploadPath = Paths.get(uploadDir);
        String uploadAbsolutePath = uploadPath.toFile().getAbsolutePath(); // 상대경로를 절대경로로 변환

        registry.addResourceHandler("/uploads/**") //웹에서 접근할 URL 패턴 설정
                .addResourceLocations("file:" + uploadAbsolutePath+"/");
    }
}
