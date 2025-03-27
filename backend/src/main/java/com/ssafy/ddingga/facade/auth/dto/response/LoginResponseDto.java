package com.ssafy.ddingga.facade.auth.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class LoginResponseDto {
	private String username;
	private String accessToken;
	private String refreshToken;
}
