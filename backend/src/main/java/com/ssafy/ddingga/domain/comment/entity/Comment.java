package com.ssafy.ddingga.domain.comment.entity;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.ssafy.ddingga.domain.article.entity.Article;
import com.ssafy.ddingga.domain.auth.entity.User;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
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
	@Column(name = "comment_id")  // 물리적 컬럼 이름을 명시
	private Integer commentId; // 논리적 필드 이름을 맞춤, 댓글의 고유 식별자 (댓글 ID)

	@ManyToOne // 여러 개의 댓글이 하나의 사용자(User)에 의해 작성된다는 다대일 관계
	@JoinColumn(name = "user_id", nullable = false) // 외래 키로 User 엔티티의 "user_id"를 사용
	private User user;

	@ManyToOne // 댓글은 하나의 게시글(Article)과 다대일 관계
	@JoinColumn(name = "article_id", nullable = false) // 외래 키로 Article 엔티티의 "article_id"를 사용
	private Article article;
	private String content;    // 게시판 내용
	private LocalDateTime createdAt; // 생성일자
	private LocalDateTime updatedAt; // 수정일자
	private Boolean isDeleted;  // 삭제 유무

	@ManyToOne // 다대일 관계로 부모 댓글을 참조 (답글의 경우)
	@JoinColumn(name = "parent_comment_id", nullable = true) // 외래 키로 Comment 엔티티의 "comment_id"를 사용
	private Comment parentComment; // 답글 대상 원 댓글

	@OneToMany(mappedBy = "parentComment") // 부모 댓글에 달린 자식 댓글들 (답글 목록)
	private List<Comment> replies;  // 자식 댓글 목록
}
