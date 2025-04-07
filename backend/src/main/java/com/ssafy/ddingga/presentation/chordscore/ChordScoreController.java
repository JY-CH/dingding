package com.ssafy.ddingga.presentation.chordscore;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.ddingga.domain.auth.entity.User;
import com.ssafy.ddingga.facade.chordscore.dto.request.CreateChordScoresRequestDto;
import com.ssafy.ddingga.facade.chordscore.service.ChordScoreFacadeService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@Tag(name = "ChordScore", description = "코드 점수 API")
@RestController
@RequestMapping("/api/chord/score")
@RequiredArgsConstructor
public class ChordScoreController {
	private final ChordScoreFacadeService chordScoreFacadeService;

	@Operation(summary = "코드 점수 생성", description = "코드 점수를 생성 및 갱신")
	@ApiResponses({@ApiResponse(responseCode = "200", description = "코드 점수 생성 성공"),
		@ApiResponse(responseCode = "400", description = "잘못된 요청"),
		@ApiResponse(responseCode = "404", description = "존재하지 않는 코드입니다.")})
	@PostMapping(value = "")
	public ResponseEntity<Void> createChordScores(@AuthenticationPrincipal User user,
		@RequestBody List<CreateChordScoresRequestDto> request) {

		chordScoreFacadeService.createChordScores(user.getUserId(), request);
		return ResponseEntity.ok().build();
	}
}
