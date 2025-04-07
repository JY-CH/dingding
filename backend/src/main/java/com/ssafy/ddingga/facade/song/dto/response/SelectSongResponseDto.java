package com.ssafy.ddingga.facade.song.dto.response;

import java.util.List;

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
public class SelectSongResponseDto {
	private Integer songId;
	private String songTitle;
	private String songImage;
	private String songWriter;
	private String songSinger;

	private List<SheetMusicResponseDto> sheetMusicResponseDtos;
}
