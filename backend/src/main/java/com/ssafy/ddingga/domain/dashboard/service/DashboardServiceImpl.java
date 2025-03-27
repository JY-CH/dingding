package com.ssafy.ddingga.domain.dashboard.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.ddingga.domain.auth.repository.AuthRepository;
import com.ssafy.ddingga.domain.rank.repository.RankingRepository;
import com.ssafy.ddingga.domain.replay.service.ReplayService;
import com.ssafy.ddingga.domain.song.entity.ChordScore;
import com.ssafy.ddingga.domain.song.repository.ChordScoreRepository;
import com.ssafy.ddingga.facade.dashboard.dto.response.ReplayDto;
import com.ssafy.ddingga.facade.rank.dto.RankingInfo;
import com.ssafy.ddingga.global.error.exception.DatabaseException;
import com.ssafy.ddingga.global.error.exception.ServiceException;
import com.ssafy.ddingga.global.error.exception.UserNotFoundException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardServiceImpl implements DashboardService {

	private final RankingRepository rankingRepository;
	private final ChordScoreRepository chordScoreRepository;
	private final ReplayService replayService;
	private final AuthRepository authRepository;

	@Override
	public RankingInfo getRankingInfo(Integer userId) {
		log.info("대시보드 - 랭킹 정보 조회 요청: userId={}", userId);
		if (!authRepository.existsByUserId(userId)) {
			log.error("대시보드 - 사용자를 찾을 수 없음 : userId = {}", userId);
			throw new UserNotFoundException("사용자를 찾을 수 없습니다.");
		}
		try {
			RankingInfo result = rankingRepository.findRankingByUserId(userId);
			log.info("대시보드 - 랭킹 정보 조회 완료: userId={}, result={}", userId, result);
			return result;
		} catch (Exception e) {
			log.error("대시보드 - 랭킹 정보 조회 실패: userId={}, error={}", userId, e.getMessage());
			throw new DatabaseException("랭킹 정보 조회 중 오류가 발생했습니다.", e);
		}
	}

	@Override
	public List<ChordScore> getChordScores(Integer userId) {
		log.info("대시보드 - 코드 점수 조회 요청: userId={}", userId);

		// 사용자 존재 여부 확인
		if (!authRepository.existsById(userId)) {
			log.error("대시보드 - 사용자를 찾을 수 없음: userId={}", userId);
			throw new UserNotFoundException("사용자를 찾을 수 없습니다.");
		}

		try {
			List<ChordScore> result = chordScoreRepository.findByUser_UserId(userId);
			log.info("대시보드 - 코드 점수 조회 완료: userId={}, result.size={}", userId, result.size());
			return result;
		} catch (Exception e) {
			log.error("대시보드 - 코드 점수 조회 실패: userId={}, error={}", userId, e.getMessage());
			throw new DatabaseException("코드 점수 조회 중 오류가 발생했습니다.", e);
		}
	}

	@Override
	public List<ReplayDto> getThisWeekReplays(Integer userId) {
		log.info("대시보드 - 이번주 리플레이 조회 요청: userId={}", userId);
		if (!authRepository.existsById(userId)) {
			log.error("대시보드 - 사용자를 찾을 수 없음: userId={}", userId);
			throw new UserNotFoundException("사용자를 찾을 수 없습니다.");
		}

		try {
			List<ReplayDto> result = replayService.getLastWeekReplays(userId);
			log.info("대시보드 - 이번주 리플레이 조회 완료: userId={}, result.size={}", userId, result.size());
			return result;
		} catch (Exception e) {
			log.error("대시보드 - 이번주 리플레이 조회 실패: userId={}, error={}", userId, e.getMessage());
			throw new ServiceException("리플레이 조회 중 오류가 발생했습니다.", e);
		}
	}
}
