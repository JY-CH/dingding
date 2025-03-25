package com.ssafy.ddingga.facade.user.dto.request;


import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.annotation.JsonIgnore;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Schema(description = "회원 정보 수정 요청 DTO")
public class UserUpdateRequestDto {

    @Schema(description = "변경할 사용자 이름", example = "새로운이름") // swagger 때문에 적은것
    private String username;

    @Schema(
            description = "프로필 이미지 파일",
            type = "string",
            format = "binary",
            example = "image/jpeg"
    ) // swagger 때문에 적은것 실제 기능과 관련 x
    @JsonIgnore
    private MultipartFile profileImage;
}
