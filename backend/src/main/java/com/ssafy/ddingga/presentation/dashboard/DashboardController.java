package com.ssafy.ddingga.presentation.dashboard;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.ddingga.domain.auth.entity.User;
import com.ssafy.ddingga.facade.dashboard.dto.response.DashboardResponse;
import com.ssafy.ddingga.facade.dashboard.service.DashboardFacadeService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/mypage")
@RequiredArgsConstructor
public class DashboardController {
	private final DashboardFacadeService dashboardFacadeService;

	@GetMapping("/dashboard")
	public ResponseEntity<DashboardResponse> getDashboard(@AuthenticationPrincipal User user) {
		DashboardResponse response = dashboardFacadeService.getDashboard(user.getUserId(), user.getUsername());
		return ResponseEntity.ok(response);
	}
}
