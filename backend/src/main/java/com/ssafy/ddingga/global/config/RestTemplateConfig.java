package com.ssafy.ddingga.global.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

//HTTP 클라이언트를 설정하는 클래스이므로, 만약 애플리케이션에서 REST API 호출할 때 사용
@Configuration
public class RestTemplateConfig {

	@Bean
	public RestTemplate restTemplate() {
		return new RestTemplate();
	}

}
