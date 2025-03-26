package com.ssafy.ddingga.domain.replay.service;

import java.util.List;

import com.ssafy.ddingga.facade.dashboard.dto.response.ReplayDto;

public interface ReplayService {
	// 이번주 리플레이 조회
	List<ReplayDto> getLastWeekReplays(Integer userId);
}
