package com.ssafy.ddingga.facade.recommendsong.service;

import java.util.List;

import com.ssafy.ddingga.facade.recommendsong.dto.response.GetRecommendSongsResponseDto;

public interface RecommendSongFacadeService {
	List<GetRecommendSongsResponseDto> getRecommendSongs();
}
