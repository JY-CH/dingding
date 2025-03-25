package com.ssafy.ddingga.domain.article.entity;

import java.time.LocalDateTime;

import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@EntityListeners(AuditingEntityListener.class)
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Setter
@Getter
@Builder
public class Article {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer articleId; // userPk

	@Column(unique = true)
	private Integer id;  // user의 id
	private String title; // 게시판 제목
	private String content;    // 게시판 내용
	private LocalDateTime createdAt; // 생성일자
	private String category;    // 카테고리
	private Boolean popularPost;  // 인기글
	private Integer recommend;  // 추천수
}
