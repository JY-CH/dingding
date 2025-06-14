package com.ssafy.ddingga.facade.dashboard.service;

import java.time.Duration;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.ddingga.domain.auth.entity.User;
import com.ssafy.ddingga.domain.auth.repository.AuthRepository;
import com.ssafy.ddingga.domain.dashboard.service.DashboardService;
import com.ssafy.ddingga.domain.song.entity.ChordScore;
import com.ssafy.ddingga.facade.dashboard.dto.response.ChordScoreDto;
import com.ssafy.ddingga.facade.dashboard.dto.response.DashboardResponse;
import com.ssafy.ddingga.facade.rank.dto.response.RankingInfo;
import com.ssafy.ddingga.facade.replay.dto.response.ReplayDto;
import com.ssafy.ddingga.global.error.exception.UserNotFoundException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardFacadeServiceImpl implements DashboardFacadeService {
	private final DashboardService dashboardService;
	private final AuthRepository authRepository;

	@Override
	public DashboardResponse getDashboard(Integer userId, String username) {
		// 사용자 정보 조회
		User user = authRepository.findByUserId(userId)
			.orElseThrow(() -> new UserNotFoundException("사용자를 찾을 수 없습니다."));

		// 순위정보 조회
		RankingInfo rankingInfo = dashboardService.getRankingInfo(userId);

		// rankingInfo가 null인 경우 기본값으로 생성
		if (rankingInfo == null) {
			rankingInfo = new RankingInfo(
				// LocalTime.of(0, 0, 0),  // 기본 플레이타임
				Duration.ofSeconds(0),
				0,                      // 기본 시도 횟수
				0.0f,                   // 기본 평균 점수
				0,                      // 기본 플레이타임 랭크
				0,                       // 기본 시도 횟수 랭크
				0                        // 기본 점수 랭크
			);
		}
		// 코드 점수 조회
		List<ChordScore> chordScores = dashboardService.getChordScores(userId);
		List<ChordScoreDto> chordScoreDtos = chordScores.stream()
			.map(chord -> ChordScoreDto.builder()
				.chordType(chord.getSong().getSongTitle())
				.score(chord.getScore())
				.build())
			.toList();
		// 이번주 리플레이 조회
		List<ReplayDto> replayDtos = dashboardService.getThisWeekReplays(userId);

		Duration duration = Duration.ofSeconds(rankingInfo.getPlayTime().getSeconds());

		// 시간, 분, 초를 두 자리로 포맷하고 이어붙임
		String requestTime = String.format("%02d", duration.toHours()) + ":" +
			String.format("%02d", duration.toMinutes() % 60) + ":" +
			String.format("%02d", duration.getSeconds() % 60);

		// dashboard Response 생성
		return DashboardResponse.builder()
			.userId(userId)
			.username(username)
			.loginId(user.getLoginId())
			.createAt(user.getCreateAt().toString())
			.playtime(requestTime)
			.playtimeRank(rankingInfo.getPlayTimeRank())
			.score(rankingInfo.getScore())
			.scoreRank(rankingInfo.getScoreRank())
			.totalTry(rankingInfo.getTotalTry())
			.totalTryRank(rankingInfo.getTotalTryRank())
			.profileImage(user.getProfileImage())
			.chordScoreDtos(chordScoreDtos)
			.replays(replayDtos)
			.build();
	}

}
