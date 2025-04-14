package com.ssafy.ddingga.domain.song.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.ssafy.ddingga.domain.song.entity.Song;

@Repository
public interface SongRepository extends JpaRepository<Song, Integer> {

	// song_title 또는 song_writer에 keyword가 포함된 Song을 찾는 쿼리
	@Query("SELECT s FROM Song s WHERE s.songTitle LIKE %?1% OR s.songWriter LIKE %?1% OR s.songSinger LIKE %?1%")
	List<Song> findBySongTitleOrSongWriterContaining(String keyword);

	// @Query("SELECT s FROM Song s WHERE s.songTitle LIKE %:keyword% OR s.songWriter LIKE %:keyword%")
	// List<Song> findBySongTitleOrSongWriterContaining(@Param("keyword") String keyword);

	List<Song> findBySongIdGreaterThanEqual(Integer songId);
}
