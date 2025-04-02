package com.ssafy.ddingga.domain.rank.service;

import java.time.LocalTime;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.ssafy.ddingga.domain.auth.entity.User;
import com.ssafy.ddingga.domain.auth.repository.AuthRepository;
import com.ssafy.ddingga.domain.rank.entity.Ranking;
import com.ssafy.ddingga.domain.rank.repository.RankingRepository;
import com.ssafy.ddingga.facade.rank.dto.response.RankingInfo;
import com.ssafy.ddingga.facade.rank.dto.response.TopRankingResponse;
import com.ssafy.ddingga.global.error.exception.DatabaseException;
import com.ssafy.ddingga.global.error.exception.NotFoundException;
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

	@Override
	public TopRankingResponse getTop10Rankings() {
		log.info("랭킹 - 상위 10명 랭킹 정보 조회 요청");
		try {
			Pageable pageable = PageRequest.of(0, 10);
			TopRankingResponse response = TopRankingResponse.builder()
				.playTimeTop10(rankingRepository.findTop10ByPlayTime(pageable))
				.totalTryTop10(rankingRepository.findTop10ByTotalTry(pageable))
				.scoreTop10(rankingRepository.findTop10ByScore(pageable))
				.build();

			log.info("랭킹 - 상위 10명 랭킹 정보 조회 완료");
			return response;
		} catch (Exception e) {
			log.error("랭킹 - 상위 10명 랭킹 정보 조회 실패: error={}", e.getMessage());
			throw new DatabaseException("상위 10명 랭킹 정보 조회 중 오류가 발생했습니다.", e);
		}
	}

	@Override
	public Ranking createRankingInfo(int userId, LocalTime playtime, float score, int totalTry) {
		try {
			User user = authRepository.findByUserId(userId).orElseThrow(() -> new NotFoundException("없는 유저 id 입니다."));
			Ranking response = Ranking.builder()
				.user(user)
				.playTime(playtime)
				.score(score)
				.totalTry(totalTry)
				.build();

			return rankingRepository.save(response);
		} catch (Exception e) {
			log.error("랭킹 생성 실패: error={}", e.getMessage());
			throw new DatabaseException("랭킹 생성 중 오류가 발생했습니다.", e);
		}
	}

	@Override
	public Ranking updateRankingInfo(int userId, LocalTime playtime, float score, int totalTry) {
		try {
			User user = authRepository.findByUserId(userId).orElseThrow(() -> new NotFoundException("없는 유저 id 입니다."));
			Ranking response = rankingRepository.findById(user)
				.orElseThrow(() -> new NotFoundException("랭킹이 존재하지 않습니다."));
			response.setPlayTime(playtime);
			response.setScore(score);
			response.setTotalTry(totalTry);

			return rankingRepository.save(response);
		} catch (Exception e) {
			log.error("랭킹 수정 실패: error={}", e.getMessage());
			throw new DatabaseException("랭킹 수정 중 오류가 발생했습니다.", e);
		}
	}
}
