package com.ssafy.ddingga.facade.weeksongranking.service;

import java.util.List;

import com.ssafy.ddingga.facade.weeksongranking.dto.response.GetWeekSongRankingResponseDto;

public interface WeekSongRankingFacadeService {
	List<GetWeekSongRankingResponseDto> getWeekSongRanking();
}
