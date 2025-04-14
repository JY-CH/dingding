package com.ssafy.ddingga.domain.comment.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import com.ssafy.ddingga.domain.article.entity.Article;
import com.ssafy.ddingga.domain.article.service.ArticleService;
import com.ssafy.ddingga.domain.auth.entity.User;
import com.ssafy.ddingga.domain.auth.service.AuthService;
import com.ssafy.ddingga.domain.comment.entity.Comment;
import com.ssafy.ddingga.domain.comment.repository.CommentRepository;
import com.ssafy.ddingga.global.error.exception.NotFoundException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j //로그를 위한 어노테이션
@Service
@RequiredArgsConstructor // final 필드나 @NonNull이 붙은 필드를 매개변수로 받는 생성자를 자동으로 생성해주는 어노테이션
public class CommentServiceImpl implements CommentService {

	private final CommentRepository commentRepository;
	private final AuthService authService;
	private final ArticleService articleService;

	@Override
	public List<Comment> getComments(int articleId) {
		Article article = articleService.getArticle(articleId);

		return commentRepository.findByArticle(article);
	}

	@Override
	public boolean createComment(int userId, int articleId, String content) {
		try {
			User user = authService.getUser(userId);
			Article article = articleService.getArticle(articleId);

			Comment comment = Comment.builder()
				.user(user)
				.article(article)
				.content(content)
				.createdAt(LocalDateTime.now())
				.updatedAt(LocalDateTime.now())
				.isDeleted(false)
				.parentComment(null)
				.build();
			commentRepository.save(comment);

			return true;
		} catch (Exception e) {
			log.error("Error creating comment", e);
			throw new RuntimeException("댓글 생성 중 오류가 발생했습니다.", e);
		}
	}

	@Override
	public boolean createReply(int userId, int articleId, String content, int commentId) {
		try {
			User user = authService.getUser(userId);
			Article article = articleService.getArticle(articleId);
			Comment parentComment = commentRepository.findById(commentId)
				.orElseThrow(() -> new IllegalArgumentException("부모 댓글을 찾을 수 없습니다., commentId: " + commentId));

			if (parentComment.getIsDeleted()) {
				throw new NotFoundException("이미 삭제된 댓글입니다..");
			}

			if (parentComment.getParentComment() != null) {
				// 부모 댓글이 이미 다른 부모 댓글을 가진 경우
				throw new IllegalArgumentException("답글은 이미 다른 답글이 달린 댓글입니다. 하나의 댓글에만 대댓글을 작성할 수 있습니다.");
			}

			Comment comment = Comment.builder()
				.user(user)
				.article(article)
				.content(content)
				.createdAt(LocalDateTime.now())
				.updatedAt(LocalDateTime.now())
				.isDeleted(false)
				.parentComment(parentComment)
				.build();
			commentRepository.save(comment);  // 자식 댓글을 저장

			// // 부모 댓글의 replies 리스트에 추가
			// parentComment.getReplies().add(comment);  // 부모 댓글에 답글 추가
			// commentRepository.save(parentComment);  // 부모 댓글을 업데이트하여 replies 리스트를 갱신

			return true;
		} catch (Exception e) {
			log.error("Error creating comment", e);
			return false;
		}
	}

	@Override
	public boolean updateComment(int checkUserId, int commentId, String content) {
		try {
			Comment comment = commentRepository.findById(commentId)
				.orElseThrow(() -> new IllegalArgumentException("댓글을 찾을 수 없습니다., commentId: " + commentId));

			if (checkUserId != comment.getUser().getUserId()) {
				throw new AccessDeniedException("접근권한이 없습니다.");
			}

			if (comment.getIsDeleted()) {
				throw new NotFoundException("이미 삭제된 댓글입니다..");
			}

			comment.setContent(content);
			commentRepository.save(comment);

			return true;
		} catch (Exception e) {
			throw new RuntimeException("댓글 수정 중 오류가 발생했습니다.", e);
		}
	}

	@Override
	public boolean deleteComment(int checkUserId, int commentId) {
		try {
			Comment comment = commentRepository.findById(commentId)
				.orElseThrow(() -> new IllegalArgumentException("댓글을 찾을 수 없습니다., commentId: " + commentId));

			if (checkUserId != comment.getUser().getUserId()) {
				throw new AccessDeniedException("접근권한이 없습니다.");
			}

			if (comment.getIsDeleted()) {
				throw new NotFoundException("이미 삭제된 댓글입니다..");
			}

			comment.setIsDeleted(true);
			commentRepository.save(comment);

			return true;
		} catch (Exception e) {
			log.error("댓글 삭제 실패: checkUserId={}, commentId={}, error={}", checkUserId, commentId,
				e.getMessage());
			throw new RuntimeException("댓글 삭제 중 오류가 발생했습니다.", e);
		}
	}
}
