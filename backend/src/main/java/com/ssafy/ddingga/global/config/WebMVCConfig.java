package com.ssafy.ddingga.global.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMVCConfig implements WebMvcConfigurer {

	@Override
	public void addCorsMappings(CorsRegistry registry) {
		registry.addMapping("/**")
			.allowedOrigins(
				"https://j12d105.p.ssafy.io",
				"http://j12d105.p.ssafy.io",
				"http://localhost:8080",
				"http://localhost:8090"
			)
			.allowedHeaders("*")
			.allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS") // 허용할 HTTP 메서드
			.allowCredentials(true)
			.exposedHeaders("Authorization")
			.maxAge(3600);
	}
}
