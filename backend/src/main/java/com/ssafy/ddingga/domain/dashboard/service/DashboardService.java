package com.ssafy.ddingga.domain.dashboard.service;

import java.time.LocalDateTime;
import java.util.List;

import com.ssafy.ddingga.domain.replay.entity.Replay;
import com.ssafy.ddingga.domain.song.entity.ChordScore;
import com.ssafy.ddingga.facade.rank.dto.RankingInfo;

public interface DashboardService {
	RankingInfo getRankingInfo(Integer userId);

	List<ChordScore> getChordScores(Integer userId);

	List<Replay> getThisWeekReplays(Integer userId, LocalDateTime weekStart, LocalDateTime weekEnd);
}
