package com.ssafy.ddingga.domain.song.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.ddingga.domain.auth.repository.AuthRepository;
import com.ssafy.ddingga.domain.song.entity.ChordScore;
import com.ssafy.ddingga.domain.song.repository.ChordScoreRepository;
import com.ssafy.ddingga.facade.dashboard.dto.response.ChordScoreDto;
import com.ssafy.ddingga.global.error.exception.DatabaseException;
import com.ssafy.ddingga.global.error.exception.UserNotFoundException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor // ChordScoreRepository 을 주입받는 생성자를 자동으로 만들어줌
@Transactional(readOnly = true) //모든 메서드에 트랜잭션 적용 readOnly = true: 읽기 전용 트랜잭션임을 명시
public class ChordScoreServiceImpl implements ChordScoreService {

	private final ChordScoreRepository chordScoreRepository;
	private final AuthRepository authRepository;

	@Override
	public List<ChordScoreDto> getChordScores(Integer userId) {
		log.info("코드 점수 - 코드 점수 조회 요청: userId={}", userId);

		if (!authRepository.existsById(userId)) {
			log.error("코드 점수 - 사용자를 찾을 수 없음: userId={}", userId);
			throw new UserNotFoundException("사용자를 찾을 수 없습니다.");
		}

		try {
			List<ChordScore> chordScores = chordScoreRepository.findByUser_UserId(userId);
			log.info("코드 점수 - 코드 점수 조회 완료: userId={}, chordScores.size={}", userId, chordScores.size());

			List<ChordScoreDto> result = chordScores.stream()
				.map(chordScore -> ChordScoreDto.builder()
					.chordType(chordScore.getSong().getSongTitle())
					.score(chordScore.getScore())
					.build())
				.toList();

			log.debug("코드 점수 - DTO 변환 완료: userId={}, resultCount={}", userId, result.size());
			return result;
		} catch (Exception e) {
			log.error("코드 점수 - 코드 점수 조회 실패: userId={}, error={}", userId, e.getMessage());
			throw new DatabaseException("코드 점수 조회 중 오류가 발생했습니다.", e);
		}
	}
}
