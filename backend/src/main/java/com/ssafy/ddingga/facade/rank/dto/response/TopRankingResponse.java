package com.ssafy.ddingga.facade.rank.dto.response;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TopRankingResponse {
	private List<TopRankingInfoForPlayTime> playTimeTop10;    // 플레이 시간 상위 10명
	private List<TopRankingInfoForPlayTime> totalTryTop10;    // 총 시도 횟수 상위 10명
	private List<TopRankingInfoForPlayTime> scoreTop10;       // 점수 상위 10명
}
