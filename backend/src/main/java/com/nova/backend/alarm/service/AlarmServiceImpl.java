package com.nova.backend.alarm.service;

import com.nova.backend.alarm.dao.AlarmDAO;
import com.nova.backend.alarm.dto.AlarmResponseDTO;
import com.nova.backend.alarm.dto.DashboardAlarmResponse;
import com.nova.backend.alarm.entity.PlantAlarmEntity;
import com.nova.backend.alarm.repository.PlantAlarmRepository;
import com.nova.backend.alarm.sse.AlarmSseEmitterManager;
import com.nova.backend.farm.entity.FarmEntity;
import com.nova.backend.farm.repository.FarmRepository;
import com.nova.backend.preset.entity.PresetStepEntity;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AlarmServiceImpl implements AlarmService {
    private final AlarmDAO alarmDAO;
    private final FarmRepository farmRepository;
    private final ModelMapper modelMapper;
    private final PlantAlarmRepository plantAlarmRepository;
    private final AlarmSseEmitterManager sseEmitterManager;

    // farm 조회 공통 메서드
    private FarmEntity getFarm(Long farmId) {
        return farmRepository.findById(farmId)
                .orElseThrow(() -> new IllegalArgumentException("팜을 찾을 수 없습니다."));
    }
    // 실시간 팝업 알림 (읽지 않은 알림)
    @Override
    public List<AlarmResponseDTO> getUnreadAlarms(Long farmId) {
        FarmEntity farmEntity = getFarm(farmId);
        return alarmDAO
                .findUnreadByFarm(farmEntity)
                .stream()
                .map(alarm -> modelMapper.map(alarm, AlarmResponseDTO.class))
                .collect(Collectors.toList());
    }
    // 최근 알람 10개
    @Override
    public List<AlarmResponseDTO> getRecentAlarms(Long farmId) {
        FarmEntity farmEntity = getFarm(farmId);

        return alarmDAO
                .findRecentByFarm(farmEntity)
                .stream()
                .map(alarm -> modelMapper.map(alarm, AlarmResponseDTO.class))
                .collect(Collectors.toList());
    }

    // 오늘 알람
    @Override
    public List<AlarmResponseDTO> getTodayAlarms(Long farmId) {
        FarmEntity farmEntity = getFarm(farmId);

        LocalDate today = LocalDate.now();
        LocalDateTime start = today.atStartOfDay();
        LocalDateTime end = today.plusDays(1).atStartOfDay();

        return alarmDAO
                .findTodayByFarm(farmEntity, start, end)
                .stream()
                .map(alarm -> modelMapper.map(alarm, AlarmResponseDTO.class))
                .collect(Collectors.toList());
    }
    // 전체 알람
    @Override
    public List<AlarmResponseDTO> getAllAlarms(Long farmId) {
        FarmEntity farmEntity = getFarm(farmId);

        return alarmDAO
                .findAllByFarm(farmEntity)
                .stream()
                .map(alarm -> modelMapper.map(alarm, AlarmResponseDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void readAllAlarms(Long userId) {
        List<PlantAlarmEntity> unreadAlarms =
                plantAlarmRepository.findByUser_UserIdAndIsReadFalseOrderByCreatedAtDesc(userId);

        for (PlantAlarmEntity alarm : unreadAlarms) {
            alarm.setRead(true);
        }
        // JPA dirty checking → 자동 UPDATE
    }

    @Override
    @Transactional
    public void createSensorAlarm(FarmEntity farm, String alarmType, String title, String message) {
        System.out.println("🟠 [AlarmService] createEventAlarm start farmId="
                + farm.getFarmId() + " type=" + alarmType);

        PresetStepEntity step = farm.getPresetStep();

        if (step == null || step.getPreset() == null) {
            // 핵심: Event 알람은 preset 없는 팜에서도 허용
            // 하지만 DB NOT NULL 때문에 "임시 preset"을 써야 함
            throw new IllegalStateException(
                    "EventAlarm 생성 실패: farm에 presetStep이 없음"
            );
        }
        PlantAlarmEntity alarm = PlantAlarmEntity.builder()
                .farm(farm)
                .user(farm.getNova().getUser())
                .preset(step.getPreset())
                .presetStep(step)
                .alarmType(alarmType)
                .title(title)
                .message(message)
                .isRead(false)
                .createdAt(LocalDateTime.now())
                .build();

        alarmDAO.save(alarm);
        // SSE 전송!!!!!!!!!!!!!!!! (db저장 이후에 보내야됨/프론트가 받은 dto를 그대로 쓸 수o)
        AlarmResponseDTO dto = modelMapper.map(alarm, AlarmResponseDTO.class);
        dto.setAlarmId(alarm.getAlarmId());
        dto.setFarmId(alarm.getFarm().getFarmId());
        dto.setFarmName(alarm.getFarm().getFarmName());
        dto.setAlarmType(alarm.getAlarmType());
        dto.setRead(false);
        TransactionSynchronizationManager.registerSynchronization(
                new TransactionSynchronization() {
                    @Override
                    public void afterCommit() {
                        sseEmitterManager.send(alarm.getUser().getUserId(), dto);
                    }
                }
        );
    }

    @Override
    @Transactional
    public void createEventAlarm(FarmEntity farm, String alarmType, String title, String message) {
        System.out.println("🟠 [AlarmService] createEventAlarm start farmId="
                + farm.getFarmId() + " type=" + alarmType);

        // 현재 farm의 presetStep 가져오기 (NOT NULL 회피용)
        PresetStepEntity step = farm.getPresetStep();

        if (step == null || step.getPreset() == null) {
            System.out.println("❌ presetStep 또는 preset 없음 → EventAlarm 생성 중단");
            return;
        }
        PlantAlarmEntity alarm = PlantAlarmEntity.builder()
                .farm(farm)
                .user(farm.getNova().getUser())
                .preset(step.getPreset())
                .presetStep(step)
                .alarmType(alarmType)
                .title(title)
                .message(message)
                .isRead(false)
                .createdAt(LocalDateTime.now())
                .build();

        alarmDAO.save(alarm);

        // SSE 전송 (커밋 이후)
        AlarmResponseDTO dto = modelMapper.map(alarm, AlarmResponseDTO.class);
        dto.setAlarmId(alarm.getAlarmId());
        dto.setFarmId(farm.getFarmId());
        dto.setFarmName(farm.getFarmName());
        dto.setAlarmType(alarm.getAlarmType());
        dto.setRead(false);

        TransactionSynchronizationManager.registerSynchronization(
                new TransactionSynchronization() {
                    @Override
                    public void afterCommit() {
                        sseEmitterManager.send(
                                alarm.getUser().getUserId(),
                                dto
                        );
                    }
                }
        );
    }

    @Override
    public List<AlarmResponseDTO> getAlarmsByReadStatus(Long farmId, Boolean isRead) {
        FarmEntity farm = getFarm(farmId);

        if (isRead == null) {
            return plantAlarmRepository
                    .findByFarmOrderByCreatedAtDesc(farm)
                    .stream()
                    .map(alarm -> modelMapper.map(alarm, AlarmResponseDTO.class))
                    .toList();
        }

        return plantAlarmRepository
                .findByFarmAndIsReadOrderByCreatedAtDesc(farm, isRead)
                .stream()
                .map(alarm -> modelMapper.map(alarm, AlarmResponseDTO.class))
                .toList();
    }


    @Override
    public List<AlarmResponseDTO> getAlarmPageAlarmsByType(Long farmId, String alarmType) {
        FarmEntity farm = getFarm(farmId);

        return plantAlarmRepository
                .findByFarmAndAlarmTypeOrderByCreatedAtDesc(farm, alarmType)
                .stream()
                .map(alarm -> modelMapper.map(alarm, AlarmResponseDTO.class))
                .toList();
    }

    @Override
    public List<AlarmResponseDTO> getAlarmPageAlarmsByTypeAndRead(Long farmId, String alarmType, Boolean isRead) {
        FarmEntity farm = getFarm(farmId);
        List<PlantAlarmEntity> alarms;

        if ("SENSOR".equalsIgnoreCase(alarmType)) {
            // SENSOR 탭 = sensor
            if (isRead == null) {
                alarms = plantAlarmRepository
                        .findByFarmAndAlarmTypeOrderByCreatedAtDesc(farm, "sensor");
            } else {
                alarms = plantAlarmRepository
                        .findByFarmAndAlarmTypeAndIsReadOrderByCreatedAtDesc(
                                farm, "sensor", isRead);
            }
        } else if ("EVENT".equalsIgnoreCase(alarmType)) {
            // EVENT 탭 = 여러 타입 묶음
            List<String> eventTypes = List.of(
                    "actuator",
                    "preset",
                    "anniversary",
                    "water",
                    "log");
            if (isRead == null) {
                alarms = plantAlarmRepository
                        .findByFarmAndAlarmTypeInOrderByCreatedAtDesc(farm, eventTypes);
            } else {
                alarms = plantAlarmRepository
                        .findByFarmAndAlarmTypeInAndIsReadOrderByCreatedAtDesc(
                                farm, eventTypes, isRead
                        );
            }
        } else {
            // ALL
            if (isRead == null) {
                alarms = plantAlarmRepository.findByFarmOrderByCreatedAtDesc(farm);
            } else {
                alarms = plantAlarmRepository.findByFarmAndIsReadOrderByCreatedAtDesc(farm, isRead);
            }
        }
        return alarms.stream()
                .map(alarm -> modelMapper.map(alarm, AlarmResponseDTO.class))
                .toList();
    }

    @Override
    @Transactional
    public void readAlarm(Long alarmId) {
        PlantAlarmEntity alarm = plantAlarmRepository
                .findById(alarmId)
                .orElseThrow(() -> new IllegalArgumentException("알람 없음"));

        if (!alarm.isRead()) {
            alarm.setRead(true);
            // dirty checking → isRead 컬럽값 1로 update
        }
    }

    public List<AlarmResponseDTO> getUserAlarmPage(
            Long userId,
            String alarmType,
            Boolean isRead
    ) {
        List<PlantAlarmEntity> alarms;
        // 알람 타입 매핑(프론트 기준으로
        List<String> alarmTypes = null;
        if ("SENSOR".equalsIgnoreCase(alarmType)) {
            alarmTypes = List.of("sensor");
        } else if ("EVENT".equalsIgnoreCase(alarmType)) {
            alarmTypes = List.of(
                    "actuator",
                    "preset",
                    "anniversary",
                    "log"
            );
        }
        if (alarmTypes == null) {
            // ALL
            if (isRead == null) {
                alarms = plantAlarmRepository
                        .findByUser_UserIdOrderByCreatedAtDesc(userId);
            } else {
                alarms = plantAlarmRepository
                        .findByUser_UserIdAndIsReadOrderByCreatedAtDesc(userId, isRead);
                }
        } else {
            // SENSOR, EVENT
            if (isRead == null) {
                alarms = plantAlarmRepository
                        .findByUser_UserIdAndAlarmTypeInOrderByCreatedAtDesc(userId, alarmTypes);
            } else {
                alarms = plantAlarmRepository
                        .findByUser_UserIdAndAlarmTypeInAndIsReadOrderByCreatedAtDesc(
                                    userId, alarmTypes, isRead);
            }
        }
        return alarms.stream()
                .map(alarm -> {
                    AlarmResponseDTO dto = modelMapper.map(alarm, AlarmResponseDTO.class);
                    dto.setFarmName(alarm.getFarm().getFarmName());
                    return dto;
                })
                .toList();
    }

    @Override
    public DashboardAlarmResponse getDashboardAlarm(Long farmId) {
        FarmEntity farm = getFarm(farmId);

        LocalDateTime todayStart = LocalDate.now().atStartOfDay();
        LocalDateTime now = LocalDateTime.now();

        List<AlarmResponseDTO> today =
                plantAlarmRepository
                        .findTop10ByFarmAndIsReadFalseAndCreatedAtBetweenOrderByCreatedAtDesc(
                                farm, todayStart, now
                        )
                        .stream()
                        .map(alarm -> {
                            AlarmResponseDTO dto = modelMapper.map(alarm, AlarmResponseDTO.class);
                            dto.setFarmName(alarm.getFarm().getFarmName());
                            return dto;
                        })
                        .toList();

        List<AlarmResponseDTO> previous =
                plantAlarmRepository
                        .findTop10ByFarmAndIsReadFalseAndCreatedAtBeforeOrderByCreatedAtDesc(
                                farm, todayStart
                        )
                        .stream()
                        .map(alarm -> {
                            AlarmResponseDTO dto = modelMapper.map(alarm, AlarmResponseDTO.class);
                            dto.setFarmName(alarm.getFarm().getFarmName());
                            return dto;
                        })
                        .toList();

        return new DashboardAlarmResponse(today, previous);
    }
    @Transactional
    @Override
    public void readDashboardTodayAlarms(Long farmId) {
        FarmEntity farm = getFarm(farmId);

        LocalDateTime start = LocalDate.now().atStartOfDay();
        LocalDateTime now = LocalDateTime.now();

        List<PlantAlarmEntity> alarms =
                plantAlarmRepository
                        .findTop10ByFarmAndIsReadFalseAndCreatedAtBetweenOrderByCreatedAtDesc(
                                farm, start, now
                        );

        alarms.forEach(a -> a.setRead(true));
    }
    @Transactional
    @Override
    public void readDashboardPreviousAlarms(Long farmId) {
        FarmEntity farm = getFarm(farmId);

        LocalDateTime start = LocalDate.now().atStartOfDay();

        List<PlantAlarmEntity> alarms =
                plantAlarmRepository
                        .findTop10ByFarmAndIsReadFalseAndCreatedAtBeforeOrderByCreatedAtDesc(
                                farm, start
                        );

        alarms.forEach(a -> a.setRead(true));
    }
}
