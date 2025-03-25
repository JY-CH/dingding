package com.ssafy.ddingga.facade.article.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.ssafy.ddingga.domain.article.entity.Article;
import com.ssafy.ddingga.domain.article.service.ArticleService;
import com.ssafy.ddingga.domain.user.service.UserService;
import com.ssafy.ddingga.facade.article.dto.request.ArticleCreateRequestDto;
import com.ssafy.ddingga.facade.article.dto.response.ArticleGetAllResponseDto;

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

		for (Article article: articles){
			ArticleGetAllResponseDto ar = new ArticleGetAllResponseDto();
			ar.setArticleId(article.getArticleId());
			ar.setUserId(article.getUser().getUserId());
			ar.setUsername(article.getUser().getUsername());
			ar.setTitle(article.getTitle());
			ar.setCreatedAt(article.getCreatedAt());
			ar.setCategory(article.getCategory());
			ar.setPopularPost(article.getPopularPost());
			ar.setRecommend(article.getRecommend());

			result.add(ar);
		}

		return result;
	}

	@Override
	public void articleCreate(int userId, ArticleCreateRequestDto request) {
		articleService.creatArticle(userId,request.getTitle(),request.getContent(), request.getCategory());
	}

}
