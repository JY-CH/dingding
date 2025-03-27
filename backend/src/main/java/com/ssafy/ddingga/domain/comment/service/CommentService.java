package com.ssafy.ddingga.domain.comment.service;

import java.util.List;

import com.ssafy.ddingga.domain.comment.entity.Comment;

public interface CommentService {

	List<Comment> getComments(int articleId);

	// 댓글 생성 메서드
	boolean createComment(int userId, int articleId, String content);

	// 대댓글 생성 메서드
	// commentId는 부모 댓글의 아이디이다.
	boolean createReply(int userId, int articleId, String content, int commentId);

	boolean updateComment(int checkUserId, int commentId, String content);

	boolean deleteComment(int checkUserId, int commentId);
}
