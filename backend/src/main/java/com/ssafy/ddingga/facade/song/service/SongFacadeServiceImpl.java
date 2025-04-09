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
import com.ssafy.ddingga.facade.song.dto.response.SheetMusicResponseDto;

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
			if (song.getSongId() >= 16) {    // 1~14 코드, 15 연습모드일때 노래를 이걸로 하기로 함 16번 부터 노래
				GetSongResponseDto getSongResponseDto = GetSongResponseDto.builder()
					.songId(song.getSongId())
					.songTitle(song.getSongTitle())
					.songImage(song.getSongImage())
					.songWriter(song.getSongWriter())
					.songSinger(song.getSongSinger())
					.songVoiceFileUrl(song.getSongVoiceFileUrl())
					.releaseDate(song.getReleaseDate())
					.category(song.getCategory())
					.songDuration(song.getSongDuration())
					.build();

				responseDto.add(getSongResponseDto);
			}
		}

		return responseDto;
	}

	// private String sheetImage;
	// private Integer sheetOrder;
	// private String chord;
	// private Integer chordOrder;
	// private Float chordTiming;

	@Override
	public SelectSongResponseDto selectSong(int songId) {
		List<SheetMusic> sheetMusics = songService.selectSong(songId);
		List<SheetMusicResponseDto> sheetMusicResponseDto = new ArrayList<>();
		SelectSongResponseDto result = new SelectSongResponseDto();

		Song song = new Song();

		int count = 0;
		for (SheetMusic sheetMusic : sheetMusics) {
			if (count == 0) {
				result.setSongId(sheetMusic.getSong().getSongId());
				result.setSongTitle(sheetMusic.getSong().getSongTitle());
				result.setSongImage(sheetMusic.getSong().getSongImage());
				result.setSongWriter(sheetMusic.getSong().getSongWriter());
				result.setSongSinger(sheetMusic.getSong().getSongSinger());
				count++;
			}
			SheetMusicResponseDto responseDto = SheetMusicResponseDto.builder()
				.sheetImage(sheetMusic.getSheetImage())
				.sheetOrder(sheetMusic.getSheetOrder())
				.chord(sheetMusic.getChord())
				// .chordOrder(sheetMusic.getChordOrder())
				.chordTiming(sheetMusic.getChordTiming())
				.build();

			sheetMusicResponseDto.add(responseDto);
		}
		result.setSheetMusicResponseDtos(sheetMusicResponseDto);

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
				.songSinger(song.getSongSinger())
				.songVoiceFileUrl(song.getSongVoiceFileUrl())
				.releaseDate(song.getReleaseDate())
				.category(song.getCategory())
				.songDuration(song.getSongDuration())
				.build();

			responseDto.add(getSongResponseDto);
		}
		return responseDto;
	}
}
