package com.ssafy.ddingga.facade.article.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.ssafy.ddingga.domain.article.entity.Article;
import com.ssafy.ddingga.domain.article.service.ArticleService;
import com.ssafy.ddingga.domain.user.service.UserService;
import com.ssafy.ddingga.facade.article.dto.response.ArticleGetAllResponseDto;

import jakarta.persistence.Column;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ArticleFacadeServiceImpl implements ArticleFacadeService{
	private final ArticleService articleService;
	private final UserService userService;

	@Override
	public List<ArticleGetAllResponseDto> articlesGetAll() {
		List<Article> articles = articleService.allArticleList();
		List<ArticleGetAllResponseDto> result = new ArrayList<>();

		ArticleGetAllResponseDto result2 = new ArticleGetAllResponseDto();
		for (Article article: articles){
			result2.setArticleId(article.getArticleId());
			result2.setUsername(userService.getUser(article.getId()).getUsername());
			result2.setTitle(article.getTitle());
			result2.setCreatedAt(article.getCreatedAt());
			result2.setCategory(article.getCategory());
			result2.setPopularPost(article.getPopularPost());
			result2.setRecommend(article.getRecommend());

			result.add(result2);
		}

		return result;
	}
}
