package com.ssafy.ddingga.global.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.ssafy.ddingga.global.security.jwt.JwtAuthenticationFilter;

import jakarta.servlet.http.HttpServletResponse;

// config 파일입니다 선언 하는 아노테이션!
@Configuration
// WebSecurity 활성화 아노테이션
@EnableWebSecurity
public class SecurityConfig {
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http, JwtAuthenticationFilter jwtAuthenticationFilter) throws Exception {

        http
                .authorizeHttpRequests((auth) -> auth
                        .requestMatchers("/v3/api-docs/**", "/swagger-ui/**","/swagger-ui.html", "/swagger-resources/**").permitAll()
                        .requestMatchers("/api/auth/signup","/api/auth/login").permitAll() // 회원가입과 로그인 외 모든 동작에서 인증필요
                        .anyRequest().authenticated()
                );
        http
                .csrf((auth) -> auth.disable());
        http
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                .exceptionHandling(exceptionHandling -> exceptionHandling
                        .authenticationEntryPoint((request, response, authException) -> {
                            if (request.getRequestURI().startsWith("/swagger-ui") || 
                                request.getRequestURI().startsWith("/v3/api-docs") ||
                                request.getRequestURI().startsWith("/swagger-resources")) {
                                response.setStatus(HttpServletResponse.SC_OK);
                            } else {
                                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                            }
                        }));
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
