package com.ssafy.ddingga.facade.dashboard.service;

import com.ssafy.ddingga.facade.dashboard.dto.response.DashboardResponse;

public interface DashboardFacadeService {
	DashboardResponse getDashboard(Integer userId, String username);
}
