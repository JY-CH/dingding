package com.ssafy.ddingga.domain.replay.service;

import java.util.List;

import com.ssafy.ddingga.domain.replay.entity.Replay;
import com.ssafy.ddingga.facade.replay.dto.request.ReplayCreateRequestDto;
import com.ssafy.ddingga.facade.replay.dto.response.ReplayDto;

public interface ReplayService {
	// 특정 유저 이번주 리플레이 조회
	List<ReplayDto> getLastWeekReplays(Integer userId);

	// 이번주 리플레이 조회
	List<Replay> getLastWeekReplays();

	// 유저의 리플레이 전체 조회
	List<ReplayDto> getAllReplays(Integer userId);

	// 리플레이 생성
	Replay createReplay(Integer userId, ReplayCreateRequestDto replayCreateRequestDto);

	//리플레이 삭제
	void deleteReplay(Integer replayId, Integer userId);
}
