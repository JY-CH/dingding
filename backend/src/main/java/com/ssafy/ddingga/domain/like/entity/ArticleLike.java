package com.ssafy.ddingga.domain.like.entity;

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
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
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
@Table(
	uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "article_id"}) // user_id와 article_id의 조합이 유니크
)
public class ArticleLike {
	@Id // 안 쓰려고 했는데 JPA에서 기본키 설정은 필수라고 한다. 이걸 안쓰려면 @EmbeddedId나 @IdClass를 사용해야한다고 함.
	@GeneratedValue(strategy = GenerationType.IDENTITY) // 자동으로 증가하는 ID 생성 전략
	private Long articleLikeId;

	@ManyToOne // 여러 개의 댓글이 하나의 사용자(User)에 의해 작성된다는 다대일 관계
	@JoinColumn(name = "user_id", nullable = false) // 외래 키로 User 엔티티의 "user_id"를 사용
	private User user;

	@ManyToOne // 여러 개의 댓글이 하나의 사용자(User)에 의해 작성된다는 다대일 관계
	@JoinColumn(name = "article_id", nullable = false) // 외래 키로 User 엔티티의 "user_id"를 사용
	private Article article;
}
