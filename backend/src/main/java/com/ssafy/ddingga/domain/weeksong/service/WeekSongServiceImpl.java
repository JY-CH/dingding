package com.ssafy.ddingga.domain.weeksong.service;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import com.ssafy.ddingga.domain.weeksong.entity.WeekSong;
import com.ssafy.ddingga.domain.weeksong.repository.WeekSongRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class WeekSongServiceImpl implements WeekSongService {
	private final WeekSongRepository weekSongRepository;

	@Override
	public WeekSong getWeekSongs() {
		WeekSong weekSong = null;

		try {
			weekSong = weekSongRepository.findByStartDateBeforeAndEndDateAfter(LocalDateTime.now());
			if (weekSong != null) {
				log.info("주간 노래 정보 조회 성공: {}", weekSong.getSong().getSongTitle());
			} else {
				log.warn("현재 시간에 해당하는 주간 노래 정보가 존재하지 않습니다.");
			}
		} catch (Exception e) {
			log.error("주간 노래 정보 조회 중 예외 발생: ", e);
		}

		return weekSong;
	}
}

