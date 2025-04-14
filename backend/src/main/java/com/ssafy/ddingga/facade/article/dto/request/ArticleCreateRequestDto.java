package com.ssafy.ddingga.facade.article.dto.request;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ArticleCreateRequestDto {
	String title;
	String content;
	String category;
}
