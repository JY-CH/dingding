package com.ssafy.ddingga.facade.chordscore.dto.request;

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
public class CreateChordScoresRequestDto {
	int songId;
	int score;
	int count;
}
