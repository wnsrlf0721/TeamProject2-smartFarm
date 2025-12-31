package com.nova.backend.farm.service;

import com.nova.backend.actuator.service.ActuatorService;
import com.nova.backend.alarm.service.AlarmService;
import com.nova.backend.farm.dto.DashHeaderDTO;
import com.nova.backend.farm.dto.DashboardRequestDTO;
import com.nova.backend.farm.entity.FarmEntity;
import com.nova.backend.farm.repository.FarmRepository;
import com.nova.backend.preset.dto.PresetInfoDTO;
import com.nova.backend.preset.dto.StepResponseDTO;
import com.nova.backend.preset.entity.PresetStepEntity;
import com.nova.backend.preset.repository.PresetStepRepository;
import com.nova.backend.preset.service.PresetService;
import com.nova.backend.sensor.service.SensorService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {
    private final FarmRepository farmRepository;
    private final SensorService sensorService;
    private final AlarmService alarmService;
    private final ActuatorService actuatorService;
    private final PresetStepRepository presetStepRepository;
    private final PresetService presetService;

    @Override
    public DashboardRequestDTO getDashboard(Long farmId) {
        FarmEntity farm = farmRepository.findById(farmId)
                .orElseThrow(() -> new IllegalArgumentException("Farm 없음"));

        Long presetId = farm.getPresetStep().getPreset().getPresetId();

        List<PresetStepEntity> stepEntities =
                presetStepRepository.findByPreset_PresetId(presetId);

        List<StepResponseDTO> stepDTOs = stepEntities.stream()
                .map(StepResponseDTO::from) // static mapper
                .toList();

        return DashboardRequestDTO.builder()
                .farm(buildHeader(farm))
                .current(sensorService.getCurrentSensor(farmId))
                .history(sensorService.getSensorHistory(farmId))
                .preset(presetService.getPresetInfo(farm))
                .presetSteps(stepDTOs)
                .activePresetStepId(farm.getPresetStep().getStepId())
                .actuators(actuatorService.getActuatorLogs(farmId))
//                .alarms(alarmService.getRecentAlarms(farmId))
                .build();
    }

    private DashHeaderDTO buildHeader(FarmEntity farm) {

        LocalDate startDate =
                farm.getCreatedTime().toLocalDateTime().toLocalDate();

        LocalDate expectedHarvestDate =
                calcExpectedHarvestDate(farm);

        return DashHeaderDTO.builder()
                .farmId(farm.getFarmId())
                .farmName(farm.getFarmName())
                .slot(farm.getSlot())
                .plantType(farm.getPresetStep().getPreset().getPlantType())
                .status(calcStatus(farm)) // "재배중" / "재배완료"
                .dday((int)ChronoUnit.DAYS.between(LocalDate.now(), expectedHarvestDate))
                .startDate(startDate)
                .expectedHarvestDate(expectedHarvestDate)
                .updateTime(farm.getUpdateTime())
                .build();
    }

    /** 현재 적용 프리셋 정보 */
    private PresetInfoDTO buildPresetInfo(FarmEntity farm) {
        PresetStepEntity step = farm.getPresetStep();
        return PresetInfoDTO.builder()
                .presetId(step.getPreset().getPresetId())
                .presetName(step.getPreset().getPresetName())
                .plantType(step.getPreset().getPlantType())
                .growthStep(step.getGrowthStep())
                .periodDays(step.getPeriodDays())
                .temp(step.getTemp())
                .humidity(step.getHumidity())
                .lightPower(step.getLightPower())
                .co2(step.getCo2())
                .soilMoisture(step.getSoilMoisture())
                .build();
    }

    /** D-day 계산 (임시 로직) */
    private int calcDday(FarmEntity farm) {
        LocalDate start = farm.getCreatedTime().toLocalDateTime().toLocalDate();
        return (int) ChronoUnit.DAYS.between(start, LocalDate.now());
    }

    private String calcStatus(FarmEntity farm) {
        int dday = calcDday(farm);

        if (dday < 0) return "수확완료";
        return "재배중";
    }

    private LocalDate calcExpectedHarvestDate(FarmEntity farm) {
        LocalDate startDate =
                farm.getCreatedTime().toLocalDateTime().toLocalDate();

        Long presetId = farm.getPresetStep()
                .getPreset()
                .getPresetId();

        List<PresetStepEntity> steps =
                presetStepRepository.findByPreset_PresetId(presetId);

        int totalDays = steps.stream()
                .mapToInt(PresetStepEntity::getPeriodDays)
                .sum();

        return startDate.plusDays(totalDays);
    }
}