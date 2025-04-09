package com.ssafy.ddingga.facade.recommendsong.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ssafy.ddingga.domain.recommendsong.entity.RecommendSong;
import com.ssafy.ddingga.domain.recommendsong.service.RecommendSongService;
import com.ssafy.ddingga.facade.recommendsong.dto.response.GetRecommendSongsResponseDto;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j //로그를 위한 어노테이션
@Service
@RequiredArgsConstructor // final 필드나 @NonNull이 붙은 필드를 매개변수로 받는 생성자를 자동으로 생성해주는 어노테이션
@Transactional
public class RecommendSongFacadeServiceImpl implements RecommendSongFacadeService {
	private final RecommendSongService recommendSongService;

	@Override
	public List<GetRecommendSongsResponseDto> getRecommendSongs() {
		List<RecommendSong> recommendSongs = recommendSongService.getRecommendSongs();
		List<GetRecommendSongsResponseDto> response = new ArrayList<>();

		for (RecommendSong recommendSong : recommendSongs) {
			GetRecommendSongsResponseDto getRecommendSongsResponseDto = GetRecommendSongsResponseDto.builder()
				.recommendSongId(recommendSong.getRecommendSongId())
				.song(recommendSong.getSong())
				.category(recommendSong.getCategory())
				.build();

			response.add(getRecommendSongsResponseDto);
		}

		return response;
	}
}
