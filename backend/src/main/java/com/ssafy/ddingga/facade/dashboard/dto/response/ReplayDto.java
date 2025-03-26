package com.ssafy.ddingga.facade.dashboard.dto.response;

import java.time.LocalDateTime;

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
	private String songTitle;
	private Integer score;
	private String mode;
	private String videoPath;
	private LocalDateTime practiceDate;
}
