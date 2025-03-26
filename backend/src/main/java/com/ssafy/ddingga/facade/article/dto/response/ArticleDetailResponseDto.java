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
public class ArticleDetailResponseDto {
	private Integer articleId; // userPk
	private int userId;
	private String title; // 게시판 제목
	private String content;    // 게시판 내용
	private LocalDateTime createdAt; // 생성일자
	private LocalDateTime updatedAt; // 수정일자
	private String category;    // 카테고리
	private Boolean popularPost;  // 인기글
	private Integer recommend;  // 추천수
}
