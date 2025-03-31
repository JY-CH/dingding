package com.ssafy.ddingga.domain.rank.service;

import com.ssafy.ddingga.facade.rank.dto.response.RankingInfo;
import com.ssafy.ddingga.facade.rank.dto.response.TopRankingResponse;

public interface RankingService {
	RankingInfo getRankingInfo(Integer userId);

	TopRankingResponse getTop5Rankings();

}
