package com.ssafy.ddingga.facade.rank.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.ddingga.domain.rank.service.RankingService;
import com.ssafy.ddingga.facade.rank.dto.response.TopRankingResponse;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RankingFacadeServiceImpl implements RankingFacadeService {
	private final RankingService rankingService;

	@Override
	public TopRankingResponse getTop10Rankings() {
		log.info("랭킹 Facade - 상위 10명 랭킹 정보 조회 요청");
		TopRankingResponse result = rankingService.getTop10Rankings();
		log.info("랭킹 Facade - 상위 10명 랭킹 정보 조회 완료");
		return result;
	}
}