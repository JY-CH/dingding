package com.ssafy.ddingga.facade.song.dto.response;

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
	private String songSinger;

	// 노래의 재생 시간을 "HH:MM:SS" 형식으로 저장
	// private String songDuration;  // 예: "00:03:30" (3분 30초)
}
