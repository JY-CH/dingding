package com.ssafy.ddingga.facade.comment.service;

import java.util.List;

import com.ssafy.ddingga.facade.comment.dto.response.GetCommentsResponseDto;

public interface CommentFacadeService {
	List<GetCommentsResponseDto> getComments(int articleId);

	// 댓글 생성 메서드
	boolean createComment(int userId, int articleId, String content);

	// 대댓글 생성 메서드
	// commentId는 부모 댓글의 아이디이다.
	boolean createReply(int userId, int articleId, String content, int commentId);

	boolean updateComment(int checkUserId, int commentId, String content);

	boolean deleteComment(int checkUserId, int commentId);
}
