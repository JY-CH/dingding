package com.ssafy.ddingga.domain.replay.service;

import java.io.IOException;
import java.time.DayOfWeek;
import java.time.Duration;
import java.time.LocalDateTime;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.github.dockerjava.api.exception.UnauthorizedException;
import com.ssafy.ddingga.domain.auth.entity.User;
import com.ssafy.ddingga.domain.auth.repository.AuthRepository;
import com.ssafy.ddingga.domain.rank.entity.Ranking;
import com.ssafy.ddingga.domain.rank.repository.RankingRepository;
import com.ssafy.ddingga.domain.rank.service.RankingService;
import com.ssafy.ddingga.domain.replay.entity.Replay;
import com.ssafy.ddingga.domain.replay.repository.ReplayRepository;
import com.ssafy.ddingga.domain.song.entity.Song;
import com.ssafy.ddingga.domain.song.repository.SongRepository;
import com.ssafy.ddingga.facade.replay.dto.request.ReplayCreateRequestDto;
import com.ssafy.ddingga.facade.replay.dto.response.ReplayDto;
import com.ssafy.ddingga.global.error.exception.FileUploadException;
import com.ssafy.ddingga.global.error.exception.ReplayNotFoundException;
import com.ssafy.ddingga.global.error.exception.ServiceException;
import com.ssafy.ddingga.global.error.exception.SongNotFoundException;
import com.ssafy.ddingga.global.error.exception.UserNotFoundException;
import com.ssafy.ddingga.global.service.S3Service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor  // final 필드에 대한 생성자를 자동으로 생성
public class ReplayServiceImpl implements ReplayService {

	private final ReplayRepository replayRepository;
	private final AuthRepository authRepository;
	private final SongRepository songRepository;
	private final RankingRepository rankingRepository;
	private final RankingService rankingService;
	private final S3Service service;
	private final S3Service s3Service;

	@Override
	public List<ReplayDto> getLastWeekReplays(Integer userId) {
		log.info("리플레이 - 지난주 리플레이 조회 요청: userId={}", userId);
		if (!authRepository.existsById(userId)) {
			log.error("리플레이 - 사용자를 찾을 수 없음: userId={}", userId);
			throw new UserNotFoundException("사용자를 찾을 수 없습니다.");
		}
		LocalDateTime now = LocalDateTime.now();

		// 7일 전 날짜 계산
		LocalDateTime oneWeekAgo = now.minusWeeks(1);

		log.debug("리플레이 - 조회 기간 설정: start={}, end={}", oneWeekAgo, now);

		try {
			List<Replay> replays = replayRepository.findThisWeekReplayByUserId(userId, oneWeekAgo, now);
			log.info("리플레이 - 지난주 리플레이 조회 완료: userId={}, replayCount={}", userId, replays.size());

			List<ReplayDto> result = replays.stream()
				.map(replay -> ReplayDto.builder()
					.replayId(replay.getReplayId())
					.song(replay.getSong())
					.score(replay.getScore())
					.mode(replay.getMode())
					.videoPath(replay.getVideoPath())
					.practiceDate(replay.getPracticeDate())
					.build())
				.toList();

			log.debug("리플레이 - DTO 변환 완료: userId={}, resultCount={}", userId, result.size());
			return result;
		} catch (Exception e) {
			log.error("리플레이 - 지난주 리플레이 조회 실패: userId={}, error={}", userId, e.getMessage());
			throw new ServiceException("리플레이 조회 중 오류가 발생했습니다.", e);
		}
	}

