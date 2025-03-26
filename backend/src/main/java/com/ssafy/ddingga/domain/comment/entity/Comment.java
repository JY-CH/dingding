package com.ssafy.ddingga.domain.comment.entity;

import java.time.LocalDateTime;

import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.ssafy.ddingga.domain.article.entity.Article;
import com.ssafy.ddingga.domain.auth.entity.User;

import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@EntityListeners(AuditingEntityListener.class)
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
public class Comment {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer commentId; // userPk

	@ManyToOne // 여러 개의 댓글이 하나의 사용자(User)에 의해 작성된다는 다대일 관계
	@JoinColumn(name = "user_id", nullable = false) // 외래 키로 "user_id"를 사용
	private User user;

	@ManyToOne // articleId는 Article 테이블과 다대일 관계
	@JoinColumn(name = "article_id", nullable = false) // 외래 키로 "article_id"를 사용
	private Article article;
	private String content;    // 게시판 내용
	private LocalDateTime createdAt; // 생성일자
	private LocalDateTime updatedAt; // 수정일자
	private Boolean isDeleted;  // 삭제 유무

	@ManyToOne // commentId는 Comment 테이블과 다대일 관계
	@JoinColumn(name = "comment_id", nullable = false) // 외래 키로 "comment_id"를 사용
	private Comment comment; // 답글 대상 원 댓글

}
