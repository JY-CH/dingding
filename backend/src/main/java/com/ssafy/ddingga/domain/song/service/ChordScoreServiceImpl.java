package com.ssafy.ddingga.domain.song.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.ssafy.ddingga.domain.auth.entity.User;
import com.ssafy.ddingga.domain.auth.repository.AuthRepository;
import com.ssafy.ddingga.domain.song.entity.ChordScore;
import com.ssafy.ddingga.domain.song.entity.Song;
import com.ssafy.ddingga.domain.song.repository.ChordScoreRepository;
import com.ssafy.ddingga.domain.song.repository.SongRepository;
import com.ssafy.ddingga.facade.chordscore.dto.request.CreateChordScoresRequestDto;
import com.ssafy.ddingga.facade.dashboard.dto.response.ChordScoreDto;
import com.ssafy.ddingga.global.error.exception.DatabaseException;
import com.ssafy.ddingga.global.error.exception.NotFoundException;
import com.ssafy.ddingga.global.error.exception.UserNotFoundException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor // ChordScoreRepository 을 주입받는 생성자를 자동으로 만들어줌
public class ChordScoreServiceImpl implements ChordScoreService {

	private final ChordScoreRepository chordScoreRepository;
	private final AuthRepository authRepository;
	private final SongRepository songRepository;

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

	@Override
	public void createChordScores(int userId, List<CreateChordScoresRequestDto> request) {

		List<ChordScore> chordScores = new ArrayList<>();

		for (CreateChordScoresRequestDto chordScoreRequest : request) {
			User user = authRepository.findByUserId(userId).orElseThrow(() -> new NotFoundException("없는 유저 id 입니다."));
			Song song = songRepository.findById(chordScoreRequest.getSongId())
				.orElseThrow(() -> new NotFoundException("없는 노래 id 입니다."));
			ChordScore chordScore = ChordScore.builder()
				.user(user)
				.song(song)
				.score(chordScoreRequest.getScore())
				.count(chordScoreRequest.getCount())
				.build();

			chordScores.add(chordScore);
		}

		for (ChordScore chordScore : chordScores) {
			ChordScore currendChordScore = chordScoreRepository.findByUser_UserIdAndSong_SongId(
				chordScore.getUser().getUserId(), chordScore.getSong().getSongId());

			if (currendChordScore == null) {
				ChordScore updateChordScore = ChordScore.builder()
					.user(chordScore.getUser())
					.song(chordScore.getSong())
					.score(chordScore.getScore())
					.count(chordScore.getCount())
					.build();

				chordScoreRepository.save(updateChordScore);
			} else {
				int totalCount = currendChordScore.getCount() + chordScore.getCount();
				int updateScore = (currendChordScore.getScore() * currendChordScore.getCount()
					+ chordScore.getScore() * chordScore.getCount()) / totalCount;

				currendChordScore.setScore(updateScore);
				currendChordScore.setCount(totalCount);

				chordScoreRepository.save(currendChordScore);
			}
		}
	}
}
