package com.nova.backend.farm.dto;

import com.nova.backend.actuator.dto.ActuatorLogResponseDTO;
import com.nova.backend.alarm.dto.AlarmResponseDTO;
import com.nova.backend.preset.dto.PresetInfoDTO;
import com.nova.backend.preset.dto.StepResponseDTO;
import com.nova.backend.sensor.dto.SensorCurrentDTO;
import com.nova.backend.sensor.dto.SensorHistoryDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

//엔티티와 dto와 멤버변수명 이름 동일하게
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DashboardRequestDTO {
    private DashHeaderDTO farm;          // 상단 팜 정보
    private SensorCurrentDTO current;    // 현재 센서 상태 (막대바/텍스트)
    private SensorHistoryDTO history;    // 센서 변화 그래프
    private PresetInfoDTO preset;
    private List<StepResponseDTO> presetSteps; // 현재 적용 프리셋
    private List<ActuatorLogResponseDTO> actuators; // 장치 동작 상태
//    private List<AlarmResponseDTO> alarms;       // 최근 알림
    private int activePresetStepId;
}
