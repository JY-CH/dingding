package com.ssafy.ddingga.domain.weeksong.service;

import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.time.temporal.TemporalAdjusters;
import java.util.List;
import java.util.Random;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.ssafy.ddingga.domain.song.entity.Song;
import com.ssafy.ddingga.domain.song.repository.SongRepository;
import com.ssafy.ddingga.domain.weeksong.entity.WeekSong;
import com.ssafy.ddingga.domain.weeksong.repository.WeekSongRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class WeekSongSchedulerServiceImpl implements WeekSongSchedulerService {
	private final WeekSongRepository weekSongRepository;
	private final SongRepository songRepository;

	@Scheduled(cron = "0 0 0 * * MON")
	public void selectWeeklySong() {
		try {
			// 다음 주 월요일 ~ 일요일 계산
			LocalDateTime now = LocalDateTime.now();
			LocalDateTime nextMonday = now.with(TemporalAdjusters.next(DayOfWeek.MONDAY))
				.withHour(0)
				.withMinute(0)
				.withSecond(0);
			LocalDateTime nextSunday = nextMonday.plusDays(6)
				.withHour(23)
				.withMinute(59)
				.withSecond(59);

			// 이미 다음 주 주간 노래가 있는지 확인
			WeekSong existingWeekSong = weekSongRepository.findByStartDateBeforeAndEndDateAfter(nextMonday);
			if (existingWeekSong != null) {
				log.info("다음 주 주간 노래가 이미 존재합니다: {}", existingWeekSong.getSong().getSongTitle());
				return;
			}

			// song_id가 16 이상인 노래들 중 랜덤 선택
			List<Song> eligibleSongs = songRepository.findBySongIdGreaterThanEqual(16);
			if (eligibleSongs.isEmpty()) {
				log.warn("선택 가능한 노래가 없습니다.");
				return;
			}

			Song selectedSong = eligibleSongs.get(new Random().nextInt(eligibleSongs.size()));

			// WeekSong 생성 및 저장
			WeekSong weekSong = WeekSong.builder()
				.song(selectedSong)
				.startDate(nextMonday)
				.endDate(nextSunday)
				.build();

			weekSongRepository.save(weekSong);

			log.info("주간 노래 선정 완료: {} ({} ~ {})",
				selectedSong.getSongTitle(),
				nextMonday,
				nextSunday);
		} catch (Exception e) {
			log.error("주간 노래 선정 중 오류 발생: ", e);
		}
	}
}

