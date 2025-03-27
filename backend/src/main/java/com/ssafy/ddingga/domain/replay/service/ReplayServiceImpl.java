package com.ssafy.ddingga.domain.replay.service;

import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.time.temporal.TemporalAdjusters;
import java.util.List;

import org.springframework.stereotype.Service;

import com.ssafy.ddingga.domain.auth.repository.AuthRepository;
import com.ssafy.ddingga.domain.replay.entity.Replay;
import com.ssafy.ddingga.domain.replay.repository.ReplayRepository;
import com.ssafy.ddingga.facade.dashboard.dto.response.ReplayDto;
import com.ssafy.ddingga.global.error.exception.ServiceException;
import com.ssafy.ddingga.global.error.exception.UserNotFoundException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor  // final 필드에 대한 생성자를 자동으로 생성
public class ReplayServiceImpl implements ReplayService {

	private final ReplayRepository replayRepository;
	private final AuthRepository authRepository;

	@Override
	public List<ReplayDto> getLastWeekReplays(Integer userId) {
		log.info("리플레이 - 이번주 리플레이 조회 요청: userId={}", userId);
		if (!authRepository.existsById(userId)) {
			log.error("리플레이 - 사용자를 찾을 수 없음: userId={}", userId);
			throw new UserNotFoundException("사용자를 찾을 수 없습니다.");
		}
		LocalDateTime now = LocalDateTime.now();

		// 이번 주 월요일 00:00:00 시간 계산
		// previousOrSame: 현재 날짜로부터 가장 가까운 월요일(당일 포함)을 찾음
		LocalDateTime weekStart = now.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY))
			.withHour(0)
			.withMinute(0)
			.withSecond(0);
		LocalDateTime weekEnd = weekStart.plusWeeks(1);
		log.debug("리플레이 - 조회 기간 설정: start={}, end={}", weekStart, weekEnd);

		// Replay 엔티티 리스트를 ReplayDto 리스트로 변환

		try {
			List<Replay> replays = replayRepository.findThisWeekReplayByUserId(userId, weekStart, weekEnd);
			log.info("리플레이 - 이번주 리플레이 조회 완료: userId={}, replayCount={}", userId, replays.size());

			// Replay 엔티티 리스트를 ReplayDto 리스트로 변환
			List<ReplayDto> result = replays.stream()// List를 Steam으로 변환, Stream은 데이터의 흐름을 의미 여러 데이터를 순차적으로 처리할 수 있게해준다
				.map(replay -> ReplayDto.builder()// map은 Stream의 각 요소를 다른 형태로 변환 여기서는 replay의 엔티티를 ReplayDto로 변환
					.replayId(replay.getReplayId())
					.songTitle(replay.getSong().getSongTitle())
					.score(replay.getScore())
					.mode(replay.getMode())
					.videoPath(replay.getVideoPath())
					.practiceDate(replay.getPracticeDate())
					.build())
				.toList();

			log.debug("리플레이 - DTO 변환 완료: userId={}, resultCount={}", userId, result.size());
			return result;
		} catch (Exception e) {
			log.error("리플레이 - 이번주 리플레이 조회 실패: userId={}, error={}", userId, e.getMessage());
			throw new ServiceException("리플레이 조회 중 오류가 발생했습니다.", e);
		}
	}
}
