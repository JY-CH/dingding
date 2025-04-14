package com.ssafy.ddingga.domain.recommendsong.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ssafy.ddingga.domain.recommendsong.entity.RecommendSong;

@Repository
public interface RecommendSongRepository extends JpaRepository<RecommendSong, Integer> {
}
