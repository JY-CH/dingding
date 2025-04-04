package com.ssafy.ddingga.domain.rank.service;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.ssafy.ddingga.domain.auth.entity.User;
import com.ssafy.ddingga.domain.auth.repository.AuthRepository;
import com.ssafy.ddingga.domain.rank.entity.Ranking;
import com.ssafy.ddingga.domain.rank.repository.RankingRepository;
import com.ssafy.ddingga.facade.rank.dto.response.RankingInfo;
import com.ssafy.ddingga.facade.rank.dto.response.TopRankingInfo;
import com.ssafy.ddingga.facade.rank.dto.response.TopRankingInfoForPlayTime;
import com.ssafy.ddingga.facade.rank.dto.response.TopRankingResponse;
import com.ssafy.ddingga.global.error.exception.DatabaseException;
import com.ssafy.ddingga.global.error.exception.NotFoundException;
import com.ssafy.ddingga.global.error.exception.UserNotFoundException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class RankingServiceImpl implements RankingService {
	private final RankingRepository rankingRepository;
	private final AuthRepository authRepository;

	@Override
	public RankingInfo getRankingInfo(Integer userId) {
		log.info("랭킹 - 랭킹 정보 조회 요청: userId={}", userId);
		if (!authRepository.existsById(userId)) {
			log.error("랭킹 - 사용자를 찾을 수 없음: userId={}", userId);
			throw new UserNotFoundException("사용자를 찾을 수 없습니다.");
		}

		try {
			RankingInfo result = rankingRepository.findRankingByUserId(userId);
			log.info("랭킹 - 랭킹 정보 조회 완료: userId={}, result={}", userId, result);
			return result;
		} catch (Exception e) {
			log.error("랭킹 - 랭킹 정보 조회 실패: userId={}, error={}", userId, e.getMessage());
			throw new DatabaseException("랭킹 정보 조회 중 오류가 발생했습니다.", e);
		}
	}

	@Override
	public TopRankingResponse getTop10Rankings() {
		log.info("랭킹 - 상위 10명 랭킹 정보 조회 요청");
		try {
			Pageable pageable = PageRequest.of(0, 10);

			// Duration 프론트로 보낼 String 00:00:00으로 변환
			List<TopRankingInfo> top10ByPlayTime = rankingRepository.findTop10ByPlayTime(pageable);
			List<TopRankingInfo> top10ByTotalTry = rankingRepository.findTop10ByTotalTry(pageable);
			List<TopRankingInfo> top10ByScore = rankingRepository.findTop10ByScore(pageable);

			List<TopRankingInfoForPlayTime> topRankingInfoForPlayTimeList = new ArrayList<>();
			List<TopRankingInfoForPlayTime> topRankingInfoForTotalTryList = new ArrayList<>();
			List<TopRankingInfoForPlayTime> topRankingInfoForScoreList = new ArrayList<>();

			// 총 플레이 시간 순위
			for (TopRankingInfo topRankingInfo : top10ByPlayTime) {

				Duration duration = Duration.ofSeconds(topRankingInfo.getPlayTime().getSeconds());

				// 시간, 분, 초를 두 자리로 포맷하고 이어붙임
				String requestTime = String.format("%02d", duration.toHours()) + ":" +
					String.format("%02d", duration.toMinutes() % 60) + ":" +
					String.format("%02d", duration.getSeconds() % 60);

				TopRankingInfoForPlayTime topRankingInfoForPlayTime = TopRankingInfoForPlayTime.builder()
					.playTime(requestTime)
					.rank(topRankingInfo.getRank())
					.username(topRankingInfo.getUsername())
					.playTime(requestTime)
					.totalTry(topRankingInfo.getTotalTry())
					.score(topRankingInfo.getScore())
					.build();

				topRankingInfoForPlayTimeList.add(topRankingInfoForPlayTime);
			}

			// 총 시도 순위
			for (TopRankingInfo topRankingInfo : top10ByTotalTry) {

				Duration duration = Duration.ofSeconds(topRankingInfo.getPlayTime().getSeconds());

				// 시간, 분, 초를 두 자리로 포맷하고 이어붙임
				String requestTime = String.format("%02d", duration.toHours()) + ":" +
					String.format("%02d", duration.toMinutes() % 60) + ":" +
					String.format("%02d", duration.getSeconds() % 60);

				TopRankingInfoForPlayTime topRankingInfoForPlayTime = TopRankingInfoForPlayTime.builder()
					.playTime(requestTime)
					.rank(topRankingInfo.getRank())
					.username(topRankingInfo.getUsername())
					.playTime(requestTime)
					.totalTry(topRankingInfo.getTotalTry())
					.score(topRankingInfo.getScore())
					.build();

				topRankingInfoForTotalTryList.add(topRankingInfoForPlayTime);
			}

			// 총 점수 순위
			for (TopRankingInfo topRankingInfo : top10ByScore) {

				Duration duration = Duration.ofSeconds(topRankingInfo.getPlayTime().getSeconds());

				// 시간, 분, 초를 두 자리로 포맷하고 이어붙임
				String requestTime = String.format("%02d", duration.toHours()) + ":" +
					String.format("%02d", duration.toMinutes() % 60) + ":" +
					String.format("%02d", duration.getSeconds() % 60);

				TopRankingInfoForPlayTime topRankingInfoForPlayTime = TopRankingInfoForPlayTime.builder()
					.playTime(requestTime)
					.rank(topRankingInfo.getRank())
					.username(topRankingInfo.getUsername())
					.playTime(requestTime)
					.totalTry(topRankingInfo.getTotalTry())
					.score(topRankingInfo.getScore())
					.build();

				topRankingInfoForScoreList.add(topRankingInfoForPlayTime);
			}

			TopRankingResponse response = TopRankingResponse.builder()
				.playTimeTop10(topRankingInfoForPlayTimeList)
				.totalTryTop10(topRankingInfoForTotalTryList)
				.scoreTop10(topRankingInfoForScoreList)
				.build();

			log.info("랭킹 - 상위 10명 랭킹 정보 조회 완료");
			return response;
		} catch (Exception e) {
			log.error("랭킹 - 상위 10명 랭킹 정보 조회 실패: error={}", e.getMessage());
			throw new DatabaseException("상위 10명 랭킹 정보 조회 중 오류가 발생했습니다.", e);
		}
	}

	@Override
	public Ranking createRankingInfo(int userId, Duration playtime, float score, int totalTry) {
		try {
			User user = authRepository.findByUserId(userId).orElseThrow(() -> new NotFoundException("없는 유저 id 입니다."));
			Ranking response = Ranking.builder()
				.user(user)
				.playTime(playtime)
				.score(score)
				.totalTry(totalTry)
				.build();

			return rankingRepository.save(response);
		} catch (Exception e) {
			log.error("랭킹 생성 실패: error={}", e.getMessage());
			throw new DatabaseException("랭킹 생성 중 오류가 발생했습니다.", e);
		}
	}

	@Override
	public Ranking updateRankingInfo(int userId, Duration playtime, float score, int totalTry) {
		try {
			User user = authRepository.findByUserId(userId).orElseThrow(() -> new NotFoundException("없는 유저 id 입니다."));
			Ranking response = rankingRepository.findById(user.getUserId())
				.orElseThrow(() -> new NotFoundException("랭킹이 존재하지 않습니다."));
			response.setPlayTime(playtime);
			response.setScore(score);
			response.setTotalTry(totalTry);

			return rankingRepository.save(response);
		} catch (Exception e) {
			log.error("랭킹 수정 실패: error={}", e.getMessage());
			throw new DatabaseException("랭킹 수정 중 오류가 발생했습니다.", e);
		}
	}
}
