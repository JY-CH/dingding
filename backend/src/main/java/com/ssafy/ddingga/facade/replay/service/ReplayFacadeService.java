package com.ssafy.ddingga.facade.replay.service;

import com.ssafy.ddingga.facade.replay.dto.response.ReplayResponse;

public interface ReplayFacadeService {
	ReplayResponse getReplay(Integer userId);
}
