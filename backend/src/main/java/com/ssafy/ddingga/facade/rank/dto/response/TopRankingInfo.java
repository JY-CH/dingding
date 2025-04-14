package com.ssafy.ddingga.facade.rank.dto.response;

import java.time.Duration;

import com.ssafy.ddingga.common.converter.DurationConverter;

import jakarta.persistence.Convert;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class TopRankingInfo {
	private Integer rank;
	private String username;
	private String profileImage;

	@Convert(converter = DurationConverter.class)
	private Duration playTime;
	private Integer totalTry;
	private Float score;

	public TopRankingInfo(Integer rank, String username, String profileImage, Duration playTime, Integer totalTry,
		Float score) {
		this.rank = rank;
		this.username = username;
		this.profileImage = profileImage;
		this.playTime = playTime;
		this.totalTry = totalTry;
		this.score = score;
	}
}