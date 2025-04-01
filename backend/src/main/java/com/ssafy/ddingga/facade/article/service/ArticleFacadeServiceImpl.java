package com.ssafy.ddingga.facade.article.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.ssafy.ddingga.domain.article.entity.Article;
import com.ssafy.ddingga.domain.article.service.ArticleService;
import com.ssafy.ddingga.domain.like.service.ArticleLikeService;
import com.ssafy.ddingga.facade.article.dto.request.ArticleCreateRequestDto;
import com.ssafy.ddingga.facade.article.dto.request.ArticleUpdateRequestDto;
import com.ssafy.ddingga.facade.article.dto.response.ArticleDetailResponseDto;
import com.ssafy.ddingga.facade.article.dto.response.ArticleGetAllResponseDto;
import com.ssafy.ddingga.facade.article.dto.response.ArticleSearchResponseDto;
import com.ssafy.ddingga.facade.comment.service.CommentFacadeService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ArticleFacadeServiceImpl implements ArticleFacadeService {
	private final ArticleService articleService;
	private final CommentFacadeService commentFacadeService;
	private final ArticleLikeService articleLikeService;

	@Override
	public List<ArticleGetAllResponseDto> allGetArticleList(int userId) {
		List<Article> articles = articleService.allGetArticleList();
		List<ArticleGetAllResponseDto> result = new ArrayList<>();

		for (Article article : articles) {
			ArticleGetAllResponseDto ar = new ArticleGetAllResponseDto();
			ar.setArticleId(article.getArticleId());
			ar.setUserId(article.getUser().getUserId());
			ar.setUsername(article.getUser().getUsername());
			ar.setTitle(article.getTitle());
			ar.setCreatedAt(article.getCreatedAt());
			ar.setCategory(article.getCategory());
			ar.setPopularPost(article.getPopularPost());
			ar.setRecommend(article.getRecommend());
			ar.setIsLike(articleLikeService.checkLikeArticle(userId, article.getArticleId()));

			result.add(ar);
		}

		return result;
	}

	@Override
	public ArticleDetailResponseDto getArticle(int userId, int articleId) {
		Article article = articleService.getArticle(articleId);
		ArticleDetailResponseDto responseDto = ArticleDetailResponseDto.builder()
			.articleId(article.getArticleId())
			.userId(article.getUser().getUserId())
			.username(article.getUser().getUsername())
			.userProfile(article.getUser().getProfileImage())
			.title(article.getTitle())
			.content(article.getContent())
			.createdAt(article.getCreatedAt())
			.category(article.getCategory())
			.updatedAt(article.getUpdatedAt())
			.popularPost(article.getPopularPost())
			.recommend(article.getRecommend())
			.isLike(articleLikeService.checkLikeArticle(userId, articleId))
			.comments(commentFacadeService.getComments(articleId))
			.build();

		return responseDto;
	}

	@Override
	public void createArticle(int userId, ArticleCreateRequestDto request) {
		articleService.creatArticle(userId, request.getTitle(), request.getContent(), request.getCategory());
	}

	@Override
	public void updateArticle(int checkUserId, int articleId, ArticleUpdateRequestDto request) {
		articleService.updateArticle(checkUserId, articleId, request.getTitle(), request.getContent(),
			request.getCategory());
	}

	@Override
	public void deleteArticle(int checkUserId, int articleId) {
		articleService.deleteArticle(checkUserId, articleId);
	}

	@Override
	public List<ArticleSearchResponseDto> searchArticleList(String keyword) {
		List<Article> articles = articleService.searchArticles(keyword);
		List<ArticleSearchResponseDto> result = new ArrayList<>();

		for (Article article : articles) {
			ArticleSearchResponseDto ar = new ArticleSearchResponseDto();
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

}
