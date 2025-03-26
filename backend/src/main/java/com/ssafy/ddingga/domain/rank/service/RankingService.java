package com.ssafy.ddingga.domain.rank.service;

import com.ssafy.ddingga.facade.rank.dto.RankingInfo;

public interface RankingService {
	RankingInfo getRankingInfo(Integer userId);
}
