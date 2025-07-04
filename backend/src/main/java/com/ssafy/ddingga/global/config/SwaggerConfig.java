package com.ssafy.ddingga.global.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;

@Configuration
public class SwaggerConfig {

	@Bean
	public OpenAPI openAPI() {
		Info info = new Info()
			.title("띵가 프로젝트 API Document")
			.version("v0.0.1")
			.description("띵가 프로젝트의 API 명세서입니다.");

		// JWT SecurityScheme 설정
		SecurityScheme securityScheme = new SecurityScheme()
			.type(SecurityScheme.Type.HTTP)
			.scheme("bearer")
			.bearerFormat("JWT")
			.in(SecurityScheme.In.HEADER)
			.name("Authorization");

		SecurityRequirement securityRequirement = new SecurityRequirement().addList("bearerAuth");

		return new OpenAPI()
			.info(info)
			// 서버 정보 추가
			.servers(List.of(
				new Server().url("https://j12d105.p.ssafy.io/").description("EC2 Server"),
				new Server().url("http://localhost:8090").description("Local Server")
					.description("Production server (HTTPS)")))
			.addSecurityItem(securityRequirement)
			.components(new Components()
				.addSecuritySchemes("bearerAuth", securityScheme));
	}
} 