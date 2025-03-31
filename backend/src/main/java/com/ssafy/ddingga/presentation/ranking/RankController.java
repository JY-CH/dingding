package com.ssafy.ddingga.presentation.ranking;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.ddingga.facade.rank.dto.response.TopRankingResponse;
import com.ssafy.ddingga.facade.rank.service.RankingFacadeService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@Tag(name = "Ranking", description = "랭킹 API")
@RestController
@RequestMapping("/api/rank")
@RequiredArgsConstructor
public class RankController {
	private final RankingFacadeService rankingFacadeService;

	@Operation(summary = "전체 랭킹 TOP 5 조회", description = "플레이타임, 시도횟수, 점수 각각의 상위 5명을 조회합니다.")
	@ApiResponses({
		@ApiResponse(responseCode = "200", description = "랭킹 조회 성공"),
		@ApiResponse(responseCode = "500", description = "서버 내부 오류")
	})
	@GetMapping("/top")
	public ResponseEntity<TopRankingResponse> getTop5Rankings() {
		TopRankingResponse response = rankingFacadeService.getTop5Rankings();
		return ResponseEntity.ok(response);
	}
}