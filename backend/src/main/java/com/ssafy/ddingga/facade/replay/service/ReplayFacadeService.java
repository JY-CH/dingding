package com.ssafy.ddingga.facade.replay.service;

import com.ssafy.ddingga.facade.replay.dto.request.ReplayCreateRequestDto;
import com.ssafy.ddingga.facade.replay.dto.response.ReplayResponse;

public interface ReplayFacadeService {
	ReplayResponse getReplay(Integer userId);

	void createReplay(Integer userId, ReplayCreateRequestDto requestDto);

	void deleteReplay(Integer replayId, Integer userId);
}
