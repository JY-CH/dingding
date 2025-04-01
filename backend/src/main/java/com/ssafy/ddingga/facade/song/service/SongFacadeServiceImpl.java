package com.ssafy.ddingga.facade.song.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.ssafy.ddingga.domain.song.entity.Song;
import com.ssafy.ddingga.domain.song.service.SongService;
import com.ssafy.ddingga.facade.song.dto.response.GetSongResponseDto;
import com.ssafy.ddingga.facade.song.dto.response.SearchSongResponseDto;
import com.ssafy.ddingga.facade.song.dto.response.SelectSongResponseDto;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SongFacadeServiceImpl implements SongFacadeService {

	private final SongService songService;

	@Override
	public List<GetSongResponseDto> getSong() {
		List<Song> songs = songService.getSong();
		List<GetSongResponseDto> responseDto = new ArrayList<>();

		for (Song song : songs) {
			GetSongResponseDto getSongResponseDto = GetSongResponseDto.builder()
				.songId(song.getSongId())
				.songTitle(song.getSongTitle())
				.songImage(song.getSongImage())
				.songWriter(song.getSongWriter())
				.songDuration(song.getSongDuration())
				.build();

			responseDto.add(getSongResponseDto);
		}

		return responseDto;
	}

	@Override
	public SelectSongResponseDto selectSong(int songId) {
		Song song = songService.selectSong(songId);
		SelectSongResponseDto responseDto = SelectSongResponseDto.builder()
			.songId(song.getSongId())
			.songTitle(song.getSongTitle())
			.songImage(song.getSongImage())
			.songWriter(song.getSongWriter())
			.songDuration(song.getSongDuration())
			.build();
		return responseDto;
	}

	@Override
	public List<SearchSongResponseDto> searchSong(String keyword) {
		List<Song> songs = songService.searchSong(keyword);
		List<SearchSongResponseDto> responseDto = new ArrayList<>();

		for (Song song : songs) {
			SearchSongResponseDto getSongResponseDto = SearchSongResponseDto.builder()
				.songId(song.getSongId())
				.songTitle(song.getSongTitle())
				.songImage(song.getSongImage())
				.songWriter(song.getSongWriter())
				.songDuration(song.getSongDuration())
				.build();

			responseDto.add(getSongResponseDto);
		}
		return responseDto;
	}
}
