package com.ssafy.ddingga.facade.replay.dto.response;

import java.time.LocalDateTime;

import com.ssafy.ddingga.domain.song.entity.Song;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ReplayDto {
	private Integer replayId;
	private Song song;
	private Integer score;
	private String mode;
	private String videoPath;
	private LocalDateTime practiceDate;
}
