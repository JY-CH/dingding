package com.ssafy.ddingga.domain.like.service;

public interface ArticleLikeService {

	boolean likeArticle(int userId, int articleId);

	boolean unLikeArticle(int userId, int articleId);
}
