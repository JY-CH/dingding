package com.ssafy.ddingga.facade.song.dto.response;

import java.time.LocalTime;

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
public class SearchSongResponseDto {
	private Integer songId;
	private String songTitle;
	private String songImage;
	private String songWriter;

	// 추가된 시간 정보 컬럼
	private LocalTime songDuration;  // 노래 시간 (분:초) 형태로 저장
}
