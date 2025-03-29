package com.ssafy.ddingga.facade.like.service;

import com.ssafy.ddingga.facade.like.dto.response.LikeArticleResponseDto;
import com.ssafy.ddingga.facade.like.dto.response.UnLikeArticleResponseDto;

public interface ArticleLikeFacadeService {

	LikeArticleResponseDto likeArticle(int userId, int articleId);

	UnLikeArticleResponseDto unLikeArticle(int userId, int articleId);
}
