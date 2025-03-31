package com.ssafy.ddingga.domain.like.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ssafy.ddingga.domain.article.entity.Article;
import com.ssafy.ddingga.domain.auth.entity.User;
import com.ssafy.ddingga.domain.like.entity.ArticleLike;

@Repository
public interface ArticleLikeRepository extends JpaRepository<ArticleLike, Long> {
	// 특정 유저와 게시글에 대한 좋아요를 가져오는 메서드
	ArticleLike findByUserAndArticle(User user, Article article);
}
