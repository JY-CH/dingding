package com.ssafy.ddingga.facade.dashboard.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.ddingga.domain.dashboard.service.DashboardService;
import com.ssafy.ddingga.domain.song.entity.ChordScore;
import com.ssafy.ddingga.facade.dashboard.dto.response.ChordScoreDto;
import com.ssafy.ddingga.facade.dashboard.dto.response.DashboardResponse;
import com.ssafy.ddingga.facade.rank.dto.RankingInfo;
import com.ssafy.ddingga.facade.replay.dto.response.ReplayDto;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardFacadeServiceImpl implements DashboardFacadeService {
	private final DashboardService dashboardService;

	@Override
	public DashboardResponse getDashboard(Integer userId, String username) {
		// 순위정보 조회
		RankingInfo rankingInfo = dashboardService.getRankingInfo(userId);

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

		// dashboard Response 생성
		return DashboardResponse.builder()
			.userId(userId)
			.username(username)
			.playtime(rankingInfo.getPlayTime())
			.playtimeRank(rankingInfo.getPlayTimeRank())
			.totalTry(rankingInfo.getTotalTry())
			.totalTryRank(rankingInfo.getTotalTryRank())
			.chordScoreDtos(chordScoreDtos)
			.replays(replayDtos)
			.build();
	}

}
