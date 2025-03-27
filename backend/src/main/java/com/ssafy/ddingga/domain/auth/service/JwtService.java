package com.ssafy.ddingga.domain.auth.service;

import com.ssafy.ddingga.domain.auth.entity.AuthProvider;
import com.ssafy.ddingga.domain.auth.entity.User;
import com.ssafy.ddingga.facade.auth.dto.response.TokenResponseDto;

public interface JwtService {
	TokenResponseDto issueToken(User user);

	TokenResponseDto issueToken(User user, AuthProvider provider);

	TokenResponseDto refreshToken(String refreshToken);

	/**
	 * 리프레시 토큰을 무효화하여 로그아웃 처리
	 * @param loginID 사용자 ID
	 */
	void invalidateRefreshToken(String loginID);

}

