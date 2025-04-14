package com.ssafy.ddingga.presentation.recommendsong;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.ddingga.facade.recommendsong.dto.response.GetRecommendSongsResponseDto;
import com.ssafy.ddingga.facade.recommendsong.service.RecommendSongFacadeService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/recommendSong")
@RequiredArgsConstructor
public class RecommendSongController {
	private final RecommendSongFacadeService recommendSongFacadeService;

	@GetMapping("")
	public ResponseEntity<List<GetRecommendSongsResponseDto>> getAllReplay() {
		List<GetRecommendSongsResponseDto> response = recommendSongFacadeService.getRecommendSongs();
		return ResponseEntity.ok(response);
	}
}
