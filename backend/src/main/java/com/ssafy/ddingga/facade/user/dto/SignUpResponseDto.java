package com.ssafy.ddingga.facade.user.dto;

import com.ssafy.ddingga.domain.user.entity.User;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class SignUpResponseDto {
    private String userId;
    private String username;
    private String accessToken;
    private String refreshToken;

    public static SignUpResponseDto from(User user, String accessToken) {
        return SignUpResponseDto.builder()
                .userId(user.getUserId())
                .username(user.getUsername())
                .accessToken(accessToken)
                .build();
    }
}
