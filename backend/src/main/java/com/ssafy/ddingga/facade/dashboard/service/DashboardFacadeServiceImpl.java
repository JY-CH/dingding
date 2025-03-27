package com.ssafy.ddingga.facade.dashboard.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.ddingga.domain.dashboard.service.DashboardService;
import com.ssafy.ddingga.domain.replay.entity.Replay;
import com.ssafy.ddingga.domain.song.entity.ChordScore;
import com.ssafy.ddingga.facade.dashboard.dto.response.ChordScoreDto;
import com.ssafy.ddingga.facade.dashboard.dto.response.DashboardResponse;
import com.ssafy.ddingga.facade.dashboard.dto.response.ReplayDto;
import com.ssafy.ddingga.facade.rank.dto.RankingInfo;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardFacadeServiceImpl implements DashboardFacadeService {
	private final DashboardService dashboardService;

	@Override
	public DashboardResponse getDashboard(Integer userId, LocalDateTime weekStart, LocalDateTime weekEnd) {
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
		List<Replay> replays = dashboardService.getThisWeekReplays(userId, weekStart, weekEnd);
		List<ReplayDto> replayDtos = replays.stream()
			.map(replay -> ReplayDto.builder()
				.replayId(replay.getReplayId())
				.songTitle(replay.getSong().getSongTitle())
				.score(replay.getScore())
				.mode(replay.getMode())
				.videoPath(replay.getVideoPath())
				.practiceDate(replay.getPracticeDate())
				.build())
			.toList();

		// dashboard Response 생성
		return DashboardResponse.builder()
			.userId(userId)
			.playtime(rankingInfo.getPlayTime())
			.playtimeRank(rankingInfo.getPlayTimeRank())
			.totalTry(rankingInfo.getTotalTry())
			.totalTryRank(rankingInfo.getTotalTryRank())
			.chordScoreDtos(chordScoreDtos)
			.replays(replayDtos)
			.build();
	}

}
