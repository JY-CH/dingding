package com.ssafy.ddingga.domain.dashboard.service;

import java.util.List;

import com.ssafy.ddingga.domain.song.entity.ChordScore;
import com.ssafy.ddingga.facade.dashboard.dto.response.ReplayDto;
import com.ssafy.ddingga.facade.rank.dto.RankingInfo;

public interface DashboardService {
	RankingInfo getRankingInfo(Integer userId);

	List<ChordScore> getChordScores(Integer userId);

	List<ReplayDto> getThisWeekReplays(Integer userId);
}
