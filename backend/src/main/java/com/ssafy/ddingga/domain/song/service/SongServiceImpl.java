package com.ssafy.ddingga.domain.song.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.ssafy.ddingga.domain.song.entity.SheetMusic;
import com.ssafy.ddingga.domain.song.entity.Song;
import com.ssafy.ddingga.domain.song.repository.SheetMusicRepository;
import com.ssafy.ddingga.domain.song.repository.SongRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j //로그를 위한 어노테이션
@Service
@RequiredArgsConstructor // final 필드나 @NonNull이 붙은 필드를 매개변수로 받는 생성자를 자동으로 생성해주는 어노테이션
public class SongServiceImpl implements SongService {
	private final SongRepository songRepository;
	private final SheetMusicRepository sheetMusicRepository;

	@Override
	public List<Song> getSong() {
		return songRepository.findAll();
	}

	@Override
	public List<SheetMusic> selectSong(int songId) {
		List<SheetMusic> sheetMusics = sheetMusicRepository.findBySongSongId(songId);
		if (sheetMusics.isEmpty()) {
			songRepository.findById(songId);
		}

		return sheetMusicRepository.findBySongSongId(songId);
	}

	@Override
	public List<Song> searchSong(String keyword) {
		return songRepository.findBySongTitleOrSongWriterContaining(keyword);
	}
}
