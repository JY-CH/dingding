package com.ssafy.ddingga.facade.rank.dto.response;

import java.time.LocalTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TopRankingResponse {
	private Integer rank;
	private String username;
	private LocalTime playTime;
	private Integer totalTry;
	private Float score;
}
