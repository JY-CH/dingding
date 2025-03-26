package com.ssafy.ddingga.global.security.jwt;

import java.io.IOException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import com.ssafy.ddingga.domain.auth.repository.UserRepository;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

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

			if (StringUtils.hasText(token) && jwtTokenProvider.validateToken(token)) {
				String loginId = jwtTokenProvider.getLoginId(token);

				userRepository.findByLoginId(loginId)
					.ifPresent(user -> {
						UsernamePasswordAuthenticationToken authentication =
							new UsernamePasswordAuthenticationToken(
								user,
								null,
								user.getAuthorities()
							);
						SecurityContextHolder.getContext().setAuthentication(authentication);
					});
			}
		} catch (Exception e) {
			logger.error("JWT 인증 처리 오류 중 발생: {}", e.getMessage());
		}
		filterChain.doFilter(request, response);
	}

	private String extractJwtFromRequest(HttpServletRequest request) {
		String bearerToken = request.getHeader(jwtProperties.getHeaderString());
		if (StringUtils.hasText(bearerToken) && bearerToken.startsWith(jwtProperties.getTokenPrefix())) {
			return bearerToken.substring(jwtProperties.getTokenPrefix().length());
		}
		return null;
	}
}
