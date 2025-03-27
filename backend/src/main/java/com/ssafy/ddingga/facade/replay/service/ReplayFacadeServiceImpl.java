package com.ssafy.ddingga.facade.replay.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.ddingga.domain.replay.service.ReplayService;
import com.ssafy.ddingga.facade.replay.dto.response.ReplayDto;
import com.ssafy.ddingga.facade.replay.dto.response.ReplayResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class ReplayFacadeServiceImpl implements ReplayFacadeService {
	private final ReplayService replayService;

	@Override
	public ReplayResponse getReplay(Integer userId) {
		//리플레이 조회
		List<ReplayDto> replayDtos = replayService.getAllReplays(userId);

		return ReplayResponse.builder()
			.replaysList(replayDtos)
			.build();
	}
}
