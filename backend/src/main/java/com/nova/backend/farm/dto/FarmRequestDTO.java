package com.nova.backend.farm.dto;

import com.nova.backend.nova.dto.NovaRequestDTO;
import com.nova.backend.preset.entity.EnvRange;
import com.nova.backend.user.dto.UsersRequestDTO;
import lombok.Data;

import java.util.List;
@Data
public class FarmRequestDTO {
    // [공통] 팜 기본 정보
    private UsersRequestDTO user;        // 누가 생성하는지
    private Long novaId;        // 어떤 기기인지 (객체 대신 ID만 받음)
    private int slot;           // 몇 번 슬롯인지
    private String farmName;    // 팜 이름

    // [Case 1] 기존 프리셋 사용 시 -> ID만 보냄
    private Long existingPresetId;

    // [Case 2] 새로운 프리셋 생성 시 -> 아래 정보들을 채워서 보냄 (existingPresetId는 null)
    private String presetName;
    private String plantType;
    private List<NewPresetStepDto> stepList;

    @Data
    public static class NewPresetStepDto {
        private int growthStep;
        private int periodDays;

        // 환경 설정 값 (JSON 매핑용)
        private EnvRange temp;
        private EnvRange humidity;
        private EnvRange lightPower;
        private EnvRange co2;
        private EnvRange soilMoisture;
    }
}
