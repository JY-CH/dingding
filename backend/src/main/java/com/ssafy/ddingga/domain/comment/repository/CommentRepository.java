package com.ssafy.ddingga.domain.comment.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ssafy.ddingga.domain.article.entity.Article;

@Repository
public interface CommentRepository extends JpaRepository<Article, Integer> {
}
