package com.ssafy.ddingga.facade.auth.dto.request;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class LoginRequestDto {
	private String loginId;
	private String password;
}
