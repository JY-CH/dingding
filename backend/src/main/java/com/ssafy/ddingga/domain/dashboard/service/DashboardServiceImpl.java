package com.ssafy.ddingga.domain.dashboard.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.ddingga.domain.rank.repository.RankingRepository;
import com.ssafy.ddingga.domain.replay.service.ReplayService;
import com.ssafy.ddingga.domain.song.entity.ChordScore;
import com.ssafy.ddingga.domain.song.repository.ChordScoreRepository;
import com.ssafy.ddingga.facade.dashboard.dto.response.ReplayDto;
import com.ssafy.ddingga.facade.rank.dto.RankingInfo;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardServiceImpl implements DashboardService {

	private final RankingRepository rankingRepository;
	private final ChordScoreRepository chordScoreRepository;
	private final ReplayService replayService;

	@Override
	public RankingInfo getRankingInfo(Integer userId) {
		return rankingRepository.findRankingByUserId(userId);
	}

	@Override
	public List<ChordScore> getChordScores(Integer userId) {
		return chordScoreRepository.findByUser_UserId(userId);
	}

	@Override
	public List<ReplayDto> getThisWeekReplays(Integer userId) {
		return replayService.getLastWeekReplays(userId);
	}
}
