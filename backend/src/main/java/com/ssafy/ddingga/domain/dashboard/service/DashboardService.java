package com.ssafy.ddingga.domain.dashboard.service;

import java.util.List;

import com.ssafy.ddingga.domain.song.entity.ChordScore;
import com.ssafy.ddingga.facade.rank.dto.response.RankingInfo;
import com.ssafy.ddingga.facade.replay.dto.response.ReplayDto;

public interface DashboardService {
	RankingInfo getRankingInfo(Integer userId);

	List<ChordScore> getChordScores(Integer userId);

	List<ReplayDto> getThisWeekReplays(Integer userId);
}
