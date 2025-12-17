package com.nova.backend.farm.service;

import com.nova.backend.farm.dto.DashboardRequestDTO;

public interface DashboardService {
    DashboardRequestDTO getDashboard(Long farmId);
}