	// @Override
	// public List<ReplayDto> getLastWeekReplays(Integer userId) {
	// 	log.info("리플레이 - 이번주 리플레이 조회 요청: userId={}", userId);
	// 	if (!authRepository.existsById(userId)) {
	// 		log.error("리플레이 - 사용자를 찾을 수 없음: userId={}", userId);
	// 		throw new UserNotFoundException("사용자를 찾을 수 없습니다.");
	// 	}
	// 	LocalDateTime now = LocalDateTime.now();
	//
	// 	// 이번 주 월요일 00:00:00 시간 계산
	// 	// previousOrSame: 현재 날짜로부터 가장 가까운 월요일(당일 포함)을 찾음
	// 	LocalDateTime weekStart = now.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY))
	// 		.withHour(0)
	// 		.withMinute(0)
	// 		.withSecond(0);
	// 	LocalDateTime weekEnd = weekStart.plusWeeks(1);
	// 	log.debug("리플레이 - 조회 기간 설정: start={}, end={}", weekStart, weekEnd);
	//
	// 	// Replay 엔티티 리스트를 ReplayDto 리스트로 변환
	//
	// 	try {
	// 		List<Replay> replays = replayRepository.findThisWeekReplayByUserId(userId, weekStart, weekEnd);
	// 		log.info("리플레이 - 이번주 리플레이 조회 완료: userId={}, replayCount={}", userId, replays.size());
	//
	// 		// Replay 엔티티 리스트를 ReplayDto 리스트로 변환
	// 		List<ReplayDto> result = replays.stream()// List를 Steam으로 변환, Stream은 데이터의 흐름을 의미 여러 데이터를 순차적으로 처리할 수 있게해준다
	// 			.map(replay -> ReplayDto.builder()// map은 Stream의 각 요소를 다른 형태로 변환 여기서는 replay의 엔티티를 ReplayDto로 변환
	// 				.replayId(replay.getReplayId())
	// 				.songTitle(replay.getSong().getSongTitle())
	// 				.score(replay.getScore())
	// 				.mode(replay.getMode())
	// 				.videoPath(replay.getVideoPath())
	// 				.practiceDate(replay.getPracticeDate())
	// 				.build())
	// 			.toList();
	//
	// 		log.debug("리플레이 - DTO 변환 완료: userId={}, resultCount={}", userId, result.size());
	// 		return result;
	// 	} catch (Exception e) {
	// 		log.error("리플레이 - 이번주 리플레이 조회 실패: userId={}, error={}", userId, e.getMessage());
	// 		throw new ServiceException("리플레이 조회 중 오류가 발생했습니다.", e);
	// 	}
	// }

