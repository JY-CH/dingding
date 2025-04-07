package com.ssafy.ddingga.facade.weeksongranking.service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;

import org.springframework.stereotype.Service;

import com.ssafy.ddingga.domain.replay.entity.Replay;
import com.ssafy.ddingga.domain.replay.service.ReplayService;
import com.ssafy.ddingga.domain.weeksong.entity.WeekSong;
import com.ssafy.ddingga.domain.weeksong.service.WeekSongService;
import com.ssafy.ddingga.facade.weeksongranking.dto.response.GetWeekSongRankingResponseDto;
import com.ssafy.ddingga.facade.weeksongranking.dto.response.WeekSongUserInfo;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class WeekSongRankingFacadeServiceImpl implements WeekSongRankingFacadeService {
	private final WeekSongService weekSongService;
	private final ReplayService replayService;

	@Override
	public GetWeekSongRankingResponseDto getWeekSongRanking() {
		List<WeekSongUserInfo> responseDto = new ArrayList<>();
		GetWeekSongRankingResponseDto responseResult = new GetWeekSongRankingResponseDto();
		WeekSong weekSong = null;
		HashMap<String, Integer> weekRankingMap = new HashMap<>();

		try {
			// 주간 노래 정보를 가져옴
			weekSong = weekSongService.getWeekSongs();
			if (weekSong == null) {
				log.error("주간 노래 정보를 찾을 수 없습니다.");
				return responseResult; // 비어있는 리스트 반환
			}
			log.info("주간 노래 정보 가져오기 성공: {}", weekSong.getSong().getSongTitle());

			List<Replay> replays = replayService.getLastWeekReplays();
			if (replays.isEmpty()) {
				log.info("지난 주의 재생 기록이 없습니다.");
			}

			for (Replay replay : replays) {
				if (weekSong.getSong().getSongId().equals(replay.getSong().getSongId())) {
					// weekRankingMap 에 해당 유저가 없으면 추가하고,
					if (!weekRankingMap.containsKey(replay.getUser().getUsername())) {
						weekRankingMap.put(replay.getUser().getUsername(), replay.getScore());
					} else {
						// 없으면 weekRankingMap 에 점수 비교해서 다시 담기
						if (weekRankingMap.get(replay.getUser().getUsername()) < replay.getScore()) {
							weekRankingMap.put(replay.getUser().getUsername(), replay.getScore());
						}
					}
				}
			}

			for (HashMap.Entry<String, Integer> entry : weekRankingMap.entrySet()) {
				WeekSongUserInfo weekSongUserInfo = WeekSongUserInfo.builder()
					.score(entry.getValue())
					.username(entry.getKey())
					.build();
				responseDto.add(weekSongUserInfo);
			}

			responseResult.setSong(weekSong.getSong());
			responseResult.setUserInfo(responseDto);

			// 점수 기준으로 내림차순 정렬
			responseResult.getUserInfo().sort(Comparator.comparing(WeekSongUserInfo::getScore).reversed());
			log.info("랭킹 정렬 완료");

			// 상위 10개만 반환
			if (responseDto.size() > 10) {
				responseDto = responseDto.subList(0, 10);
				log.info("상위 10개만 반환");
			}

		} catch (Exception e) {
			log.error("주간 랭킹 조회 중 예외 발생: ", e);
		}

		return responseResult;
	}
}

