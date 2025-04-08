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
public class SheetMusicResponseDto {
	private String sheetImage;
	private Integer sheetOrder;
	private String chord;
	private Integer chordOrder;
	private Float chordTiming;
}
