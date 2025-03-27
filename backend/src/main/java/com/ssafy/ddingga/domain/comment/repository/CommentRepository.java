package com.ssafy.ddingga.domain.comment.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ssafy.ddingga.domain.comment.entity.Comment;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Integer> {
	// `Article`의 `articleId`를 사용하여 댓글을 찾는 메서드
	List<Comment> findByArticleArticleId(int articleId);
}
