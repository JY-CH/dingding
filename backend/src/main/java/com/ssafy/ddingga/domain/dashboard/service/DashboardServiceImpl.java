package com.ssafy.ddingga.domain.dashboard.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.ddingga.domain.rank.repository.RankingRepository;
import com.ssafy.ddingga.domain.replay.entity.Replay;
import com.ssafy.ddingga.domain.replay.repository.ReplayRepository;
import com.ssafy.ddingga.domain.song.entity.ChordScore;
import com.ssafy.ddingga.domain.song.repository.ChordScoreRepository;
import com.ssafy.ddingga.facade.rank.dto.RankingInfo;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardServiceImpl implements DashboardService {

	private final RankingRepository rankingRepository;
	private final ChordScoreRepository chordScoreRepository;
	private final ReplayRepository replayRepository;

	@Override
	public RankingInfo getRankingInfo(Integer userId) {
		return rankingRepository.findRankingByUserId(userId);
	}

	@Override
	public List<ChordScore> getChordScores(Integer userId) {
		return chordScoreRepository.findByUserId(userId);
	}

	@Override
	public List<Replay> getThisWeekReplays(Integer userId, LocalDateTime weekStart, LocalDateTime weekEnd) {
		return replayRepository.findThisWeekReplayByUserId(userId, weekStart, weekEnd);
	}
}
