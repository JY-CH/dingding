package com.ssafy.ddingga.facade.rank.service;

import com.ssafy.ddingga.facade.rank.dto.response.TopRankingResponse;

public interface RankingFacadeService {
	TopRankingResponse getTop5Rankings();

}