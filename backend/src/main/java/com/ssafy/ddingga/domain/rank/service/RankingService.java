package com.ssafy.ddingga.domain.rank.service;

import java.time.LocalTime;

import com.ssafy.ddingga.domain.rank.entity.Ranking;
import com.ssafy.ddingga.facade.rank.dto.response.RankingInfo;
import com.ssafy.ddingga.facade.rank.dto.response.TopRankingResponse;

public interface RankingService {
	RankingInfo getRankingInfo(Integer userId);

	TopRankingResponse getTop10Rankings();

	Ranking createRankingInfo(int userId, LocalTime playtime, float score, int totalTry);

	Ranking updateRankingInfo(int userId, LocalTime playtime, float score, int totalTry);
}
