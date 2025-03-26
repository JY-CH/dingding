package com.ssafy.ddingga.facade.article.service;

import java.util.List;

import com.ssafy.ddingga.facade.article.dto.request.ArticleCreateRequestDto;
import com.ssafy.ddingga.facade.article.dto.request.ArticleUpdateRequestDto;
import com.ssafy.ddingga.facade.article.dto.response.ArticleDetailResponseDto;
import com.ssafy.ddingga.facade.article.dto.response.ArticleGetAllResponseDto;
import com.ssafy.ddingga.facade.article.dto.response.ArticleSearchResponseDto;

public interface ArticleFacadeService {
	List<ArticleGetAllResponseDto> allGetArticleList();

	ArticleDetailResponseDto getArticle(int articleId);

	void createArticle(int userId, ArticleCreateRequestDto request);

	void updateArticle(int checkUserId, int articleId, ArticleUpdateRequestDto request);

	void deleteArticle(int checkUserId, int articleId);

	List<ArticleSearchResponseDto> searchArticleList(String keyword);
}
