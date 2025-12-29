package com.nova.backend.farm.service;

import com.nova.backend.farm.dao.FarmDAO;
import com.nova.backend.preset.dao.PresetStepDAO;
import com.nova.backend.farm.entity.FarmEntity;
import com.nova.backend.preset.entity.PresetEntity;
import com.nova.backend.preset.entity.PresetStepEntity;
import com.nova.backend.alarm.service.AlarmService;
import com.nova.backend.farm.service.FarmServiceImpl;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.sql.Timestamp;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class FarmServiceImplTest {

    @InjectMocks
    private FarmServiceImpl farmService; // 테스트 대상 (의존성 주입됨)

    @Mock
    private FarmDAO farmDAO; // 가짜 DAO

    @Mock
    private PresetStepDAO presetStepDAO; // 가짜 DAO

    @Mock
    private AlarmService alarmService; // 가짜 알림 서비스

    // 테스트용 엔티티 Mock (실제 객체 대신 동작 검증용)
    @Mock
    private FarmEntity farmEntity;
    @Mock
    private PresetStepEntity currentStep;
    @Mock
    private PresetStepEntity nextStep;
    @Mock
    private PresetEntity presetEntity;

    @Test
    @DisplayName("팜 성장 업데이트: 다음 단계가 존재할 경우 step 업데이트 및 알림 발송")
    void checkFarmStep_Update_Success() {
        // given (상황 설정)
        Long presetId = 1L;
        int currentGrowthStep = 1;

        // 1. 업데이트할 팜 리스트가 있다고 가정
        given(farmDAO.findFarmListToGrow(any(Timestamp.class)))
                .willReturn(List.of(farmEntity));

        // 2. 팜의 현재 상태 설정
        given(farmEntity.getFarmName()).willReturn("테스트농장");
        given(farmEntity.getPresetStep()).willReturn(currentStep);
        given(currentStep.getPreset()).willReturn(presetEntity);
        given(currentStep.getGrowthStep()).willReturn(currentGrowthStep);
        given(presetEntity.getPresetId()).willReturn(presetId);

        // 3. 다음 단계(Next Step)가 DB에 존재한다고 가정
        given(nextStep.getGrowthStep()).willReturn(currentGrowthStep + 1);
        given(presetStepDAO.findByPreset_PresetIdAndGrowthStep(presetId, currentGrowthStep + 1))
                .willReturn(Optional.of(nextStep));

        // when (실행)
        farmService.checkFarmStep();

        // then (검증)
        // 1. 다음 단계 데이터로 업데이트 메서드가 호출되었는가?
        verify(farmEntity, times(1)).updateStep(nextStep);
        // 2. 리셋 메서드는 호출되지 않았는가?
        verify(farmEntity, never()).resetStep();
        // 3. 알림 서비스가 'EVENT' 타입으로 호출되었는가?
        verify(alarmService, times(1)).createSensorAlarm(
                eq(farmEntity),
                eq("EVENT"),
                contains("프리셋 단계 변경"), // 제목에 해당 문구가 포함되는지
                anyString()
        );
    }

    @Test
    @DisplayName("팜 성장 종료: 다음 단계가 없을 경우(마지막 단계) reset 및 종료 알림 발송")
    void checkFarmStep_Finish_Success() {
        // given (상황 설정)
        Long presetId = 1L;
        int lastGrowthStep = 5;

        given(farmDAO.findFarmListToGrow(any(Timestamp.class)))
                .willReturn(List.of(farmEntity));

        given(farmEntity.getFarmName()).willReturn("테스트농장");
        given(farmEntity.getPresetStep()).willReturn(currentStep);
        given(currentStep.getPreset()).willReturn(presetEntity);
        given(currentStep.getGrowthStep()).willReturn(lastGrowthStep);
        given(presetEntity.getPresetId()).willReturn(presetId);

        // 3. 다음 단계가 DB에 없다고 가정 (Optional.empty())
        given(presetStepDAO.findByPreset_PresetIdAndGrowthStep(presetId, lastGrowthStep + 1))
                .willReturn(Optional.empty());

        // when (실행)
        farmService.checkFarmStep();

        // then (검증)
        // 1. 업데이트 메서드는 호출되지 않아야 함
        verify(farmEntity, never()).updateStep(any());
        // 2. 리셋 메서드가 호출되었는가?
        verify(farmEntity, times(1)).resetStep();
        // 3. 종료 알림이 전송되었는가?
        verify(alarmService, times(1)).createSensorAlarm(
                eq(farmEntity),
                eq("EVENT"),
                contains("프리셋 종료"),
                contains("모두 종료되었습니다")
        );
    }

    @Test
    @DisplayName("업데이트할 팜이 없을 경우 로직을 수행하지 않음")
    void checkFarmStep_No_Farms() {
        // given
        // 조회된 리스트가 비어있음
        given(farmDAO.findFarmListToGrow(any(Timestamp.class)))
                .willReturn(Collections.emptyList());

        // when
        farmService.checkFarmStep();

        // then
        // PresetStepDAO나 AlarmService 등 내부 로직이 전혀 실행되지 않아야 함
        verifyNoInteractions(presetStepDAO);
        verifyNoInteractions(alarmService);
    }
}