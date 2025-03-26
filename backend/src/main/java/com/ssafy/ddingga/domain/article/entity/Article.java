package com.ssafy.ddingga.domain.article.entity;

import java.time.LocalDateTime;

import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.ssafy.ddingga.domain.user.entity.User;

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
public class Article {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer articleId; // userPk

	@ManyToOne // userId는 User 테이블과 다대일 관계
	@JoinColumn(name = "user_id", nullable = false) // 외래 키로 "user_id"를 사용
	private User user;
	private String title; // 게시판 제목
	private String content;    // 게시판 내용
	private LocalDateTime createdAt; // 생성일자
	private LocalDateTime updatedAt; // 수정일자
	private String category;    // 카테고리
	private Boolean popularPost;  // 인기글
	private Integer recommend;  // 추천수
}
