package com.ssafy.ddingga.presentation.replay;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.ssafy.ddingga.domain.auth.entity.User;
import com.ssafy.ddingga.facade.replay.dto.request.ReplayCreateRequestDto;
import com.ssafy.ddingga.facade.replay.dto.response.ReplayResponse;
import com.ssafy.ddingga.facade.replay.service.ReplayFacadeService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/replay")
@RequiredArgsConstructor
public class ReplayController {
	private final ReplayFacadeService replayFacadeService;

	@GetMapping("")
	public ResponseEntity<ReplayResponse> getAllReplay(
		@AuthenticationPrincipal User user
	) {
		ReplayResponse response = replayFacadeService.getReplay(user.getUserId());
		return ResponseEntity.ok(response);
	}

	// @PostMapping("")
	// public ResponseEntity<Void> createReplay(
	// 	@AuthenticationPrincipal User user,
	// 	@ModelAttribute ReplayCreateRequestDto requestDto
	// ) {
	// 	replayFacadeService.createReplay(user.getUserId(), requestDto);
	// 	return ResponseEntity.ok().build();
	// }

	@Operation(summary = "리플레이 업로드", description = "MP4 동영상을 포함한 리플레이를 업로드합니다.")
	@io.swagger.v3.oas.annotations.parameters.RequestBody(
		content = @Content(mediaType = "multipart/form-data",
			schema = @Schema(implementation = ReplayCreateRequestDto.class))
	)
	@PostMapping(value = "", consumes = "multipart/form-data")
	public ResponseEntity<Void> createReplay(
		@AuthenticationPrincipal User user,
		@RequestPart("songId") Integer songId,
		@RequestPart("score") Integer score,
		@RequestPart("mode") String mode,
		@RequestPart("videoFile") MultipartFile videoFile,
		@RequestPart("videoTime") String videoTime
	) {
		ReplayCreateRequestDto requestDto = new ReplayCreateRequestDto(songId, score, mode, videoFile, videoTime);
		replayFacadeService.createReplay(user.getUserId(), requestDto);
		return ResponseEntity.ok().build();
	}

	@DeleteMapping("{replayId}")
	public ResponseEntity<Void> deleteReplay(
		@AuthenticationPrincipal User user,
		@PathVariable Integer replayId
	) {
		replayFacadeService.deleteReplay(replayId, user.getUserId());
		return ResponseEntity.noContent().build();
	}
}
