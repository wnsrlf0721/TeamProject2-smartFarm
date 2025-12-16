package com.nova.backend.alarm.service;

import com.nova.backend.alarm.dto.AlarmResponseDTO;
import com.nova.backend.farm.entity.FarmEntity;

import java.util.List;

public interface AlarmService {
    // 실시간 팝업 (읽지 않은 알람)
    List<AlarmResponseDTO> getUnreadAlarms(Long farmId);

    // 최근 알람 10개 (대시보드)
    List<AlarmResponseDTO> getRecentAlarms(Long farmId);

    // 오늘 알람
    List<AlarmResponseDTO> getTodayAlarms(Long farmId);

    // 전체 알람
    List<AlarmResponseDTO> getAllAlarms(Long farmId);

    // 상태변경
    void readAllAlarms(Long farmId);

    // 센서 기준 위반 알람 생성
    void createSensorAlarm(FarmEntity farm, String alarmType, String title, String message);

    // 알람 페이지 - 읽음/안읽음 분리
    List<AlarmResponseDTO> getAlarmsByReadStatus(Long farmId, boolean isRead);

    // 알람 페이지 - 타입별
    List<AlarmResponseDTO> getAlarmPageAlarmsByType(Long farmId, String alarmType);

    // 알람 페이지 - 타입 + 읽음 상태
    List<AlarmResponseDTO> getAlarmPageAlarmsByTypeAndRead(
            Long farmId,
            String alarmType,
            boolean isRead
    );
}
