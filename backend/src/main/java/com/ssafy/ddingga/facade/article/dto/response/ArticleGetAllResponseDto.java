package com.ssafy.ddingga.facade.article.dto.response;

import java.time.LocalDateTime;

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
public class ArticleGetAllResponseDto {

	private Integer articleId; // 게시판 pk
	private String username;  // user 닉네임
	private String title; // 제목
	private LocalDateTime createdAt; // 가입일자
	private String category;    // 카테고리
	private Boolean popularPost;  // 인기글
	private Integer recommend;  // 추천수
}
