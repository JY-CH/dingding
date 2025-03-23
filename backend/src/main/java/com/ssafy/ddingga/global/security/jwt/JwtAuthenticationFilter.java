package com.ssafy.ddingga.global.security.jwt;


import com.ssafy.ddingga.domain.user.repository.UserRepository;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * JWT 인증 필터
 * 모든 요청에 대해 JWT 토큰을 검증하고 인증 정보를 설정
 */
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final JwtTokenProvider jwtTokenProvider;
    private final UserRepository userRepository;
    private final JwtProperties jwtProperties;

    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        try {
            logger.debug("Request URI: {}", request.getRequestURI());
            logger.debug("Content-Type: {}", request.getContentType());
            logger.debug("Authorization header: {}", request.getHeader("Authorization"));
            String token = extractJwtFromRequest(request);

            if (!StringUtils.hasText(token)) {
                logger.warn("JWT 토큰이 없습니다");
                filterChain.doFilter(request, response);
                return;
            }

            if (!jwtTokenProvider.validateToken(token)) {
                logger.warn("유효하지 않은 JWT 토큰입니다");
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                return;
            }

            String userId = jwtTokenProvider.getUserId(token);
            userRepository.findByUserId(userId)
                    .ifPresentOrElse(
                            user -> {
                                UsernamePasswordAuthenticationToken authentication =
                                        new UsernamePasswordAuthenticationToken(
                                                user,
                                                null,
                                                user.getAuthorities()
                                        );
                                SecurityContextHolder.getContext().setAuthentication(authentication);
                            },
                            () -> {
                                logger.warn("사용자를 찾을 수 없습니다: {}", userId);
                                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                            }
                    );

            filterChain.doFilter(request, response);
        } catch (Exception e) {
            logger.error("JWT 인증 처리 중 오류 발생: {}", e.getMessage());
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            filterChain.doFilter(request, response);
        }
    }

    private String extractJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader(jwtProperties.getHeaderString());
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith(jwtProperties.getTokenPrefix())) {
            return bearerToken.substring(jwtProperties.getTokenPrefix().length());
        }
        return null;
    }
}
