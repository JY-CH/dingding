package com.ssafy.ddingga.domain.rank.service;

import org.springframework.stereotype.Service;

import com.ssafy.ddingga.domain.auth.repository.AuthRepository;
import com.ssafy.ddingga.domain.rank.repository.RankingRepository;
import com.ssafy.ddingga.facade.rank.dto.RankingInfo;
import com.ssafy.ddingga.global.error.exception.DatabaseException;
import com.ssafy.ddingga.global.error.exception.UserNotFoundException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class RankingServiceImpl implements RankingService {
	private final RankingRepository rankingRepository;
	private final AuthRepository authRepository;

	@Override
	public RankingInfo getRankingInfo(Integer userId) {
		log.info("랭킹 - 랭킹 정보 조회 요청: userId={}", userId);
		if (!authRepository.existsById(userId)) {
			log.error("랭킹 - 사용자를 찾을 수 없음: userId={}", userId);
			throw new UserNotFoundException("사용자를 찾을 수 없습니다.");
		}

		try {
			RankingInfo result = rankingRepository.findRankingByUserId(userId);
			log.info("랭킹 - 랭킹 정보 조회 완료: userId={}, result={}", userId, result);
			return result;
		} catch (Exception e) {
			log.error("랭킹 - 랭킹 정보 조회 실패: userId={}, error={}", userId, e.getMessage());
			throw new DatabaseException("랭킹 정보 조회 중 오류가 발생했습니다.", e);
		}
	}
}
