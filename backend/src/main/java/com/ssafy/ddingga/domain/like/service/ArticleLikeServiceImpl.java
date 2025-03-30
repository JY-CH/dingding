package com.ssafy.ddingga.domain.like.service;

import org.springframework.stereotype.Service;

import com.ssafy.ddingga.domain.article.entity.Article;
import com.ssafy.ddingga.domain.article.repository.ArticleRepository;
import com.ssafy.ddingga.domain.article.service.ArticleService;
import com.ssafy.ddingga.domain.auth.entity.User;
import com.ssafy.ddingga.domain.auth.service.AuthService;
import com.ssafy.ddingga.domain.like.entity.ArticleLike;
import com.ssafy.ddingga.domain.like.repository.ArticleLikeRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j //로그를 위한 어노테이션
@Service
@RequiredArgsConstructor
public class ArticleLikeServiceImpl implements ArticleLikeService {
	private final ArticleLikeRepository articleLikeRepository;
	private final AuthService authService;
	private final ArticleService articleService;
	private final ArticleRepository articleRepository;

	@Override
	public boolean checkLikeArticle(int userId, int articleId) {
		User user = authService.getUser(userId);
		Article article = articleService.getArticle(articleId);
		ArticleLike like = articleLikeRepository.findByUserAndArticle(user, article);

		return like != null; // null이 아니면 좋아요인상태 null이면 좋아요 아닌상태
	}

	@Override
	public boolean likeArticle(int userId, int articleId) {
		User user = authService.getUser(userId);
		Article article = articleService.getArticle(articleId);
		boolean result = false;

		ArticleLike like = articleLikeRepository.findByUserAndArticle(user, article);
		if (like == null) {
			article.setRecommend(article.getRecommend() + 1);
			like = ArticleLike.builder()
				.user(user)
				.article(article)
				.build();

			articleLikeRepository.save(like);
			articleRepository.save(article);
			result = true;
		}

		return result;
	}

	@Override
	public boolean unLikeArticle(int userId, int articleId) {
		User user = authService.getUser(userId);
		Article article = articleService.getArticle(articleId);
		boolean result = false;

		ArticleLike like = articleLikeRepository.findByUserAndArticle(user, article);
		if (like != null) {
			article.setRecommend(article.getRecommend() - 1);
			articleLikeRepository.delete(like);
			articleRepository.save(article);
			result = true;
		}

		return result;
	}
}
