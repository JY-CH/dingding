package com.ssafy.ddingga.domain.recommendsong.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.ssafy.ddingga.domain.recommendsong.entity.RecommendSong;
import com.ssafy.ddingga.domain.recommendsong.repository.RecommendSongRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j //로그를 위한 어노테이션
@Service
@RequiredArgsConstructor // final 필드나 @NonNull이 붙은 필드를 매개변수로 받는 생성자를 자동으로 생성해주는 어노테이션
public class RecommendSongServiceImpl implements RecommendSongService {
	private final RecommendSongRepository recommendSongRepository;

	@Override
	public List<RecommendSong> getRecommendSongs() {
		return recommendSongRepository.findAll();
	}
}
