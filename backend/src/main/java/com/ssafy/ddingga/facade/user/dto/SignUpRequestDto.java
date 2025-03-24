package com.ssafy.ddingga.facade.user.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class SignUpRequestDto {
    private String userId;
    private String password;
    private String username;
}
