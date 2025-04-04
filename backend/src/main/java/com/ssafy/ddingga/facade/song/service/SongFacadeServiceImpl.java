package com.ssafy.ddingga.facade.song.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.ssafy.ddingga.domain.song.entity.SheetMusic;
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

	// private String sheetImage;
	// private Integer sheetOrder;
	// private String chord;
	// private Integer chordOrder;
	// private Float chordTiming;

	@Override
	public List<SelectSongResponseDto> selectSong(int songId) {
		List<SheetMusic> sheetMusics = songService.selectSong(songId);
		List<SelectSongResponseDto> result = new ArrayList<>();

		for (SheetMusic sheetMusic : sheetMusics) {
			SelectSongResponseDto responseDto = SelectSongResponseDto.builder()
				.songId(sheetMusic.getSong().getSongId())
				.songTitle(sheetMusic.getSong().getSongTitle())
				.songImage(sheetMusic.getSong().getSongImage())
				.songWriter(sheetMusic.getSong().getSongWriter())
				.singer(sheetMusic.getSong().getSinger())
				.songDuration(sheetMusic.getSong().getSongDuration())
				.sheetImage(sheetMusic.getSheetImage())
				.sheetOrder(sheetMusic.getSheetOrder())
				.chord(sheetMusic.getChord())
				.chordOrder(sheetMusic.getChordOrder())
				.chordTiming(sheetMusic.getChordTiming())
				.build();

			result.add(responseDto);
		}

		return result;
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
				.singer(song.getSinger())
				.songDuration(song.getSongDuration())
				.build();

			responseDto.add(getSongResponseDto);
		}
		return responseDto;
	}
}
