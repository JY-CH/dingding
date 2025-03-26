package com.ssafy.ddingga.domain.song.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.ddingga.domain.song.entity.ChordScore;
import com.ssafy.ddingga.domain.song.repository.ChordScoreRepository;
import com.ssafy.ddingga.facade.dashboard.dto.response.ChordScoreDto;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor // ChordScoreRepository 을 주입받는 생성자를 자동으로 만들어줌
@Transactional(readOnly = true) //모든 메서드에 트랜잭션 적용 readOnly = true: 읽기 전용 트랜잭션임을 명시
public class ChordScoreServiceImpl implements ChordScoreService {

	private final ChordScoreRepository chordScoreRepository;

	@Override
	public List<ChordScoreDto> getChordScores(Integer userId) {
		List<ChordScore> chordScores = chordScoreRepository.findByUserId(userId);

		return chordScores.stream()
			.map(chordScore -> ChordScoreDto.builder()
				.chordType(chordScore.getSong().getSongTitle())
				.score(chordScore.getScore())
				.build())
			.toList();

	}
}
