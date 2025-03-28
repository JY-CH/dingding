package com.ssafy.ddingga.domain.song.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ssafy.ddingga.domain.song.entity.Song;

@Repository
public interface SongRepository extends JpaRepository<Song, Integer> {
}