	@Override
	public List<Replay> getLastWeekReplays() {
		LocalDateTime now = LocalDateTime.now();

		// 이번 주 월요일 00:00:00 시간 계산
		// previousOrSame: 현재 날짜로부터 가장 가까운 월요일(당일 포함)을 찾음
		LocalDateTime weekStart = now.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY))
			.withHour(0)
			.withMinute(0)
			.withSecond(0);
		LocalDateTime weekEnd = weekStart.plusWeeks(1);
		log.debug("리플레이 - 조회 기간 설정: start={}, end={}", weekStart, weekEnd);

		try {
			log.info("이번 주의 재생 기록을 조회합니다.");
			List<Replay> replays = replayRepository.findThisWeekReplay(weekStart, weekEnd);
			log.info("이번 주의 재생 기록 {}개 조회됨", replays.size());
			return replays;
		} catch (Exception e) {
			log.error("이번 주의 재생 기록 조회 중 예외 발생: ", e);
			return new ArrayList<>();
		}
	}

	@Override
	public List<ReplayDto> getAllReplays(Integer userId) {
		if (!authRepository.existsById(userId)) {
			log.error("리플레이 - 사용자를 찾을 수 없음: userId={}", userId);
			throw new UserNotFoundException("사용자를 찾을 수 없습니다.");
		}
		try {
			List<Replay> replays = replayRepository.findReplaysByUser_UserId(userId);
			log.info("리플레이 - 유저별 리플레이 조회 성공 : userId = {}, replayCount = {}", userId, replays.size());

			// replay 엔티티를 Dto로 변환
			List<ReplayDto> result = replays.stream()
				.map(replay -> ReplayDto.builder()
					.replayId(replay.getReplayId())
					.song(replay.getSong())
					.score(replay.getScore())
					.mode(replay.getMode())
					.videoPath(replay.getVideoPath())
					.practiceDate(replay.getPracticeDate())
					.build())
				.toList();

			log.info("리플레이 - DTO 변환 완료 : userId={},replayCount={}", userId, result.size());
			return result;

		} catch (Exception e) {
			log.error("리플레이 - 유저별 리플레이 조회 실패 : userId={}, error={}", userId, e.getMessage());
			throw new ServiceException("리플레이 조회 중 오류가 발생했습니다.", e);
		}
	}

	@Override
	public Replay createReplay(Integer userId, ReplayCreateRequestDto requestDto) {
		// 1. 사용자와 곡 정보 조회

		User user = authRepository.findById(userId).orElseThrow(() -> {
			log.error("리플레이 - 사용자를 찾을 수 없음 : userId= {}", userId);
			return new UserNotFoundException("사용자를 찾을 수 없습니다.");
		});
		Song song = songRepository.findById(requestDto.getSongId()).orElseThrow(() -> {
			log.error("리플레이 - 곡 정보를 찾을 수 없음 : songId = {}", requestDto.getSongId());
			return new SongNotFoundException("곡을 찾을 수 없습니다.");
		});

		Ranking ranking = rankingRepository.findByUser_UserId(user.getUserId()).orElse(null);
		if (ranking == null) {
			log.info("리플레이 - 랭킹 정보가 없으므로 새로 생성 : userId={}", userId);
			String[] timeArr = requestDto.getVideoTime().split(":");

			Duration playTime = Duration.ofHours(Integer.parseInt(timeArr[0]))
				.plusMinutes(Integer.parseInt(timeArr[1]))
				.plusSeconds(Integer.parseInt(timeArr[2]));
			rankingService.createRankingInfo(user.getUserId(), playTime, requestDto.getScore(), 1);
			log.info("리플레이 - 랭킹 정보 생성 완료 : userId={}", userId);
		} else {
			log.info("리플레이 - 기존 랭킹 정보 존재, 점수 업데이트 시작 : userId={}", userId);
			String[] timeArr = requestDto.getVideoTime().split(":");
			Duration playTime = Duration.ofHours(Integer.parseInt(timeArr[0]))
				.plusMinutes(Integer.parseInt(timeArr[1]))
				.plusSeconds(Integer.parseInt(timeArr[2]));
			float existingScore = ranking.getScore() * ranking.getTotalTry();
			float resultScore = (existingScore + requestDto.getScore()) / (ranking.getTotalTry() + 1);

			// 랭킹의 총 시간, 횟수, 점수 수정
			ranking.setPlayTime(ranking.getPlayTime().plus(playTime));
			ranking.setTotalTry(ranking.getTotalTry() + 1);
			ranking.setScore(resultScore);

			rankingRepository.save(ranking);
			log.info("리플레이 - 기존 랭킹 정보 업데이트 완료 : userId={}", userId);
		}

		try {
			// 2. S3에 비디오 파일 업로드
			String videoUrl = s3Service.uploadFile(requestDto.getVideoFile(), "replays");

			// 3. Replay 엔티티 생성 및 저장
			Replay replay = Replay.builder()
				.user(user)
				.song(song)
				.score(requestDto.getScore())
				.mode(requestDto.getMode())
				.videoPath(videoUrl)
				.practiceDate(LocalDateTime.now())
				.build();

			return replayRepository.save(replay);
		} catch (IOException e) {
			log.error("리플레이 - 파일 업로드 실패 : {}", e.getMessage());
			throw new FileUploadException("파일 업로드에 실패했습니다.", e);
		}
	}

	@Override
	@Transactional
	public void deleteReplay(Integer replayId, Integer userId) {
		Replay replay = replayRepository.findById(replayId)
			.orElseThrow(() -> new ReplayNotFoundException("리플레이를 찾을 수 없습니다."));

		if (!replay.getUser().getUserId().equals(userId)) {
			throw new UnauthorizedException("해당 리플레이를 삭제할 권한이 없습니다.");
		}
		// S3에서 비디오 파일 삭제
		s3Service.deleteFile(replay.getVideoPath());

		// 리플레이 삭제
		replayRepository.delete(replay);
	}
}
