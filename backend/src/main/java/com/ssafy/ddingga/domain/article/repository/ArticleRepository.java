package com.ssafy.ddingga.domain.article.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.ssafy.ddingga.domain.article.entity.Article;

@Repository
public interface ArticleRepository extends JpaRepository<Article, Integer> {
	List<Article> findAll();
	Optional<Article> findByArticleId(int articleId);

	// title 또는 content에 keyword가 포함된 Article을 찾는 쿼리
	@Query("SELECT a FROM Article a WHERE a.title LIKE %?1% OR a.content LIKE %?1%")
	List<Article> findByTitleOrContentContaining(String keyword);
}
