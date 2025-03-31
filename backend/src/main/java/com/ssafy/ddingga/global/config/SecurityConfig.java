package com.ssafy.ddingga.global.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.ssafy.ddingga.global.security.jwt.JwtAuthenticationFilter;

// config 파일입니다 선언 하는 아노테이션!
@Configuration
// WebSecurity 활성화 아노테이션
@EnableWebSecurity
public class SecurityConfig {
	@Bean
	public SecurityFilterChain filterChain(HttpSecurity http, JwtAuthenticationFilter jwtAuthenticationFilter) throws
		Exception {

		http
			.cors(cors -> cors.configure(http))
			.csrf(csrf -> csrf.disable())

			.authorizeHttpRequests((auth) -> auth
				.requestMatchers(
					HttpMethod.OPTIONS,
					"/v3/api-docs/**",
					"/swagger-ui/**",
					"/swagger-ui.html",
					"/swagger-resources/**",
					"/webjars/**"
				).permitAll()
				.requestMatchers(
					"/api/auth/signup",
					"/api/auth/login",
					"/api/auth/refresh"
				).permitAll()
				.requestMatchers(HttpMethod.GET, "/api/article", "/api/article/**").permitAll()  // GET 요청만 허용
				.anyRequest().authenticated()
			);
		http
			.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
		http
			.sessionManagement(session -> session
				.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

		return http.build();
	}

	// 비밀번호 암호화
	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}
}
