package com.ssafy.ddingga.facade.user.dto;


import com.ssafy.ddingga.domain.user.entity.User;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UserUpdateResponseDto {
    private String username;
    private String profileImage;

    //Entity를 DTO로 변환하는 정적 팩토리 메서드
    public static UserUpdateResponseDto from(User user) {
        return UserUpdateResponseDto.builder()
                .username(user.getUsername())
                .profileImage(user.getProfileImage())
                .build();
    }
}
