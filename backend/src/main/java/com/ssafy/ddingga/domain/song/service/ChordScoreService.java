package com.ssafy.ddingga.domain.song.service;

import java.util.List;

import com.ssafy.ddingga.facade.dashboard.dto.response.ChordScoreDto;

public interface ChordScoreService {

	/**
	 * 유저의 모든 코드별 점수 조회
	 * @param userId 조회할 유저 Id
	 * @return 유저의 모든 코드 점수
	 */
	List<ChordScoreDto> getChordScores(Integer userId);
}
