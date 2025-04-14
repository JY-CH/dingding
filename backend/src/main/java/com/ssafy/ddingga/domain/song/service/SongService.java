package com.ssafy.ddingga.domain.song.service;

import java.util.List;

import com.ssafy.ddingga.domain.song.entity.SheetMusic;
import com.ssafy.ddingga.domain.song.entity.Song;

public interface SongService {

	List<Song> getSong();

	List<SheetMusic> selectSong(int songId);

	List<Song> searchSong(String keyword);
}
