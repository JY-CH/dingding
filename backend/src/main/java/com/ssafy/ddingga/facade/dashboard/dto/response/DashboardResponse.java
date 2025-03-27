package com.ssafy.ddingga.facade.dashboard.dto.response;

import java.time.LocalTime;
import java.util.List;

import com.ssafy.ddingga.facade.replay.dto.response.ReplayDto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DashboardResponse {

	private Integer userId;
	private String username;
	private LocalTime playtime;
	private Integer playtimeRank;
	private Integer totalTry;
	private Integer totalTryRank;
	private List<ChordScoreDto> chordScoreDtos;
	private List<ReplayDto> replays;
}