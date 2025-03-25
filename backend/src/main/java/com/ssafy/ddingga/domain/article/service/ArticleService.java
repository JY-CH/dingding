package com.ssafy.ddingga.domain.article.service;

import java.util.List;

import com.ssafy.ddingga.domain.article.entity.Article;

public interface ArticleService {
	/**
	 * 게시판 목록 전체 조회(도메인 로직)
	 * @return  전체 게시판 목록
	 */
	List<Article> allArticleList();
}
