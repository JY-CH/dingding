package com.ssafy.ddingga.facade.rank.dto.response;

import java.time.LocalTime;

import lombok.Getter;

@Getter
public class RankingInfo {
	private LocalTime playTime;
	private Integer totalTry;
	private Float score;
	private Integer playTimeRank;
	private Integer totalTryRank;
	private Integer scoreRank;

	public RankingInfo(LocalTime playTime, Integer totalTry, Float score, Integer playTimeRank, Integer totalTryRank,
		Integer scoreRank) {
		this.playTime = playTime;
		this.totalTry = totalTry;
		this.score = score;
		this.playTimeRank = playTimeRank;
		this.totalTryRank = totalTryRank;
		this.scoreRank = scoreRank;

	}
}
