package com.ssafy.ddingga.facade.user.dto;


import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class LoginResponseDto {
    private String username;
    private String accessToken;
    private String refreshToken;
}
