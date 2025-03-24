package com.ssafy.ddingga.facade.user.dto;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class UserDeleteResponseDto {
    private String message;
    private String userId;
}
