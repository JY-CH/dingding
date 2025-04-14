package com.ssafy.ddingga.facade.example.dto;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ExamplePostRequestDto {

    private String description;

    private Integer integerId;

}
