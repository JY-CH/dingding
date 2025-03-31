package com.ssafy.ddingga.facade.rank.dto.response;

import java.time.LocalTime;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class TopRankingInfo {
	private Integer rank;
	private String username;
	private LocalTime playTime;
	private Integer totalTry;
	private Float score;

	public TopRankingInfo(Integer rank, String username, LocalTime playTime, Integer totalTry, Float score) {
		this.rank = rank;
		this.username = username;
		this.playTime = playTime;
		this.totalTry = totalTry;
		this.score = score;
	}
}