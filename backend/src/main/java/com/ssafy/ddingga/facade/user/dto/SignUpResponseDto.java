package com.ssafy.ddingga.facade.user.dto;

import com.ssafy.ddingga.domain.user.entity.User;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class SignUpResponseDto {
    private String userId;
    private String username;

    public static SignUpResponseDto from(User user, TokenResponseDto tokens) {
        return SignUpResponseDto.builder()
                .userId(user.getUserId())
                .username(user.getUsername())
                .build();
    }
}
