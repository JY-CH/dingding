package com.ssafy.ddingga.facade.weeksongranking.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GetWeekSongRankingResponseDto {
	private int songId;
	private String songTitle;
	private String songImage;
	private String songWriter;
	private String username;
	private int score;
}
