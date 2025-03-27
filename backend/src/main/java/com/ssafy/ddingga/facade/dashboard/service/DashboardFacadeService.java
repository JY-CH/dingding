package com.ssafy.ddingga.facade.dashboard.service;

import java.time.LocalDateTime;

import com.ssafy.ddingga.facade.dashboard.dto.response.DashboardResponse;

public interface DashboardFacadeService {
	DashboardResponse getDashboard(Integer userId, LocalDateTime weekStart, LocalDateTime weekEnd);
}
