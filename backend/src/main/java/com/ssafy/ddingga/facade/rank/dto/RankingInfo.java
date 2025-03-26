package com.ssafy.ddingga.facade.rank.dto;

import java.time.LocalTime;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class RankingInfo {
	private LocalTime playTime;
	private Integer totalTry;
	private Integer playTimeRank;
	private Integer totalTryRank;
}
