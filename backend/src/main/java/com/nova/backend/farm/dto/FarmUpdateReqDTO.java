package com.nova.backend.farm.dto;

import com.nova.backend.preset.entity.EnvRange;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
public class FarmUpdateReqDTO {

    // 변경할 이름
    private String farmName;

    // 변경할 단계 리스트
    private List<UpdateStepDto> stepList;

    @Data
    @NoArgsConstructor
    public static class UpdateStepDto {
        // 기존 단계를 수정하려면 ID가 필수입니다.
        // ID가 null이면 "새로 추가된 단계"로 간주하여 처리
        private Long stepId;
        private int growthStep;
        private int periodDays;
        private PresetDto preset;
        // 환경 설정 값 (기존 EnvRange 재사용)
        private EnvRange temp;
        private EnvRange humidity;
        private EnvRange lightPower;
        private EnvRange co2;
        private EnvRange soilMoisture;
    }
    @Data
    @NoArgsConstructor
    public static class PresetDto {
        private Long presetId;
    }
}