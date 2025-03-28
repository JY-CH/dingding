package com.ssafy.ddingga.presentation.replay;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.ddingga.domain.auth.entity.User;
import com.ssafy.ddingga.facade.replay.dto.request.ReplayCreateRequestDto;
import com.ssafy.ddingga.facade.replay.dto.response.ReplayResponse;
import com.ssafy.ddingga.facade.replay.service.ReplayFacadeService;

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

	@PostMapping("")
	public ResponseEntity<Void> createReplay(
		@AuthenticationPrincipal User user,
		@ModelAttribute ReplayCreateRequestDto requestDto
	) {
		replayFacadeService.createReplay(user.getUserId(), requestDto);
		return ResponseEntity.ok().build();
	}
}
