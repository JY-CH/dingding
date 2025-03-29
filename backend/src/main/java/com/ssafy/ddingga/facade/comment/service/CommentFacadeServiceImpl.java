package com.ssafy.ddingga.facade.comment.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.ssafy.ddingga.domain.comment.entity.Comment;
import com.ssafy.ddingga.domain.comment.service.CommentService;
import com.ssafy.ddingga.facade.comment.dto.response.GetCommentsResponseDto;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CommentFacadeServiceImpl implements CommentFacadeService {

	private final CommentService commentService;

	@Override
	public List<GetCommentsResponseDto> getComments(int articleId) {
		List<Comment> comments = commentService.getComments(articleId);
		List<GetCommentsResponseDto> responseDtoList = new ArrayList<>();
		for (Comment comment : comments) {
			GetCommentsResponseDto responseDto = GetCommentsResponseDto.builder()
				.commentId(comment.getCommentId())
				.userId(comment.getUser().getUserId())
				.username(comment.getUser().getUsername())
				.content(comment.getContent())
				.createdAt(comment.getCreatedAt())
				.updateAt(comment.getUpdatedAt())
				.isDeleted(comment.getIsDeleted())
				.comments(comment.getReplies())
				.build();

			responseDtoList.add(responseDto);
		}

		return responseDtoList;
	}

	@Override
	public boolean createComment(int userId, int articleId, String content) {
		return commentService.createComment(userId, articleId, content);
	}

	@Override
	public boolean createReply(int userId, int articleId, String content, int commentId) {
		return commentService.createReply(userId, articleId, content, commentId);
	}

	@Override
	public boolean updateComment(int checkUserId, int commentId, String content) {
		return commentService.updateComment(checkUserId, commentId, content);
	}

	@Override
	public boolean deleteComment(int checkUserId, int commentId) {
		return commentService.deleteComment(checkUserId, commentId);
	}
}
