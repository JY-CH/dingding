package com.ssafy.ddingga.facade.rank.dto;

import java.time.LocalTime;

import lombok.Getter;

@Getter
public class RankingInfo {
	private LocalTime playTime;
	private Integer totalTry;
	private Integer playTimeRank;
	private Integer totalTryRank;

	public RankingInfo(LocalTime playTime, Integer totalTry, Integer playTimeRank, Integer totalTryRank) {
		this.playTime = playTime;
		this.totalTry = totalTry;
		this.playTimeRank = playTimeRank;
		this.totalTryRank = totalTryRank;
	}
}
