package com.ssafy.ddingga.facade.song.dto.response;

import java.time.LocalDate;

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
public class GetSongResponseDto {
	private Integer songId;
	private String songTitle;
	private String songImage;
	private String songWriter;
	private String songSinger;

	private String songVoiceFileUrl;
	private LocalDate releaseDate;        // LocalDate 는 년월일 까지만 나오고 LocalDateTime 은 년월일 시분초까지 나온다
	private String category;
	// 노래의 재생 시간을 "HH:MM:SS" 형식으로 저장
	private String songDuration;  // 예: "00:03:30" (3분 30초)
}
