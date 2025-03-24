package com.ssafy.ddingga.domain.article.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.ssafy.ddingga.domain.article.entity.Article;

public interface ArticleRepository extends JpaRepository<Article, Integer> {
	List<Article> findAll();
}
