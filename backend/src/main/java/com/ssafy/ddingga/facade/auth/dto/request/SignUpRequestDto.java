package com.ssafy.ddingga.facade.auth.dto.request;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class SignUpRequestDto {
	private String loginId;
	private String password;
	private String username;
}
