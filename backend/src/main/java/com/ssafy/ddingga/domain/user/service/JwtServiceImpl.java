package com.ssafy.ddingga.domain.user.service;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import com.ssafy.ddingga.domain.user.entity.AuthProvider;
import com.ssafy.ddingga.domain.user.entity.User;
import com.ssafy.ddingga.domain.user.entity.UserSocial;
import com.ssafy.ddingga.domain.user.repository.UserRepository;
import com.ssafy.ddingga.domain.user.repository.UserSocialRepository;
import com.ssafy.ddingga.facade.user.dto.response.TokenResponseDto;
import com.ssafy.ddingga.global.error.exception.InvalidTokenException;
import com.ssafy.ddingga.global.error.exception.TokenExpiredException;
import com.ssafy.ddingga.global.error.exception.UserNotFoundException;
import com.ssafy.ddingga.global.error.exception.UserSocialNotfoundException;
import com.ssafy.ddingga.global.security.jwt.JwtProperties;
import com.ssafy.ddingga.global.security.jwt.JwtTokenProvider;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

/**
 * JWT (Json Web Token) 관련 서비스 구현체
 * 토큰 생성, 검증, 파싱의 기능을 제공
 */
@Service
@RequiredArgsConstructor
public class JwtServiceImpl implements JwtService {

	private final JwtTokenProvider jwtTokenProvider;
	private final UserRepository userRepository;
	private final UserSocialRepository userSocialRepository;
	private final JwtProperties jwtProperties;

	@Override
	@Transactional
	public TokenResponseDto issueToken(User user) {
		return issueToken(user, AuthProvider.LOCAL);
	}

	@Override
	public TokenResponseDto issueToken(User user, AuthProvider provider) {
		String accessToken = jwtTokenProvider.createAccessToken(user);
		String refreshToken = jwtTokenProvider.createRefreshToken(user);

		// refresh 토큰 만료시간 계산
		LocalDateTime tokenExpiryDate = LocalDateTime.now()
			.plusSeconds(jwtProperties.getRefreshTokenExpiration());

		// 기존 소셜 정보 찾기
		// 사용자가 이미 로그인 한 적이 있는지 확인한다는뜻
		// 소셜로그인은 차후 구현할 예정이지만 확장성을 위해 컬럼존재
		UserSocial userSocial = userSocialRepository.findByUser(user)
			.orElse(UserSocial.builder()
				.user(user)
				.provider(provider)
				.providerId(provider == AuthProvider.LOCAL ? user.getLoginId() : null)
				.build());

		// 리프레시토큰 업데이트
		userSocial.setRefreshToken(refreshToken);
		userSocial.setTokenExpiryDate(tokenExpiryDate);
		userSocialRepository.save(userSocial);

		return new TokenResponseDto(accessToken, refreshToken);
	}

	/**
	 * 토큰 만료일 갱신역할
	 */
	@Override
	@Transactional
	public TokenResponseDto refreshToken(String refreshToken) {
		UserSocial userSocial = userSocialRepository.findByRefreshToken(refreshToken)
			.orElseThrow(() -> new InvalidTokenException("유효하지 않은 리프레시 토큰입니다."));

		if (userSocial.getTokenExpiryDate().isBefore(LocalDateTime.now())) {
			throw new TokenExpiredException("리프레시 토큰이 만료되었습니다.");
		}

		User user = userSocial.getUser();

		// 새 토큰 발급

		String newAccessToken = jwtTokenProvider.createAccessToken(user);
		String newRefreshToken = jwtTokenProvider.createRefreshToken(user);

		LocalDateTime tokenExpirationDate = LocalDateTime.now()
			.plusSeconds(jwtProperties.getRefreshTokenExpiration());
		userSocial.setRefreshToken(newRefreshToken);
		userSocial.setTokenExpiryDate(tokenExpirationDate);
		userSocialRepository.save(userSocial);

		return new TokenResponseDto(newAccessToken, newRefreshToken);

	}

	@Override
	@Transactional
	public void invalidateRefreshToken(String loginId) {
		// 사용자 ID로 유저 객체 조회
		User user = userRepository.findByLoginId(loginId)
			.orElseThrow(() -> new UserNotFoundException("사용자가 존재하지 않습니다"));

		// 사용자의 리프레시토큰 조회
		UserSocial userSocial = userSocialRepository.findByUser(user)
			.orElseThrow(() -> new UserSocialNotfoundException("사용자 인증 정보가 존재하지 않습니다"));

		//리프레시 토큰 무효화(null로 설정)
		userSocial.setRefreshToken(null);
		userSocial.setTokenExpiryDate(null);
		userSocialRepository.save(userSocial);
	}
}
