package com.ssafy.ddingga.domain.replay.service;

import java.util.List;

import com.ssafy.ddingga.facade.replay.dto.response.ReplayDto;

public interface ReplayService {
	// 이번주 리플레이 조회
	List<ReplayDto> getLastWeekReplays(Integer userId);

	// 유저의 리플레이 전체 조회
	List<ReplayDto> getAllReplays(Integer userId);
}
