package com.ssafy.ddingga.facade.comment.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.ssafy.ddingga.domain.comment.entity.Comment;
import com.ssafy.ddingga.domain.comment.service.CommentService;
import com.ssafy.ddingga.facade.comment.dto.response.GetCommentsResponseDto;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class CommentFacadeServiceImpl implements CommentFacadeService {

	private final CommentService commentService;

	@Override
	public List<GetCommentsResponseDto> getComments(int articleId) {
		List<Comment> comments = commentService.getComments(articleId);
		List<GetCommentsResponseDto> responseDtoList = new ArrayList<>();
		for (Comment comment : comments) {
			if (comment.getParentComment() == null) {
				GetCommentsResponseDto responseDto = GetCommentsResponseDto.builder()
					.commentId(comment.getCommentId())
					.userId(comment.getUser().getUserId())
					.username(comment.getUser().getUsername())
					.userProfile(comment.getUser().getProfileImage())
					.content(comment.getContent())
					.createdAt(comment.getCreatedAt())
					.updateAt(comment.getUpdatedAt())
					.isDeleted(comment.getIsDeleted())
					.comments(getRepliesRecursive(comment.getReplies()))
					.build();

				responseDtoList.add(responseDto);
			}
		}

		return responseDtoList;
	}

	private List<GetCommentsResponseDto> getRepliesRecursive(List<Comment> replies) {
		List<GetCommentsResponseDto> replyDtoList = new ArrayList<>();
		for (Comment reply : replies) {
			GetCommentsResponseDto replyDto = GetCommentsResponseDto.builder()
				.commentId(reply.getCommentId())
				.userId(reply.getUser().getUserId())
				.username(reply.getUser().getUsername())
				.userProfile(reply.getUser().getProfileImage())
				.content(reply.getContent())
				.createdAt(reply.getCreatedAt())
				.updateAt(reply.getUpdatedAt())
				.isDeleted(reply.getIsDeleted())
				.comments(getRepliesRecursive(reply.getReplies()))  // 대댓글 재귀적으로 조회
				.build();

			replyDtoList.add(replyDto);
		}
		return replyDtoList;
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
