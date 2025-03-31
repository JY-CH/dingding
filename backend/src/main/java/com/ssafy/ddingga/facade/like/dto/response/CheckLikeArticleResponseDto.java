package com.ssafy.ddingga.facade.like.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CheckLikeArticleResponseDto {
	private int userId;
	private boolean success;
}
