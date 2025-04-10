package com.ssafy.ddingga.facade.auth.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class AuthDeleteResponseDto {
	private String message;
	private String loginId;
}
