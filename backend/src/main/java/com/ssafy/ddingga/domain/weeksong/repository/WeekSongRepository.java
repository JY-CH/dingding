package com.ssafy.ddingga.domain.weeksong.repository;

import java.time.LocalDateTime;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.ssafy.ddingga.domain.weeksong.entity.WeekSong;

import io.lettuce.core.dynamic.annotation.Param;

@Repository
public interface WeekSongRepository extends JpaRepository<WeekSong, Integer> {

	// startDate 이상이고 endDate 이하인 WeekSong을 가져오는 쿼리
	@Query("SELECT ws FROM WeekSong ws WHERE ws.startDate <= :currentDate AND ws.endDate >= :currentDate")
	WeekSong findByStartDateBeforeAndEndDateAfter(@Param("currentDate") LocalDateTime currentDate);
}
