package com.ssafy.ddingga.facade.song.service;

import java.util.List;

import com.ssafy.ddingga.facade.song.dto.response.GetSongResponseDto;
import com.ssafy.ddingga.facade.song.dto.response.SearchSongResponseDto;
import com.ssafy.ddingga.facade.song.dto.response.SelectSongResponseDto;

public interface SongFacadeService {
	List<GetSongResponseDto> getSong();

	SelectSongResponseDto selectSong(int songId);

	List<SearchSongResponseDto> searchSong(String keyword);
}
