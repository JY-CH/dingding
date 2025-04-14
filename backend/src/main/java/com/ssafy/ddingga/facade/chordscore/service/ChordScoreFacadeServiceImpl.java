package com.ssafy.ddingga.facade.chordscore.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.ssafy.ddingga.domain.song.service.ChordScoreService;
import com.ssafy.ddingga.facade.chordscore.dto.request.CreateChordScoresRequestDto;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class ChordScoreFacadeServiceImpl implements ChordScoreFacadeService {

	private final ChordScoreService chordScoreService;

	@Override
	public void createChordScores(int userId, List<CreateChordScoresRequestDto> request) {
		chordScoreService.createChordScores(userId, request);
	}
}
