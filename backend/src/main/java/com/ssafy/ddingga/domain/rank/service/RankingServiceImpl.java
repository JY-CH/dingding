package com.ssafy.ddingga.domain.rank.service;

import org.springframework.stereotype.Service;

import com.ssafy.ddingga.domain.rank.repository.RankingRepository;
import com.ssafy.ddingga.facade.rank.dto.RankingInfo;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RankingServiceImpl implements RankingService {
	private final RankingRepository rankingRepository;

	@Override
	public RankingInfo getRankingInfo(Integer userId) {
		return rankingRepository.findRankingByUserId(userId);
	}
}
