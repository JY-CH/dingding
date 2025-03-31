package com.ssafy.ddingga.global.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMVCConfig implements WebMvcConfigurer {

	@Value("${spring.profiles.active}")
	private String activeProfile;

	@Override
	public void addCorsMappings(CorsRegistry registry) {
		registry.addMapping("/**")
			.allowedOrigins(getAllowedOrigins())
			.allowedHeaders("*")
			.allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS") // 허용할 HTTP 메서드
			.allowCredentials(true)
			.exposedHeaders("Authorization")
			.maxAge(3600);
	}

	private String[] getAllowedOrigins() {
		if ("dev".equals(activeProfile)) {
			return new String[]{
				"http://localhost:5173",
				"http://localhost:8080",
				"http://localhost:8090"
			};
		} else {
			return new String[]{
				"https://j12d105.p.ssafy.io",
				"http://j12d105.p.ssafy.io"
			};
		}
	}
}
