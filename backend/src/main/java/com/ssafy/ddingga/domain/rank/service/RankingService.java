package com.ssafy.ddingga.domain.rank.service;

import java.time.Duration;

import com.ssafy.ddingga.domain.rank.entity.Ranking;
import com.ssafy.ddingga.facade.rank.dto.response.RankingInfo;
import com.ssafy.ddingga.facade.rank.dto.response.TopRankingResponse;

public interface RankingService {
	RankingInfo getRankingInfo(Integer userId);

	TopRankingResponse getTop10Rankings();

	Ranking createRankingInfo(int userId, Duration playtime, float score, int totalTry);

	Ranking updateRankingInfo(int userId, Duration playtime, float score, int totalTry);
}
