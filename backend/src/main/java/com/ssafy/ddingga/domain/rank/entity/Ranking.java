package com.ssafy.ddingga.domain.rank.entity;

import java.time.LocalTime;

import com.ssafy.ddingga.domain.auth.entity.User;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class Ranking {
	// 각 유저의 항목별 순위는 나중에 서브쿼리로 하는게 나음
	// DB에 저장하면 개손해
	// Redis 사용하는 방법도 존재함 구현할때 생각해보기
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer rankingId;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "user_id", nullable = false) // 한 유저가 여러개의 랭킹을 가지니까 기본키로 못씀
	private User user;

	private LocalTime playTime;
	private Float score;
	private Integer totalTry;
}
