package com.ssafy.ddingga.facade.recommendsong.dto.response;

import com.ssafy.ddingga.domain.song.entity.Song;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GetRecommendSongsResponseDto {
	private Integer recommendSongId;
	private Song song;
	private String category;
}
