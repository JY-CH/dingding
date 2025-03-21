package com.ssafy.ddingga.facade.user.dto;


import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
@NoArgsConstructor
public class UserUpdateRequestDto {
    private String username;

    @JsonIgnore
    private MultipartFile profileImage;
}
