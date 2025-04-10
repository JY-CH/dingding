package com.ssafy.ddingga.facade.like.service;

import com.ssafy.ddingga.facade.like.dto.response.CheckLikeArticleResponseDto;
import com.ssafy.ddingga.facade.like.dto.response.LikeArticleResponseDto;
import com.ssafy.ddingga.facade.like.dto.response.UnLikeArticleResponseDto;

public interface ArticleLikeFacadeService {
	CheckLikeArticleResponseDto checkLikeArticle(int userId, int articleId);

	LikeArticleResponseDto likeArticle(int userId, int articleId);

	UnLikeArticleResponseDto unLikeArticle(int userId, int articleId);
}
