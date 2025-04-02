package com.ssafy.ddingga.presentation.weeksongranking;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.ddingga.facade.weeksongranking.dto.response.GetWeekSongRankingResponseDto;
import com.ssafy.ddingga.facade.weeksongranking.service.WeekSongRankingFacadeService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/weekSong/ranking")
@RequiredArgsConstructor
public class WeekSongRankingController {
	private final WeekSongRankingFacadeService weekSongRankingFacadeService;

	@Operation(summary = "이주의 랭킹 조회", description = "이주의 랭킹 조회")
	@ApiResponses({
		@ApiResponse(responseCode = "200", description = "이주의 랭킹 조회 성공"),
		@ApiResponse(responseCode = "400", description = "잘못된 요청"),
		@ApiResponse(responseCode = "404", description = "존재하지 않는 댓글입니다.")
	})
	@GetMapping(value = "")
	public ResponseEntity<List<GetWeekSongRankingResponseDto>> getSong() {
		List<GetWeekSongRankingResponseDto> responseDto = null;

		try {
			responseDto = weekSongRankingFacadeService.getWeekSongRanking();
			if (responseDto.isEmpty()) {
				log.info("이주의 랭킹이 없습니다.");
			} else {
				log.info("이주의 랭킹 조회 성공, {}개의 데이터 반환", responseDto.size());
			}
		} catch (Exception e) {
			log.error("이주의 랭킹 조회 중 예외 발생: ", e);
			return ResponseEntity.status(500).build();
		}

		return ResponseEntity.ok().body(responseDto);
	}
}

