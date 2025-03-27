package com.ssafy.ddingga.domain.replay.service;

import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.time.temporal.TemporalAdjusters;
import java.util.List;

import org.springframework.stereotype.Service;

import com.ssafy.ddingga.domain.replay.entity.Replay;
import com.ssafy.ddingga.domain.replay.repository.ReplayRepository;
import com.ssafy.ddingga.facade.dashboard.dto.response.ReplayDto;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor  // final 필드에 대한 생성자를 자동으로 생성
public class ReplayServiceImpl implements ReplayService {

	private final ReplayRepository replayRepository;

	@Override
	public List<ReplayDto> getLastWeekReplays(Integer userId) {
		LocalDateTime now = LocalDateTime.now();

		// 이번 주 월요일 00:00:00 시간 계산
		// previousOrSame: 현재 날짜로부터 가장 가까운 월요일(당일 포함)을 찾음
		LocalDateTime weekStart = now.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY))
			.withHour(0)
			.withMinute(0)
			.withSecond(0);
		LocalDateTime weekEnd = weekStart.plusWeeks(1);

		// Repository에서 해당 기간의 Replay 엔티티 리스트를 조회
		List<Replay> replays = replayRepository.findThisWeekReplayByUserId(userId, weekStart,
			weekEnd); // 이 시점에서 replays는 Replay엔티티들의 리스트

		// Replay 엔티티 리스트를 ReplayDto 리스트로 변환
		return replays.stream() // List를 Steam으로 변환, Stream은 데이터의 흐름을 의미 여러 데이터를 순차적으로 처리할 수 있게해준다
			.map(replay -> ReplayDto.builder() // map은 Stream의 각 요소를 다른 형태로 변환 여기서는 replay의 엔티티를 ReplayDto로 변환
				.replayId(replay.getReplayId())
				.songTitle(replay.getSong().getSongTitle())
				.score(replay.getScore())
				.mode(replay.getMode())
				.videoPath(replay.getVideoPath())
				.practiceDate(replay.getPracticeDate())
				.build())
			.toList(); // 스트림을 다시 리스트로 변환
	}
}
