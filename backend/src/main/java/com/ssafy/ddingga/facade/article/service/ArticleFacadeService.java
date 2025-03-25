package com.ssafy.ddingga.facade.article.service;

import java.util.List;

import com.ssafy.ddingga.facade.article.dto.response.ArticleGetAllResponseDto;

public interface ArticleFacadeService {
	List<ArticleGetAllResponseDto> articlesGetAll();
}
