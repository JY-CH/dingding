package com.ssafy.ddingga.facade.article.service;

import java.util.List;

import com.ssafy.ddingga.facade.article.dto.request.ArticleCreateRequestDto;
import com.ssafy.ddingga.facade.article.dto.request.ArticleUpdateRequestDto;
import com.ssafy.ddingga.facade.article.dto.response.ArticleDetailResponseDto;
import com.ssafy.ddingga.facade.article.dto.response.ArticleGetAllResponseDto;
import com.ssafy.ddingga.facade.article.dto.response.ArticleSearchResponseDto;

public interface ArticleFacadeService {
	List<ArticleGetAllResponseDto> articlesGetAll();

	ArticleDetailResponseDto articleGet(int articleId);

	void articleCreate(int userId, ArticleCreateRequestDto request);

	void articleUpdate(int articleId, ArticleUpdateRequestDto request);

	void articleDelete(int articleId);

	List<ArticleSearchResponseDto> articleSearch(String keyword);
}
