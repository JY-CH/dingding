package com.ssafy.ddingga.domain.replay.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ssafy.ddingga.domain.replay.entity.Replay;

@Repository
public interface ReplayRepository extends JpaRepository<Replay, Integer> {
	// 특정 유저의 최근 1주일간의 리플레이 조회
	@Query("SELECT r FROM Replay r WHERE r.user.userId = :userId AND r.practiceDate >= :weekStart AND r.practiceDate <= :weekEnd ORDER BY r.practiceDate DESC")
	List<Replay> findThisWeekReplayByUserId(
		@Param("userId") Integer userId,
		@Param("weekStart") LocalDateTime weekStart,
		@Param("weekEnd") LocalDateTime weekEnd
	);

	List<Replay> findReplaysByUser_UserId(Integer userId);
}
