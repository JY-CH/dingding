package com.ssafy.ddingga.facade.chordscore.service;

import java.util.List;

import com.ssafy.ddingga.facade.chordscore.dto.request.CreateChordScoresRequestDto;

public interface ChordScoreFacadeService {
	void createChordScores(int userId, List<CreateChordScoresRequestDto> request);
}
