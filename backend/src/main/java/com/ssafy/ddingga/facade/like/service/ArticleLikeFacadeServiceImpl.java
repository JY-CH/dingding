package com.ssafy.ddingga.facade.like.service;

import org.springframework.stereotype.Service;

import com.ssafy.ddingga.domain.like.service.ArticleLikeService;
import com.ssafy.ddingga.facade.like.dto.response.CheckLikeArticleResponseDto;
import com.ssafy.ddingga.facade.like.dto.response.LikeArticleResponseDto;
import com.ssafy.ddingga.facade.like.dto.response.UnLikeArticleResponseDto;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ArticleLikeFacadeServiceImpl implements ArticleLikeFacadeService {

	private final ArticleLikeService articleLikeService;

	@Override
	public CheckLikeArticleResponseDto checkLikeArticle(int userId, int articleId) {
		CheckLikeArticleResponseDto checkLikeArticleResponseDto = CheckLikeArticleResponseDto.builder()
			.userId(userId)
			.success(articleLikeService.checkLikeArticle(userId, articleId))
			.build();

		return checkLikeArticleResponseDto;
	}

	@Override
	public LikeArticleResponseDto likeArticle(int userId, int articleId) {
		LikeArticleResponseDto likeArticleResponseDto = LikeArticleResponseDto.builder()
			.success(articleLikeService.likeArticle(userId, articleId))
			.build();

		return likeArticleResponseDto;
	}

	@Override
	public UnLikeArticleResponseDto unLikeArticle(int userId, int articleId) {
		UnLikeArticleResponseDto unLikeArticleResponseDto = UnLikeArticleResponseDto.builder()
			.success(articleLikeService.unLikeArticle(userId, articleId))
			.build();

		return unLikeArticleResponseDto;
	}
}
