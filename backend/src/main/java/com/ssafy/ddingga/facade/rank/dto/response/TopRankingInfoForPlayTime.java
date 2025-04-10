package com.ssafy.ddingga.facade.rank.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Builder
public class TopRankingInfoForPlayTime {
	private Integer rank;
	private String username;
	private String profileImage;
	private String playTime;
	private Integer totalTry;
	private Float score;

	public TopRankingInfoForPlayTime(Integer rank, String username, String profileImage, String playTime,
		Integer totalTry, Float score) {
		this.rank = rank;
		this.username = username;
		this.profileImage = profileImage;
		this.playTime = playTime;
		this.totalTry = totalTry;
		this.score = score;
	}
}