package com.ssafy.ddingga.facade.auth.dto.response;

import com.ssafy.ddingga.domain.auth.entity.User;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class SignUpResponseDto {
	private String loginId;
	private String username;

	public static SignUpResponseDto from(User user, TokenResponseDto tokens) {
		return SignUpResponseDto.builder()
			.loginId(user.getLoginId())
			.username(user.getUsername())
			.build();
	}
}
