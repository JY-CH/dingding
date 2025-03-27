package com.ssafy.ddingga.facade.auth.dto.request;

import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 토큰 갱신 요청을 위한 DTO
 */
@Getter
@NoArgsConstructor
public class RefreshTokenRequestDto {
	private String refreshToken;
} 