package com.ssafy.ddingga.domain.comment.service;

import java.util.List;

import com.ssafy.ddingga.domain.comment.entity.Comment;

public interface CommentService {
	List<Comment> getComments();

	boolean createComment();

	boolean updateComment();

	boolean deleteComment();
}
