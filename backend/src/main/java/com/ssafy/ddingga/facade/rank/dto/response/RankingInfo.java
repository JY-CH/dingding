package com.ssafy.ddingga.facade.rank.dto.response;

import java.time.Duration;

import com.ssafy.ddingga.common.converter.DurationConverter;

import jakarta.persistence.Convert;
import lombok.Getter;

@Getter
public class RankingInfo {
	@Convert(converter = DurationConverter.class)
	private Duration playTime;
	private Integer totalTry;
	private Float score;
	private Integer playTimeRank;
	private Integer totalTryRank;
	private Integer scoreRank;

	public RankingInfo(Duration playTime, Integer totalTry, Float score, Integer playTimeRank, Integer totalTryRank,
		Integer scoreRank) {
		this.playTime = playTime;
		this.totalTry = totalTry;
		this.score = score;
		this.playTimeRank = playTimeRank;
		this.totalTryRank = totalTryRank;
		this.scoreRank = scoreRank;

	}
}
