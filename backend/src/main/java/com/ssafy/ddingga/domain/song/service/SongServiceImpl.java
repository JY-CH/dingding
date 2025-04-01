package com.ssafy.ddingga.domain.song.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.ssafy.ddingga.domain.song.entity.Song;
import com.ssafy.ddingga.domain.song.repository.SongRepository;
import com.ssafy.ddingga.global.error.exception.NotFoundException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j //로그를 위한 어노테이션
@Service
@RequiredArgsConstructor // final 필드나 @NonNull이 붙은 필드를 매개변수로 받는 생성자를 자동으로 생성해주는 어노테이션
public class SongServiceImpl implements SongService {
	private final SongRepository songRepository;

	@Override
	public List<Song> getSong() {
		return songRepository.findAll();
	}

	@Override
	public Song selectSong(int songId) {
		return songRepository.findById(songId).orElseThrow(() -> new NotFoundException("없는 노래 id 입니다."));
	}

	@Override
	public List<Song> searchSong(String keyword) {
		return songRepository.findBySongTitleOrSongWriterContaining(keyword);
	}
}
