package com.ssafy.ddingga.facade.weeksongranking.dto.response;

import java.util.List;

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
public class GetWeekSongRankingResponseDto {
	private Song song;
	private List<WeekSongUserInfo> userInfo;
}
