package com.ssafy.ddingga.domain.song.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ssafy.ddingga.domain.song.entity.ChordScore;

@Repository
public interface ChordScoreRepository extends JpaRepository<ChordScore, Integer> {
	// 사용자의 모든 코드 정보 조회
	List<ChordScore> findByUser_UserId(Integer userId);

	// userId와 songId로 ChordScore를 조회
	ChordScore findByUser_UserIdAndSong_SongId(Integer userId, Integer songId);
}
